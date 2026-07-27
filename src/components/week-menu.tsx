"use client";

import { useState } from "react";
import { OrderDialog } from "@/components/order-dialog";
import { formatShortFR, weekdayShortFR } from "@/lib/dates";
import { formatUsd } from "@/lib/format";
import type { MenuDay } from "@/lib/orders";

/**
 * Les plats de la semaine : UN plat par jour. Un clic sur « Commander » ouvre
 * le formulaire — aucun compte n'est demandé.
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
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-card border bg-surface transition-shadow hover:shadow-[0_20px_45px_-25px_rgba(18,59,46,0.5)] ${
        isToday ? "border-amber-deep ring-1 ring-amber-deep" : "border-ink/10"
      }`}
    >
      <div className="relative aspect-4/3 overflow-hidden bg-cream-deep">
        {dish?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              orderable ? "" : "grayscale"
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-muted">
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

        {/* Pastille jour + date */}
        <span
          className={`absolute left-3 top-3 rounded-chip px-2.5 py-1 text-[0.7rem] font-bold capitalize shadow-sm ${
            isToday ? "bg-amber text-ink" : "bg-surface/95 text-ink"
          }`}
        >
          {weekdayShortFR(day.date)}
          <span className="ml-1.5 font-medium text-ink-muted">
            {formatShortFR(day.date)}
          </span>
        </span>

        {isToday && dish && (
          <span className="absolute right-3 top-3 rounded-chip bg-ink px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-cream shadow-sm">
            Aujourd&apos;hui
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

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-[0.95rem] font-bold leading-snug text-ink">
          {dish?.name ?? "—"}
        </h3>

        {dish && dish.accompaniments.length > 0 && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-muted">
            Servi avec {dish.accompaniments.map((a) => a.name).join(", ")}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="font-display text-lg font-extrabold text-ink">
            {dish ? formatUsd(dish.priceCents) : "—"}
          </span>

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
              className="inline-flex items-center gap-1.5 rounded-btn bg-ink px-3.5 py-2 text-xs font-semibold text-cream transition-colors hover:bg-ink-soft"
            >
              Commander
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="text-amber"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
