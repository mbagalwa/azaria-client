"use client";

import { useState } from "react";
import { OrderDialog } from "@/components/order-dialog";
import { formatLongFR } from "@/lib/dates";
import { formatUsd } from "@/lib/format";
import type { MenuDish } from "@/lib/orders";
import { dishOfDay, site } from "@/lib/site";

const listFR = new Intl.ListFormat("fr", { style: "long", type: "conjunction" });

/**
 * Phrase de composition rédigée à partir des accompagnements réels, dans
 * l'esprit de l'affiche officielle (« composé de poulet braisé, sauce
 * tartare et bananes frits »). Ce qui est inclus et ce qui est en
 * supplément sont annoncés séparément : le prix affiché plus haut ne
 * couvre que les premiers.
 */
function composition(sides: MenuDish["accompaniments"]): string | null {
  const names = (list: MenuDish["accompaniments"]) =>
    listFR.format(list.map((s) => s.name.toLowerCase()));

  const included = sides.filter((s) => s.priceCents === 0);
  const extras = sides.filter((s) => s.priceCents > 0);
  if (included.length === 0 && extras.length === 0) return null;

  const parts: string[] = [];
  if (included.length > 0) parts.push(`Servi avec ${names(included)}.`);
  if (extras.length > 0) parts.push(`En supplément : ${names(extras)}.`);
  return parts.join(" ");
}

/**
 * Hero « Plat du jour », calqué sur l'affiche officielle
 * (design/affiche_model.png). À gauche le fil de lecture : quel jour,
 * quel plat, de quoi il est composé, ce que ça coûte, comment commander.
 * À droite un panneau ambre : la photo du plat puis chaque composant
 * nommé, comme les assiettes légendées de l'affiche.
 *
 * TOUT le contenu du plat vient de l'API (nom, description, catégorie,
 * photo, prix figé du programme, accompagnements et leurs suppléments) :
 * la page choisit le premier jour encore commandable et le passe ici.
 * Seuls les textes de marque sont fixes, dans `lib/site.ts`.
 */
