import Link from "next/link";
import { getToken } from "@/lib/auth";
import { listMyOrders } from "@/lib/orders";
import { formatUsd } from "@/lib/format";
import { formatLongFR } from "@/lib/dates";
import {
  ORDER_MODE_LABEL,
  ORDER_STATUS_LABEL,
  orderStatusClass,
} from "@/lib/order-status";

export const metadata = { title: "Mes commandes" };

export default async function MesCommandesPage() {
  const token = await getToken();
  const res = token ? await listMyOrders(token, { limit: 50 }) : null;
  const failed = res != null && !res.ok;
  const orders = res?.ok ? res.data : [];

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Mes commandes
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Retrouvez l&apos;historique de vos commandes.
          </p>
        </div>
        <Link
          href="/app"
          className="rounded-btn bg-brand px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-brand-dark"
        >
          Commander
        </Link>
      </header>

      {failed ? (
        <div
          role="alert"
          className="rounded-card border border-ink/10 bg-surface px-6 py-14 text-center"
        >
          <p className="font-medium text-ink">
            Impossible de charger vos commandes.
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Vérifiez votre connexion, puis réessayez.
          </p>
          <Link
            href="/app/commandes"
            className="mt-3 inline-block rounded-btn bg-ink px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
          >
            Réessayer
          </Link>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-card border border-dashed border-ink/15 bg-surface px-6 py-14 text-center">
          <p className="text-ink-soft">Vous n&apos;avez pas encore commandé.</p>
          <Link
            href="/app"
            className="mt-3 inline-block rounded-btn bg-ink px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
          >
            Passer ma première commande
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/app/commandes/${o.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-ink/10 bg-surface p-4 transition-colors hover:border-brand/40"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2">
                    <span className="font-display font-semibold text-ink">
                      {o.code}
                    </span>
                    <span
                      className={`rounded-chip px-2 py-0.5 text-xs font-medium ${orderStatusClass(
                        o.status,
                      )}`}
                    >
                      {ORDER_STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </p>
                  <p className="mt-0.5 text-sm capitalize text-ink-soft">
                    {formatLongFR(o.deliveryDate)} · {o.deliveryTime} ·{" "}
                    {ORDER_MODE_LABEL[o.mode]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-brand">
                    {formatUsd(o.totalCents)}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {o.itemsCount} plat{o.itemsCount > 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
