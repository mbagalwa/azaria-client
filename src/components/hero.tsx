"use client";

import Image from "next/image";

import {
  BagIcon,
  ClockIcon,
  DomeIcon,
  DrumstickIcon,
  LeafIcon,
  SparkIcon,
} from "@/components/icons";
import { useOrder } from "@/components/order-provider";
import { formatFcParts } from "@/lib/format";
import { dishOfDay } from "@/lib/menu-data";

const TAG_ICON = { leaf: LeafIcon, protein: DrumstickIcon } as const;

export function Hero() {
  const { openOrder } = useOrder();
  const { value, currency } = formatFcParts(dishOfDay.priceFc);

  return (
    <section
      id="plat-du-jour"
      className="relative overflow-hidden bg-ink text-cream"
    >
      <Foliage />

      {/* `z-10` : la photo est déclarée après ce bloc pour l'ordre de
          lecture mobile, il faut donc la repasser derrière en `lg`. */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6">
        <div className="flex flex-col items-center py-12 text-center lg:w-1/2 lg:items-start lg:py-24 lg:pr-10 lg:text-left">
          <p className="eyebrow flex flex-col items-center gap-2 text-gold lg:flex-row lg:gap-3">
            <DomeIcon className="size-7 lg:size-6" />
            Plat du jour
          </p>

          <h1 className="mt-4 text-balance font-display text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.1] text-cream">
            {dishOfDay.name}
          </h1>

          {/* Filet à losange de la maquette : deux traits or et une étoile
              au centre. Purement décoratif. */}
          <span
            aria-hidden
            className="mt-6 flex w-full max-w-80 items-center gap-3 text-gold"
          >
            <span className="h-px flex-1 bg-gold/45" />
            <SparkIcon className="size-2.5" />
            <span className="h-px flex-1 bg-gold/45" />
          </span>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-cream-muted sm:text-base">
            {dishOfDay.description}
          </p>

          <p className="mt-7 flex items-baseline gap-2">
            <span className="font-display text-[clamp(1.9rem,3.6vw,2.5rem)] font-semibold leading-none text-gold">
              {value}
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-gold/80">
              {currency}
            </span>
          </p>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-cream/85 lg:justify-start">
            {dishOfDay.tags.map((tag, i) => {
              const Icon = TAG_ICON[tag.icon];
              return (
                <li
                  key={tag.label}
                  className={`flex items-center gap-2.5 ${
                    i > 0 ? "border-l border-ink-line pl-5" : ""
                  }`}
                >
                  <span className="grid size-7 place-items-center rounded-full border border-ink-line text-cream/70">
                    <Icon className="size-4" />
                  </span>
                  {tag.label}
                </li>
              );
            })}
          </ul>

          {/* Bloc d'action : largeur du bouton sur grand écran, pleine
              largeur sur mobile comme sur la maquette. */}
          <div className="mt-8 flex w-full flex-col lg:w-auto lg:self-start">
            <button
              type="button"
              onClick={() => openOrder()}
              className="inline-flex items-center justify-center gap-2.5 rounded-btn bg-gold px-8 py-4 text-sm font-semibold text-ink transition-colors hover:bg-gold-deep"
            >
              <BagIcon className="size-5" />
              Commander
            </button>

            <p className="mt-4 flex items-start gap-3 rounded-btn border border-ink-line px-4 py-3 text-left text-xs leading-snug text-cream-muted">
              <ClockIcon className="mt-0.5 size-4 shrink-0" />
              <span>
                Commande avant {dishOfDay.orderBefore}
                <br />
                pour retrait aujourd&apos;hui à {dishOfDay.pickupAt}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ---- La photo : moitié droite à partir de `lg`, sous le texte en
             dessous. Aucun fondu ni voile — les visuels sont des PNG
             détourés, c'est leur transparence qui les pose sur le vert.
             `object-contain` pour la même raison : un détourage ne doit
             jamais être rogné. ---- */}
      <div className="relative h-64 w-full sm:h-80 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[54%]">
        <Image
          src={dishOfDay.image}
          alt={dishOfDay.alt}
          fill
          preload
          sizes="(max-width: 1024px) 100vw, 54vw"
          /* Marge basse généreuse en `lg` : la courbe de la section suivante
             est posée par-dessus, sans elle l'assiette se ferait couper. */
          className="object-contain object-center p-4 lg:px-10 lg:pb-28 lg:pt-10"
        />
      </div>

      <CurvedEdge />
    </section>
  );
}

/**
 * Bord bas incurvé : la section claire remonte à droite. Un SVG plutôt
 * qu'un `border-radius`, seul moyen d'obtenir la courbe asymétrique de
 * la maquette. Il est posé au-dessus de la photo, qu'il recoupe — c'est
 * exactement ce que fait le modèle.
 */
function CurvedEdge() {
  return (
    <svg
      viewBox="0 0 1440 110"
      preserveAspectRatio="none"
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-12 w-full fill-cream sm:h-16 lg:h-24"
    >
      <path d="M0 62C300 108 780 96 1440 4V110H0Z" />
    </svg>
  );
}

/** Feuillages au trait, très discrets, repris du fond de la maquette. */
function Foliage() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 120 160"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        className="absolute -left-6 top-16 h-44 text-gold/10 lg:h-64"
      >
        <path d="M60 158C60 80 30 30 4 4c40 6 66 44 66 96" />
        <path d="M60 120c14-16 34-24 56-26-14 22-34 34-56 34" />
      </svg>
      <svg
        viewBox="0 0 120 160"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        className="absolute right-1/3 top-6 hidden h-52 rotate-12 text-gold/10 lg:block"
      >
        <path d="M60 158C60 80 90 30 116 4c-40 6-66 44-66 96" />
        <path d="M60 110C46 94 26 86 4 84c14 22 34 34 56 34" />
      </svg>
    </div>
  );
}
