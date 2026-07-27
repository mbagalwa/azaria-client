import Image from "next/image";
import { weekProgram } from "@/lib/site";

type Day = (typeof weekProgram.days)[number];

function DayCard({ day }: { day: Day }) {
  const soldOut = day.status === "sold_out";
  const today = "today" in day && day.today;

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-card border bg-surface transition-shadow hover:shadow-[0_20px_45px_-25px_rgba(18,59,46,0.5)] ${
        today ? "border-amber-deep ring-1 ring-amber-deep" : "border-ink/10"
      }`}
    >
      {/* Image du plat */}
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={day.image}
          alt={day.dish}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 20vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            soldOut ? "grayscale" : ""
          }`}
        />

        {/* Voile + mention si le plat est épuisé */}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/45">
            <span className="rounded-chip bg-surface/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink">
              Épuisé
            </span>
          </div>
        )}

        {/* Pastille jour + date, en haut à gauche */}
        <span
          className={`absolute left-3 top-3 rounded-chip px-2.5 py-1 text-[0.7rem] font-bold shadow-sm ${
            today ? "bg-amber text-ink" : "bg-surface/95 text-ink"
          }`}
        >
          {day.day}
          <span className="ml-1.5 font-medium text-ink-muted">{day.date}</span>
        </span>

        {today && !soldOut && (
          <span className="absolute right-3 top-3 rounded-chip bg-ink px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-cream shadow-sm">
            Aujourd&apos;hui
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-[0.95rem] font-bold leading-snug text-ink">
          {day.dish}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="font-display text-lg font-extrabold text-ink">
            {day.price}
          </span>

          {soldOut ? (
            <span className="text-xs font-semibold text-ink-muted">
              Indisponible
            </span>
          ) : (
            <a
              href="#"
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
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function WeekProgram() {
  return (
    <section id="menu" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
      {/* En-tête de section */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {weekProgram.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.015em] text-ink sm:text-4xl">
            {weekProgram.title}
          </h2>
          <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink-muted">
            {weekProgram.intro}
          </p>
        </div>

        {/* Indicateur de semaine - deviendra un sélecteur avec l'API */}
        <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-btn border border-ink/10 bg-surface px-4 py-2.5 text-sm font-semibold text-ink-soft sm:self-auto">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="text-brand"
          >
            <rect x="3" y="4.5" width="18" height="17" rx="2.5" />
            <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
          </svg>
          {weekProgram.range}
        </span>
      </div>

      {/* Grille des jours */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {weekProgram.days.map((day) => (
          <DayCard key={day.key} day={day} />
        ))}
      </div>

      {/* Note : commande à l'avance */}
      <p className="mt-8 flex items-center justify-center gap-2 text-center text-[0.8rem] text-ink-muted">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0 text-brand"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
        Commandez la veille pour être livré ou servi à l&apos;heure voulue.
      </p>
    </section>
  );
}