export function DishOfDay({
  date,
  dish,
  deliveryFeeCents,
  isToday,
  cutoff,
}: {
  /** Date ISO du plat mis en avant. */
  date: string;
  dish: MenuDish;
  deliveryFeeCents: number;
  /** Faux si le cut-off du jour est passé : on met en avant le lendemain. */
  isToday: boolean;
  /** Heure limite de commande, ex. "09:00". */
  cutoff: string;
}) {
  const [open, setOpen] = useState(false);
  const sides = dish.accompaniments;
  const madeOf = composition(sides);

  return (
    <section
      id="plat-du-jour"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-14 sm:px-8 lg:pb-20"
    >
      <div className="grid items-center gap-10 lg:min-h-[calc(100svh-9rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        {/* ---------------------------------------------- Colonne détails */}
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-chip bg-amber px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink">
            <span className="size-1.5 rounded-full bg-ink" aria-hidden="true" />
            {isToday ? "Aujourd'hui en cuisine" : "Prochain service"}
          </span>

          {/* Le libellé annonce, le NOM DU PLAT porte : c'est lui qui doit
              accrocher l'œil, pas l'intitulé générique de la section. */}
          <h1 className="mt-5 font-display text-[2rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-[2.3rem] lg:text-[2.6rem]">
            Le plat du <span className="marker-highlight">jour</span>
          </h1>
          <p className="mt-2 font-signature text-[1.6rem] leading-none text-brand-dark">
            du {formatLongFR(date)}
          </p>

          {/* Le trait sépare la promesse (ci-dessus) du plat réel (dessous) */}
          <span className="mt-6 h-px w-14 bg-ink/15" aria-hidden="true" />

          <h2 className="mt-5 max-w-xl font-display text-[2.4rem] font-extrabold leading-[1.03] tracking-[-0.025em] text-ink sm:text-[2.9rem] lg:text-[3.3rem]">
            {dish.name}
          </h2>
          {dish.description && (
            <p className="mt-2.5 max-w-md text-[0.95rem] leading-relaxed text-ink-muted">
              {dish.description}
            </p>
          )}

          {/* De quoi le repas est composé, rédigé depuis les accompagnements */}
          {madeOf && (
            <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink-soft">
              {madeOf}{" "}
              <span className="text-ink-muted">{dishOfDay.pitch}</span>
            </p>
          )}

          {/* Le prix en clair : repas, livraison, et ce que ça fait au total */}
          <dl className="mt-7 grid w-full max-w-md grid-cols-2 gap-2.5 sm:grid-cols-3">
            <PriceTile
              label="Prix du repas"
              value={formatUsd(dish.priceCents)}
              oldValue={
                dish.catalogPriceCents > dish.priceCents
                  ? formatUsd(dish.catalogPriceCents)
                  : undefined
              }
            />
            <PriceTile
              label="Livraison"
              value={formatUsd(deliveryFeeCents)}
              hint={site.contact.address}
            />
            <div className="col-span-2 rounded-card bg-ink px-4 py-3 sm:col-span-1">
              <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-cream/60">
                Total à partir de
              </dt>
              <dd className="mt-1 font-display text-xl font-extrabold text-amber">
                {formatUsd(dish.priceCents + deliveryFeeCents)}
              </dd>
            </div>
          </dl>

          <p className="mt-4 inline-flex items-center gap-2 rounded-chip bg-amber-tint px-3 py-2 text-xs font-semibold text-ink-soft">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="shrink-0 text-brand-dark"
            >
              <path d="M12 2.7s6 6.5 6 11.3a6 6 0 0 1-12 0C6 9.2 12 2.7 12 2.7z" />
            </svg>
            {dishOfDay.perk}
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center rounded-btn bg-ink px-8 py-4 text-sm font-semibold text-cream shadow-[0_14px_30px_-16px_rgba(18,59,46,0.9)] transition-colors hover:bg-ink-soft"
            >
              {dishOfDay.cta}
            </button>
            <a
              href="#menu"
              className="inline-flex items-center justify-center rounded-btn border border-ink/20 px-8 py-4 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-surface"
            >
              Voir la semaine
            </a>
          </div>

          <p className="mt-4 inline-flex items-center gap-2 text-xs text-ink-muted">
            <ClockIcon />
            {isToday
              ? `Commandes du jour jusqu'à ${cutoff}.`
              : "Le service d'aujourd'hui est clos — réservez dès maintenant."}
          </p>

          <Guarantees />

          <p
            className="mt-6 font-signature text-[1.4rem] text-ink/45"
            aria-hidden="true"
          >
            — {site.slogan} —
          </p>
        </div>

        {/* --------------------------------------------- Panneau images */}
        <div className="rounded-panel bg-amber p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-ink/70">
              Le choix du jour
            </p>
            {sides.length > 0 && (
              <span className="rounded-chip bg-ink/10 px-2.5 py-1 text-[0.68rem] font-semibold text-ink/75">
                {sides.length} accompagnement{sides.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* L'assiette du jour, avec sa catégorie en incrustation */}
          <div className="relative mt-4 aspect-16/10 overflow-hidden rounded-card bg-ink/5 shadow-[0_24px_50px_-24px_rgba(18,59,46,0.65)] ring-1 ring-ink/10">
            <DishPhoto src={dish.imageUrl} alt={dish.name} />
            {dish.category && (
              <span className="absolute left-3 top-3 rounded-chip bg-ink/85 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-cream backdrop-blur-sm">
                {dish.category}
              </span>
            )}
          </div>

          {/* Chaque composant nommé, comme les assiettes légendées de l'affiche */}
          {sides.length > 0 && (
            <>
              <p className="mt-5 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-ink/70">
                Composition
              </p>
              <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
                {sides.map((side) => (
                  <li
                    key={side.id}
                    className="flex items-center gap-3 rounded-card bg-surface px-3 py-2.5"
                  >
                    {side.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={side.imageUrl}
                        alt=""
                        width={40}
                        height={40}
                        /* Vignettes secondaires : elles peuvent attendre,
                           la photo du plat passe en premier. */
                        loading="lazy"
                        decoding="async"
                        className="size-10 shrink-0 rounded-chip object-cover"
                      />
                    ) : (
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-chip bg-amber-tint text-amber-deep"
                        aria-hidden="true"
                      >
                        <BowlIcon />
                      </span>
                    )}

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.82rem] font-bold text-ink">
                        {side.name}
                      </span>
                      {side.description && (
                        <span className="block truncate text-[0.7rem] text-ink-muted">
                          {side.description}
                        </span>
                      )}
                    </span>

                    <span
                      className={`shrink-0 rounded-chip px-2 py-0.5 text-[0.66rem] font-bold ${
                        side.priceCents > 0
                          ? "bg-brand-tint text-brand-dark"
                          : "bg-ink/8 text-ink-muted"
                      }`}
                    >
                      {side.priceCents > 0
                        ? `+${formatUsd(side.priceCents)}`
                        : "Inclus"}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <a
            href="#menu"
            className="group mt-6 flex items-center justify-between gap-3 rounded-btn bg-ink px-5 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
          >
            Explorer le menu de la semaine
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="shrink-0 text-amber transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>

      {open && (
        <OrderDialog
          date={date}
          dish={dish}
          deliveryFeeCents={deliveryFeeCents}
          open
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  );
}

/** Tuile de prix - même gabarit pour le repas et la livraison. */
function PriceTile({
  label,
  value,
  hint,
  oldValue,
}: {
  label: string;
  value: string;
  /** Précision sous le montant, ex. la commune desservie. */
  hint?: string;
  /** Prix catalogue barré, uniquement quand la date est en promotion. */
  oldValue?: string;
}) {
  return (
    <div className="rounded-card border border-ink/10 bg-surface px-4 py-3">
      <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
        {label}
        {oldValue && (
          <s className="ml-1.5 font-medium tracking-normal text-ink-muted/80">
            {oldValue}
          </s>
        )}
      </dt>
      <dd
        className={`mt-1 font-display text-xl font-extrabold ${
          oldValue ? "text-brand-dark" : "text-ink"
        }`}
      >
        {value}
        {hint && (
          <span className="mt-0.5 block font-sans text-[0.62rem] font-medium tracking-normal text-ink-muted">
            {hint}
          </span>
        )}
      </dd>
    </div>
  );
}

/**
 * Photo du plat — UNIQUEMENT celle enregistrée depuis l'admin (Cloudinary).
 * Aucune image de substitution : montrer une assiette du dossier `public`
 * ferait passer une photo d'ambiance pour le plat réellement servi. Sans
 * photo, on affiche le même cadre neutre que les cartes de la semaine.
 *
 * Les URL étant distantes, elles passent par `<img>` : aucun domaine
 * n'est déclaré pour next/image.
 */
function DishPhoto({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="flex h-full items-center justify-center bg-cream text-ink-muted/60">
        <svg
          width="46"
          height="46"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 2v20M4 2v6a3 3 0 0 0 6 0V2M17 2c-1.5 2-2 4-2 6s.5 3 2 3 2-1 2-3-.5-4-2-6zM17 11v11" />
        </svg>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      /* Surtout PAS de lazy ici : c'est la plus grande image de la page,
         visible d'emblée, donc l'élément qui décide du LCP. La différer
         retarderait l'affichage au lieu de l'accélérer. */
      loading="eager"
      fetchPriority="high"
      decoding="async"
      className="h-full w-full object-cover"
    />
  );
}

/** Bandeau de réassurance, repris du pied de l'affiche officielle. */
function Guarantees() {
  return (
    <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink/10 pt-5 text-[0.72rem] font-semibold text-ink-muted">
      {dishOfDay.guarantees.map((label) => (
        <li key={label} className="inline-flex items-center gap-1.5">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0 text-brand"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          {label}
        </li>
      ))}
    </ul>
  );
}

/** Pictogramme neutre tant qu'un accompagnement n'a pas de photo. */
function BowlIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 11h18a9 9 0 0 1-18 0ZM8 7c0-1.5 1-2.5 1-2.5M12 7c0-2 1.2-3 1.2-3M16 7c0-1.5 1-2.5 1-2.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
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
  );
}

/**
 * Repli du hero quand aucun plat n'est affichable (API indisponible ou
 * semaine pas encore programmée) : la promesse de la marque, sans plat.
 */
export function DishOfDayFallback() {
  return (
    <section
      id="plat-du-jour"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-14 sm:px-8 lg:pb-20"
    >
      <div className="flex flex-col items-start justify-center lg:min-h-[calc(100svh-9rem)] lg:py-10">
        <span className="inline-flex items-center gap-2 rounded-chip bg-amber px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink">
          <span className="size-1.5 rounded-full bg-ink" aria-hidden="true" />
          Cuisine maison · {site.contact.city.split(",")[0]}
        </span>

        <h1 className="mt-5 max-w-2xl font-display text-[2.6rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-5xl lg:text-[3.5rem]">
          Le menu du jour, <span className="marker-highlight">réservé</span> à
          l&apos;avance.
        </h1>

        <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-ink-muted">
          {site.description}
        </p>

        <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <a
            href="#menu"
            className="inline-flex items-center justify-center rounded-btn bg-ink px-8 py-4 text-sm font-semibold text-cream shadow-[0_14px_30px_-16px_rgba(18,59,46,0.9)] transition-colors hover:bg-ink-soft"
          >
            Voir le menu de la semaine
          </a>
          <a
            href={`https://wa.me/${site.contact.whatsappDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-btn border border-ink/20 px-8 py-4 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-surface"
          >
            Écrire sur WhatsApp
          </a>
        </div>

        <Guarantees />

        <p
          className="mt-6 font-signature text-[1.4rem] text-ink/45"
          aria-hidden="true"
        >
          — {site.slogan} —
        </p>
      </div>
    </section>
  );
}
