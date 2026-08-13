"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

import jeudiImg from "../../public/plats/menu/jeudi.jpg";
import lundiImg from "../../public/plats/menu/lundi.jpg";
import mardiImg from "../../public/plats/menu/mardi.jpg";
import mercrediImg from "../../public/plats/menu/mercredi.jpg";
import vendrediImg from "../../public/plats/menu/vendredi.jpg";
import { WhatsappIcon, whatsappHref } from "@/components/whatsapp-button";
import { PriceChip } from "@/components/price-tag";
import { site } from "@/lib/site";

type WeekDish = {
  /** Jour de service, tel qu'affiché sur le volet. */
  day: string;
  /** Abrégé du jour, seule chose lisible sur un volet replié. */
  short: string;
  /** Date lisible du jour de service. */
  date: string;
  name: string;
  sides: string;
  /** Montant en francs congolais. */
  priceFc: number;
  image: StaticImageData;
  alt: string;
};

/**
 * ⚠️ Semaine en dur, le temps de valider le style. La forme correspond à
 * ce que renverra l'API : un plat par jour de service.
 */
const week: WeekDish[] = [
  {
    day: "Lundi",
    short: "Lun",
    date: "18 août",
    name: "Poulet moambé",
    sides: "Riz parfumé · Légumes de saison",
    priceFc: 15000,
    image: lundiImg,
    alt: "Poulet braisé doré dans sa poêle en fonte",
  },
  {
    day: "Mardi",
    short: "Mar",
    date: "19 août",
    name: "Poulet sauce tomate",
    sides: "Riz blanc · Bananes frites",
    priceFc: 12000,
    image: mardiImg,
    alt: "Poulet mijoté à la sauce tomate, servi avec du riz",
  },
  {
    day: "Mercredi",
    short: "Mer",
    date: "20 août",
    name: "Bowl du marché",
    sides: "Avocat · Patate douce · Pois chiches",
    priceFc: 11000,
    image: mercrediImg,
    alt: "Bol de légumes frais, avocat et patate douce",
  },
  {
    day: "Jeudi",
    short: "Jeu",
    date: "21 août",
    name: "Poulet aux poivrons",
    sides: "Chikwangue · Sauce tartare",
    priceFc: 13500,
    image: jeudiImg,
    alt: "Sauté de poulet aux poivrons et basilic",
  },
  {
    day: "Vendredi",
    short: "Ven",
    date: "22 août",
    name: "Poisson grillé",
    sides: "Semoule aux herbes · Crème d'avocat",
    priceFc: 17000,
    image: vendrediImg,
    alt: "Pavé de poisson grillé, peau croustillante",
  },
];

/** Durée d'affichage d'un volet avant de passer au suivant. */
const ROTATE_MS = 5000;
/** Rapport de largeur entre le volet ouvert et un volet replié. */
const OPEN_GROW = 8;

/** Même courbe partout : l'accordéon doit bouger d'un seul tenant. */
const EASE = "duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";

