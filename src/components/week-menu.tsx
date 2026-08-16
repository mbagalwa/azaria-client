"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/icons";
import { useOrder } from "@/components/order-provider";
import { formatFc } from "@/lib/format";
import { week } from "@/lib/menu-data";

export function WeekMenu() {
  const { openOrder } = useOrder();
  const [active, setActive] = useState(0);
  const railRef = useRef<HTMLUListElement>(null);
  /** Évite de faire défiler la page au premier rendu. */
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    railRef.current?.children[active]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [active]);

  const move = (step: number) =>
    setActive((i) => (i + step + week.length) % week.length);

  return (
    <section id="menu" aria-labelledby="menu-titre" className="bg-cream py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow flex items-center gap-2.5 text-gold-deep">
              <CalendarIcon className="size-5" />
              Menu de la semaine
            </p>
            <h2
              id="menu-titre"
              className="mt-3 font-display text-[clamp(1.6rem,3.2vw,2.25rem)] font-semibold leading-tight text-ink"
            >
              Notre menu de la semaine
            </h2>
          </div>

          <a
            href="#menu"
            className="inline-flex items-center gap-2.5 rounded-btn border border-line bg-surface px-4 py-2.5 text-sm text-ink shadow-sm transition-colors hover:border-gold hover:text-gold-deep"
          >
            Voir le calendrier
            <CalendarIcon className="size-4" />
          </a>
        </div>

        {/* ---- Les cinq jours ---- */}
        <div className="relative mt-8">
          <Arrow side="left" onClick={() => move(-1)} />
          <Arrow side="right" onClick={() => move(1)} />

          <ul
            ref={railRef}
            className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 py-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0"
          >
            {week.map((dish, i) => (
              <li key={dish.isoDate} className="w-44 shrink-0 snap-center lg:w-auto">
                <DayCard
                  dish={dish}
                  active={i === active}
                  onClick={() => {
                    setActive(i);
                    openOrder(dish);
                  }}
                />
              </li>
            ))}
          </ul>
        </div>

        <ul className="mt-7 flex items-center justify-center gap-2">
          {week.map((dish, i) => (
            <li key={dish.isoDate}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Voir ${dish.day}`}
                aria-current={i === active ? "true" : undefined}
                className={`block h-1.5 rounded-full transition-all ${
                  i === active ? "w-6 bg-ink" : "w-3 bg-line hover:bg-gold"
                }`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Carte d'un jour. Le jour actif reçoit un bandeau vert en haut, et la
 * photo ronde est posée à cheval sur le bas de ce bandeau — c'est ce
 * chevauchement qui donne son relief à la carte dans la maquette.
 */
function DayCard({
  dish,
  active,
  onClick,
}: {
  dish: (typeof week)[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className="flex h-full w-full flex-col items-center overflow-hidden rounded-card bg-surface pb-6 text-center shadow-[0_2px_12px_rgba(10,30,21,0.07)] transition-shadow hover:shadow-[0_6px_20px_rgba(10,30,21,0.12)]"
    >
      <div
        /* `pb-18` réserve la place du demi-cercle qui va remonter dessus :
           sans elle, la photo recouvrait la date. */
        className={`w-full px-3 pb-18 pt-5 transition-colors ${
          active ? "bg-ink" : "bg-transparent"
        }`}
      >
        <span
          className={`block text-sm font-semibold ${active ? "text-cream" : "text-ink"}`}
        >
          {dish.day}
        </span>
        <span
          className={`mt-1 block text-xs ${active ? "text-cream/60" : "text-ink/50"}`}
        >
          {dish.date}
        </span>
      </div>

      {/* Remontée de la moitié de son diamètre : le centre du cercle tombe
          exactement sur le bord bas du bandeau. */}
      <Image
        src={dish.image}
        alt={dish.alt}
        placeholder="blur"
        width={160}
        height={160}
        sizes="160px"
        className="-mt-16 size-32 rounded-full object-cover"
      />

      <span className="mt-4 min-h-10 text-balance px-3 text-sm font-medium leading-snug text-ink">
        {dish.name}
      </span>
      <span className="mt-2.5 block h-px w-4 bg-gold" aria-hidden />
      <span className="mt-2.5 text-sm font-semibold text-gold-deep">
        {formatFc(dish.priceFc)}
      </span>
    </button>
  );
}

function Arrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Jour précédent" : "Jour suivant"}
      className={`absolute top-1/2 z-10 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-surface text-ink shadow-[0_2px_10px_rgba(10,30,21,0.14)] transition-colors hover:text-gold-deep sm:grid ${
        side === "left" ? "-left-4 xl:-left-6" : "-right-4 xl:-right-6"
      }`}
    >
      <Icon className="size-4" />
    </button>
  );
}
