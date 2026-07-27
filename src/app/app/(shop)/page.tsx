import Link from "next/link";
import { getToken } from "@/lib/auth";
import { getMenu, getOrderingWindow } from "@/lib/orders";
import { OrderComposer } from "@/components/app/order-composer";
import {
  addDays,
  formatLongFR,
  formatShortFR,
  todayISO,
  weekdayShortFR,
} from "@/lib/dates";

export const metadata = { title: "Commander" };

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export default async function CommanderPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string | string[] }>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.date) ? sp.date[0] : sp.date;

  const token = await getToken();

  // La 1re date commandable et le cut-off viennent du SERVEUR (fuseau de Goma) :
  // le client et le serveur appliquent ainsi exactement la même règle.
  const winRes = token ? await getOrderingWindow(token) : null;
  const earliest = winRes?.ok ? winRes.data.earliest : todayISO();
  const cutoff = winRes?.ok ? winRes.data.cutoff : "09:00";

  const requested = raw && ISO.test(raw) ? raw : earliest;
  // Borne basse ET haute : on reste dans la fenêtre des 10 jours proposés.
  const latest = addDays(earliest, 9);
  const date =
    requested < earliest ? earliest : requested > latest ? latest : requested;
  const dateOptions = Array.from({ length: 10 }, (_, i) => addDays(earliest, i));

  const menuRes = token ? await getMenu(date, token) : null;
  const dishes = menuRes?.ok ? menuRes.data.dishes : [];
  const deliveryFeeCents = menuRes?.ok ? menuRes.data.deliveryFeeCents : 0;
  const error = menuRes && !menuRes.ok ? menuRes.message : null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink">Commander</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Choisissez le jour de livraison et composez votre panier. Les commandes
          du jour se ferment à {cutoff}.
        </p>
      </header>

      {/* Sélecteur de dates */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {dateOptions.map((d) => {
          const active = d === date;
          return (
            <Link
              key={d}
              href={`/app?date=${d}`}
              className={`flex shrink-0 flex-col items-center rounded-card border px-4 py-2.5 transition-colors ${
                active
                  ? "border-brand bg-brand text-cream"
                  : "border-ink/10 bg-surface text-ink-soft hover:border-brand/40"
              }`}
            >
              <span className="text-xs font-medium capitalize">
                {weekdayShortFR(d)}
              </span>
              <span className="text-sm font-bold">{formatShortFR(d)}</span>
            </Link>
          );
        })}
      </div>

      <p className="text-sm font-semibold capitalize text-ink">
        {formatLongFR(date)}
      </p>

      {error ? (
        <div
          role="alert"
          className="rounded-card border border-ink/10 bg-surface px-4 py-8 text-center"
        >
          <p className="text-sm font-medium text-ink">
            Le menu n&apos;a pas pu être chargé.
          </p>
          <p className="mt-1 text-sm text-ink-soft">{error}</p>
          <Link
            href={`/app?date=${date}`}
            className="mt-4 inline-block rounded-btn bg-ink px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
          >
            Réessayer
          </Link>
        </div>
      ) : (
        <OrderComposer
          key={date}
          date={date}
          dishes={dishes}
          deliveryFeeCents={deliveryFeeCents}
        />
      )}
    </div>
  );
}