export function WeekMenu() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    // Pas de rotation automatique si l'utilisateur a demandé moins
    // d'animations : il pilote alors l'accordéon aux volets.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(
      () => setActive((i) => (i + 1) % week.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, [paused]);

  function onKeyDown(event: React.KeyboardEvent) {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (step === 0) return;

    event.preventDefault();
    setActive((i) => (i + step + week.length) % week.length);
  }

  return (
    <section
      id="menu"
      aria-labelledby="menu-titre"
      className="border-t border-cream-deep py-20 lg:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-6">
        <header className="text-center">
          <p className="font-signature text-3xl text-brand">La semaine</p>
          <h2
            id="menu-titre"
            className="mt-1 font-display text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-[0.9] tracking-tight text-ink"
          >
            Les plats de la semaine
          </h2>
        </header>

        {/* ---- Accordéon : le volet du jour s'ouvre, les autres se
               replient en bandes. L'animation porte sur `flex-grow`,
               ce qui garde la rangée pleine largeur en permanence. ---- */}
        <ul
          role="group"
          aria-roledescription="carrousel"
          aria-label="Plats de la semaine"
          onKeyDown={onKeyDown}
          className="mt-12 flex h-[22rem] gap-2 sm:h-[26rem] sm:gap-3 lg:h-[30rem]"
        >
          {week.map((dish, i) => {
            const isOpen = i === active;

            return (
              <li
                key={dish.day}
                aria-roledescription="diapositive"
                aria-label={`${i + 1} sur ${week.length} — ${dish.day}`}
                onMouseEnter={() => setActive(i)}
                style={{ flexGrow: isOpen ? OPEN_GROW : 1 }}
                className={`group relative basis-0 overflow-hidden rounded-panel bg-ink transition-[flex-grow] ${EASE}`}
              >
                <Image
                  src={dish.image}
                  alt={dish.alt}
                  placeholder="blur"
                  fill
                  sizes="(max-width: 640px) 70vw, 55rem"
                  className={`object-cover object-center transition-all ${EASE} ${
                    isOpen ? "scale-100" : "scale-110 saturate-[0.6]"
                  }`}
                />

                {/* Voile de lecture : dégradé sous le texte quand le volet
                    est ouvert, aplat plus sombre quand il est replié. */}
                <div
                  className={`absolute inset-0 transition-opacity ${EASE} ${
                    isOpen
                      ? "bg-gradient-to-t from-ink/85 via-ink/25 to-transparent"
                      : "bg-ink/45"
                  }`}
                />

                {/* --- Volet replié : le jour à la verticale --- */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-end gap-3 pb-5 transition-opacity ${EASE} ${
                    isOpen ? "pointer-events-none opacity-0" : "opacity-100"
                  }`}
                >
                  <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-cream [writing-mode:vertical-rl] rotate-180">
                    {dish.day}
                  </span>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-chip bg-cream/15 text-xs font-bold text-cream backdrop-blur-sm">
                    {i + 1}
                  </span>
                </div>

                {/* --- Volet ouvert : la fiche du plat --- */}
                <div
                  className={`absolute inset-x-0 bottom-0 p-5 transition-opacity ${EASE} sm:p-6 ${
                    isOpen ? "opacity-100 delay-150" : "pointer-events-none opacity-0"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-chip bg-brand px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-cream">
                      {dish.short}
                    </span>
                    <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] text-cream/70">
                      {dish.date}
                    </span>
                  </div>

                  {/* Le titre se replie plutôt que d'être rogné : un nom
                      long dépasserait la largeur du volet, et le
                      `overflow-hidden` le couperait sans prévenir. */}
                  <h3 className="mt-3 text-balance font-display text-2xl font-black uppercase leading-[0.9] tracking-[-0.02em] text-cream sm:text-4xl">
                    {dish.name}
                  </h3>
                  <p className="mt-2 truncate text-sm text-cream/75">
                    {dish.sides}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <PriceChip amount={dish.priceFc} />
                    <a
                      href={whatsappHref(
                        `Bonjour ${site.name}, je voudrais commander le plat de ${dish.day.toLowerCase()} ${dish.date} : ${dish.name}.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 whitespace-nowrap rounded-btn bg-brand px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-brand-dark"
                    >
                      <WhatsappIcon className="size-4" />
                      Commander
                    </a>
                  </div>
                </div>

                {/* Le volet replié est cliquable en entier, sans imbriquer
                    de lien dans un bouton. */}
                {!isOpen && (
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className="absolute inset-0 z-10 cursor-pointer"
                  >
                    <span className="sr-only">
                      Voir le plat de {dish.day.toLowerCase()}
                    </span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {/* ---- Pastilles de progression ---- */}
        <div className="mt-8 flex justify-center gap-2">
          {week.map((dish, i) => (
            <button
              key={dish.day}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Voir le plat de ${dish.day.toLowerCase()}`}
              aria-current={i === active}
              className={`h-1.5 rounded-chip transition-all duration-500 ${
                i === active ? "w-8 bg-brand" : "w-4 bg-cream-deep hover:bg-ink-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
