import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OrderTimeline } from "@/components/order-timeline";
import { CustomerRealtime } from "@/components/app/customer-realtime";
import { ToastProvider } from "@/components/app/toast";
import { getOrderByCode } from "@/lib/orders";
import { formatLongFR } from "@/lib/dates";
import { formatUsd } from "@/lib/format";
import {
  ORDER_MODE_LABEL,
  ORDER_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_LABEL,
  orderStatusClass,
} from "@/lib/order-status";

export const metadata = { title: "Suivi de commande · Azaria" };

/**
 * Suivi PUBLIC d'une commande par son code — le lien envoyé au client sur
 * WhatsApp. Aucun compte : le code fait office de clé.
 */
export default async function SuiviCommandePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const res = await getOrderByCode(code);

  if (!res.ok && res.status === 404) notFound();

  if (!res.ok) {
    return (
      <Shell>
        <p className="rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {res.message}
        </p>
      </Shell>
    );
  }

  const order = res.data;
  const itemsTotal = order.totalCents - order.deliveryFeeCents;

  return (
    <ToastProvider>
      <CustomerRealtime code={order.code} />
      <Shell>
        <div className="space-y-6">
          {/* En-tête */}
          <div className="rounded-card border border-ink/10 bg-surface p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                  Commande {order.code}
                </p>
                <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight text-ink">
                  Bonjour {order.customer.fullName.split(" ")[0]} 👋
                </h1>
                <p className="mt-1 text-sm text-ink-muted">
                  <span className="capitalize">
                    {formatLongFR(order.deliveryDate)}
                  </span>{" "}
                  à {order.deliveryTime} · {ORDER_MODE_LABEL[order.mode]}
                </p>
              </div>
              <span
                className={`rounded-chip px-3 py-1.5 text-xs font-bold ${orderStatusClass(order.status)}`}
              >
                {ORDER_STATUS_LABEL[order.status] ?? order.status}
              </span>
            </div>

            {order.address && (
              <p className="mt-4 text-sm text-ink-muted">
                📍 {order.address}
                {order.landmark && ` (${order.landmark})`}
              </p>
            )}
            {order.note && (
              <p className="mt-1.5 text-sm text-ink-muted">📝 {order.note}</p>
            )}
          </div>

          {/* Détail */}
          <div className="rounded-card border border-ink/10 bg-surface p-5 sm:p-6">
            <h2 className="font-display text-lg font-extrabold text-ink">
              Votre commande
            </h2>
            <ul className="mt-3 divide-y divide-ink/10">
              {order.items.map((item) => {
                const extrasCents = item.accompaniments.reduce(
                  (sum, a) => sum + a.priceCents,
                  0,
                );
                return (
                  <li key={item.id} className="py-3">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="min-w-0 text-ink">
                        <span className="font-bold">×{item.quantity}</span>{" "}
                        {item.name}
                      </span>
                      <span className="shrink-0 font-medium text-ink">
                        {formatUsd((item.priceCents + extrasCents) * item.quantity)}
                      </span>
                    </div>
                    {item.accompaniments.length > 0 && (
                      <p className="mt-1 pl-4 text-xs text-ink-muted">
                        ↳ {item.accompaniments.map((a) => a.name).join(", ")}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-3 space-y-1.5 border-t border-ink/10 pt-3 text-sm">
              <Row label="Sous-total" value={formatUsd(itemsTotal)} />
              {order.deliveryFeeCents > 0 && (
                <Row
                  label="Frais de livraison"
                  value={formatUsd(order.deliveryFeeCents)}
                />
              )}
              <div className="flex items-center justify-between font-display text-base font-extrabold text-ink">
                <span>Total</span>
                <span>{formatUsd(order.totalCents)}</span>
              </div>
              <p className="text-xs text-ink-muted">
                {PAYMENT_METHOD_LABEL[order.paymentMethod]} ·{" "}
                {PAYMENT_STATUS_LABEL[order.paymentStatus]}
              </p>
            </div>
          </div>

          {/* Suivi */}
          <div className="rounded-card border border-ink/10 bg-surface p-5 sm:p-6">
            <h2 className="font-display text-lg font-extrabold text-ink">
              Suivi
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Chaque étape vous est aussi envoyée sur WhatsApp.
            </p>
            <div className="mt-4">
              <OrderTimeline events={order.events} />
            </div>
          </div>

          <Link
            href="/#menu"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 hover:underline"
          >
            ← Retour au menu
          </Link>
        </div>
      </Shell>
    </ToastProvider>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-ink-muted">
      <span>{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10 sm:px-8 lg:py-16">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
