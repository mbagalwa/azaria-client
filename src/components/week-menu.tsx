"use client";

import { useState } from "react";
import { OrderDialog } from "@/components/order-dialog";
import { formatShortFR, weekdayShortFR } from "@/lib/dates";
import { formatUsd } from "@/lib/format";
import type { MenuDay } from "@/lib/orders";

/**
 * Les plats de la semaine, en grille de cartes d'après design/list.png :
 * photo carrée, repère de popularité, prix (barré quand la date est
 * programmée en promotion) et bouton compact. Un clic sur « Commander »
 * ouvre le formulaire — aucun compte n'est demandé.
 *
 * Deux écarts assumés avec le modèle : chaque carte est un JOUR et non un
 * produit (d'où la date en surtitre), et le badge de notation devient un
 * compteur de commandes réelles — il n'existe aucun système d'avis.
 */
export function WeekMenu({
  days,
  deliveryFeeCents,
  today,
  earliest,
}: {
  days: MenuDay[];
  deliveryFeeCents: number;
  /** Date du jour dans le fuseau métier (calculée par l'API). */
  today: string;
  /** 1re date commandable : avant elle, le cut-off est passé. */
  earliest: string;
}) {
  const [openDate, setOpenDate] = useState<string | null>(null);
  const active = days.find((d) => d.date === openDate && d.dish);

  return (
    <>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {days.map((day) => (
          <DayCard
            key={day.date}
            day={day}
            isToday={day.date === today}
            orderable={day.date >= earliest}
            onOrder={() => setOpenDate(day.date)}
          />
        ))}
      </div>

      {active?.dish && (
        <OrderDialog
          date={active.date}
          dish={active.dish}
          deliveryFeeCents={deliveryFeeCents}
          open
          onClose={() => setOpenDate(null)}
        />
      )}
    </>
  );
}

function DayCard({
  day,
  isToday,
  orderable,
  onOrder,
}: {
  day: MenuDay;
  isToday: boolean;
  orderable: boolean;
  onOrder: () => void;
}) {
  const dish = day.dish;
  /** Promotion réelle : le prix du programme passe sous le prix catalogue. */
  const onSale = dish ? dish.catalogPriceCents > dish.priceCents : false;

  return (
    <article
      className={`group relative flex flex-col rounded-card border bg-surface p-3 transition-shadow hover:shadow-[0_20px_45px_-25px_rgba(18,59,46,0.5)] ${
        isToday ? "border-ink ring-1 ring-ink" : "border-ink/10"
      }`}
    >
      <div className="relative aspect-square overflow-hidden rounded-chip bg-cream">
        {dish?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dish.imageUrl}
            alt={dish.name}
            /* Section sous la ligne de flottaison : les 7 photos ne se
               téléchargent qu'à l'approche du viewport. Le cadre ayant un
               ratio fixe, rien ne se décale à leur arrivée. */
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              orderable ? "" : "grayscale"
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-muted/60">
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 2v20M4 2v6a3 3 0 0 0 6 0V2M17 2c-1.5 2-2 4-2 6s.5 3 2 3 2-1 2-3-.5-4-2-6zM17 11v11" />
            </svg>
          </div>
        )}

        {/* Popularité réelle — remplace la notation du modèle */}
        {dish && dish.orderCount > 0 && (
          <span
            className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-chip bg-surface/95 px-2 py-1 text-[0.68rem] font-bold text-ink shadow-sm"
            title={`Déjà commandé ${dish.orderCount} fois`}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="text-brand"
            >
              <path d="M12 2.7s6 6.5 6 11.3a6 6 0 0 1-12 0C6 9.2 12 2.7 12 2.7z" />
            </svg>
            {dish.orderCount}
            <span className="sr-only"> commandes déjà passées</span>
          </span>
        )}

        {/* Promotion : seulement si le prix programmé est réellement plus bas */}
        {onSale && (
          <span className="absolute left-2 top-2 rounded-chip bg-brand px-2 py-1 text-[0.62rem] font-bold uppercase tracking-wide text-white shadow-sm">
            Promo
          </span>
        )}

        {!dish && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
            <span className="rounded-chip bg-surface/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink">
              Pas de service
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-0.5 pt-3">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-ink-muted">
          <span className={isToday ? "text-brand" : undefined}>
            {isToday ? "Aujourd'hui" : weekdayShortFR(day.date)}
          </span>
          <span className="ml-1.5 font-semibold">{formatShortFR(day.date)}</span>
        </p>

        <h3 className="mt-1 line-clamp-2 text-[0.9rem] font-semibold leading-snug text-ink">
          {dish?.name ?? "Pas de service"}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          {!dish ? (
            <span className="text-xs font-semibold text-ink-muted">
              Indisponible
            </span>
          ) : !orderable ? (
            <span className="text-xs font-semibold text-ink-muted">
              Commandes closes
            </span>
          ) : (
            <button
              type="button"
              onClick={onOrder}
              className={`inline-flex items-center gap-1.5 rounded-btn px-3 py-2 text-xs font-semibold transition-colors ${
                isToday
                  ? "bg-ink text-cream hover:bg-ink-soft"
                  : "border border-ink/15 text-ink hover:border-ink hover:bg-cream"
              }`}
            >
              Commander
              <span
                className={isToday ? "text-amber" : "text-brand"}
                aria-hidden="true"
              >
                +
              </span>
            </button>
          )}

          {dish && (
            <p className="shrink-0 text-right leading-none">
              {onSale && (
                <s className="block text-[0.7rem] font-medium text-ink-muted">
                  {formatUsd(dish.catalogPriceCents)}
                </s>
              )}
              <span
                className={`mt-1 block font-display text-lg font-extrabold ${
                  onSale ? "text-brand-dark" : "text-ink"
                }`}
              >
                {formatUsd(dish.priceCents)}
              </span>
              <span className="mt-1 block text-[0.62rem] text-ink-muted">
                l&apos;assiette
              </span>
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
