import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { clearToken, getToken } from "@/lib/auth";
import { getMyOrder } from "@/lib/orders";
import { formatUsd } from "@/lib/format";
import { formatLongFR } from "@/lib/dates";
import {
  ORDER_MODE_LABEL,
  ORDER_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_LABEL,
  orderStatusClass,
} from "@/lib/order-status";

export const metadata = { title: "Détail de la commande" };

const eventFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function CommandeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getToken();
  if (!token) redirect("/app/connexion");

  const res = await getMyOrder(id, token);
  if (!res.ok) {
    // Une commande vraiment inexistante → 404 ; sinon on n'affiche PAS « introuvable »
    // pour une simple panne réseau ou une session expirée.
    if (res.status === 404) notFound();
    if (res.status === 401) {
      await clearToken();
      redirect("/app/connexion");
    }
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <Link
          href="/app/commandes"
          className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted transition-colors hover:text-brand"
        >
          ← Mes commandes
        </Link>
        <div
          role="alert"
          className="rounded-card border border-ink/10 bg-surface px-6 py-12 text-center"
        >
          <p className="font-medium text-ink">
            Impossible d&apos;afficher cette commande.
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Vérifiez votre connexion, puis réessayez.
          </p>
          <Link
            href={`/app/commandes/${id}`}
            className="mt-4 inline-block rounded-btn bg-ink px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
          >
            Réessayer
          </Link>
        </div>
      </div>
    );
  }
  const o = res.data;
  // La timeline suit l'ordre chronologique réel (ne pas se fier à l'ordre reçu).
  const events = [...o.events].sort((a, b) =>
    a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0,
  );

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <Link
        href="/app/commandes"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted transition-colors hover:text-brand"
      >
        ← Mes commandes
      </Link>

      {/* En-tête */}
      <div className="rounded-card border border-ink/10 bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="font-display text-xl font-bold text-ink">{o.code}</h1>
          <span
            className={`rounded-chip px-2.5 py-1 text-xs font-medium ${orderStatusClass(
              o.status,
            )}`}
          >
            {ORDER_STATUS_LABEL[o.status] ?? o.status}
          </span>
        </div>
        <p className="mt-1 text-sm capitalize text-ink-soft">
          {formatLongFR(o.deliveryDate)} · {o.deliveryTime}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Info label="Mode" value={ORDER_MODE_LABEL[o.mode]} />
          <Info
            label="Paiement"
            value={`${PAYMENT_METHOD_LABEL[o.paymentMethod]} · ${
              PAYMENT_STATUS_LABEL[o.paymentStatus]
            }`}
          />
          {o.address && <Info label="Lieu" value={o.address} />}
          {o.landmark && <Info label="Point de repère" value={o.landmark} />}
        </dl>
        {o.note && (
          <p className="mt-3 rounded-btn bg-cream-deep px-3 py-2 text-sm text-ink-soft">
            « {o.note} »
          </p>
        )}
      </div>

      {/* Plats */}
      <div className="rounded-card border border-ink/10 bg-surface p-5">
        <h2 className="mb-3 font-display font-semibold text-ink">Votre panier</h2>
        <ul className="divide-y divide-ink/10">
          {o.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-2 py-2 text-sm"
            >
              <span className="min-w-0 truncate text-ink">
                <span className="font-semibold">{item.quantity}×</span>{" "}
                {item.name}
              </span>
              <span className="shrink-0 text-ink-soft">
                {formatUsd(item.priceCents * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-2 space-y-1.5 border-t border-ink/10 pt-3 text-sm">
          {o.deliveryFeeCents > 0 && (
            <div className="flex items-center justify-between text-ink-soft">
              <span>Frais de livraison</span>
              <span>{formatUsd(o.deliveryFeeCents)}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-0.5">
            <span className="font-semibold text-ink">Total</span>
            <span className="font-display text-lg font-bold text-brand">
              {formatUsd(o.totalCents)}
            </span>
          </div>
        </div>
      </div>

      {/* Suivi */}
      <div className="rounded-card border border-ink/10 bg-surface p-5">
        <h2 className="mb-4 font-display font-semibold text-ink">Suivi</h2>
        <ol className="relative space-y-4 border-l border-ink/15 pl-5">
          {events.map((event, i) => {
            const last = i === events.length - 1;
            return (
              <li key={event.id} className="relative">
                <span
                  className={`absolute -left-[1.65rem] size-3 rounded-full ring-4 ring-surface ${
                    last ? "bg-brand" : "bg-ink/25"
                  }`}
                />
                <p
                  className={`text-sm ${
                    last ? "font-semibold text-ink" : "text-ink-soft"
                  }`}
                >
                  {ORDER_STATUS_LABEL[event.status] ?? event.status}
                  {last && " · état actuel"}
                </p>
                <p className="text-xs text-ink-muted">
                  {eventFmt.format(new Date(event.createdAt))}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}
