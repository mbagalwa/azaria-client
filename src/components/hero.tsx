import Image, { type StaticImageData } from "next/image";

import platLegumes from "../../public/plats/plat-legumes.jpg";
import platPoulet from "../../public/plats/menu/lundi.jpg";
import platRiz from "../../public/plats/plat-riz.jpg";
import { PriceNote } from "@/components/price-tag";
import { WhatsappIcon } from "@/components/whatsapp-button";
import { fitFontSize, splitTitleLines } from "@/lib/display-title";
import { site } from "@/lib/site";

type DishPart = {
  image: StaticImageData;
  /** Nom du composant, comme sur l'affiche : « BANANES FRITS ». */
  label: string;
  /** Précision facultative sous le nom : « Sauce tartare ». */
  detail?: string;
  alt: string;
};

/**
 * ⚠️ Plat en dur, le temps de valider le style du hero. Le jour où on
 * branche l'API, seul cet objet disparaît : le reste du composant lit
 * déjà les mêmes champs que la ressource « plat du jour ».
 *
 * `parts` reprend la composition de l'affiche officielle : 2 ou 3
 * éléments, chacun avec sa photo et son libellé. La grille s'adapte au
 * nombre d'éléments, il n'y a rien d'autre à toucher.
 */
const dish = {
  /** Une seule chaîne, comme la renverra l'API : la mise en lignes et
      la taille du titre s'en déduisent. */
  name: "Poulet moambé",
  day: "Aujourd'hui",
  /** Montants en francs congolais, comme sur l'affiche officielle. */
  priceFc: 15000,
  deliveryFc: 8000,
  parts: [
    {
      image: platPoulet,
      label: "Poulet braisé",
      detail: "Sauce moambé",
      alt: "Poulet braisé doré dans sa poêle en fonte",
    },
    {
      image: platRiz,
      label: "Riz parfumé",
      alt: "Riz parfumé aux crevettes et petits légumes",
    },
    {
      image: platLegumes,
      label: "Légumes de saison",
      alt: "Bol de légumes frais de saison",
    },
  ] satisfies DishPart[],
} as const;

/** Réseaux affichés en colonne sur le bord droit, comme sur le modèle. */
const socials = [
  { label: "Facebook", href: "#", path: "M13.5 9H16V6h-2.5C11.57 6 10 7.57 10 9.5V11H8v3h2v7h3v-7h2.5l.5-3H13v-1.5c0-.28.22-.5.5-.5Z" },
  { label: "Instagram", href: "#", path: "M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Zm0 5.94a2.34 2.34 0 1 1 0-4.68 2.34 2.34 0 0 1 0 4.68ZM17.1 8.26a.84.84 0 1 1-1.68 0 .84.84 0 0 1 1.68 0ZM16.5 3h-9A4.5 4.5 0 0 0 3 7.5v9A4.5 4.5 0 0 0 7.5 21h9a4.5 4.5 0 0 0 4.5-4.5v-9A4.5 4.5 0 0 0 16.5 3Zm3.24 13.5a3.24 3.24 0 0 1-3.24 3.24h-9a3.24 3.24 0 0 1-3.24-3.24v-9A3.24 3.24 0 0 1 7.5 4.26h9a3.24 3.24 0 0 1 3.24 3.24v9Z" },
] as const;

/** Petite légende latérale : uniquement sur grand écran, jamais sous le titre. */
const sideCaption =
  "text-[0.68rem] font-semibold uppercase leading-relaxed tracking-[0.14em] text-ink-muted";

/** Plafond de taille du titre : au-delà, il écraserait les vignettes. */
const TITLE_MAX_REM = 12.5;

/** Ratio des photos : hauteur = largeur × 4/3. */
const PHOTO_W_PER_H = 3 / 4;
/** Hauteur d'une garniture, en fraction de celle du plat principal. */
const SIDE_SCALE = 0.88;

export function Hero() {
  const parts = dish.parts;
  const titleLines = splitTitleLines(dish.name);
  const titleSize = fitFontSize(titleLines, TITLE_MAX_REM);
  /** Le premier élément est le plat principal — comme sur l'affiche, il
      ouvre la composition et se voit attribuer la plus grande vignette. */
  const heroPart = 0;

  /**
   * Hauteur maximale d'une photo pour que la rangée entière tienne dans
   * la largeur disponible. Les photos tirent leur largeur de leur
   * hauteur (ratio constant) : sans ce plafond, une fenêtre haute et
   * étroite les faisait déborder et se chevaucher.
   *
   * largeur totale = hauteur × Σ(échelles) × 3/4 + gouttières
   */
  const widthPerHeight =
    parts.reduce((sum, _, i) => sum + (i === heroPart ? 1 : SIDE_SCALE), 0) *
    PHOTO_W_PER_H;
  // Le `0.5rem` est une marge de sécurité : sans elle la rangée tombe au
  // pixel près sur la largeur disponible, et le moindre arrondi la fait
  // déborder — donc rogner, puisqu'elle est centrée.
  const photoCap = `calc((100cqw - ${parts.length - 1} * var(--tile-gap) - 0.5rem) / ${widthPerHeight.toFixed(3)})`;

  return (
    <section className="relative flex flex-col overflow-hidden bg-white/90 lg:h-svh">
      {/* ---- Titre + annotations : trois colonnes, aucun chevauchement ---- */}
      <div className="mx-auto grid w-full max-w-7xl shrink-0 grid-cols-1 gap-x-8 px-6 pt-24 lg:grid-cols-[10rem_minmax(0,1fr)_10rem] lg:pt-28">
        <div className="hidden pt-6 lg:block">
          <span className="mb-3 flex size-9 items-center justify-center rounded-chip bg-brand-tint text-brand">
            <WhatsappIcon className="size-4" />
          </span>
          <p className={sideCaption}>Commande par WhatsApp, livrée chaude dans Kinshasa.</p>
          <span className="mt-5 block h-24 w-px bg-cream-deep" aria-hidden />
        </div>

        {/* Le nom du plat, plein cadre — c'est tout le message du hero.
            `@container` fait de cette colonne la référence des `cqw` :
            le titre se dimensionne sur elle, pas sur la fenêtre. */}
        <div className="@container relative text-center">
          {/* Indexée sur la taille du titre : sur un nom long, donc écrit
              plus petit, la signature rétrécit avec lui au lieu de venir
              barrer le mot. */}
          <span
            className="pointer-events-none absolute inset-x-0 top-0 z-20 -translate-y-[72%] font-signature leading-none text-brand"
            style={{ fontSize: `max(2rem, calc(${titleSize} * 0.42))` }}
            aria-hidden
          >
            {dish.day}
          </span>
          {/* La taille est calculée d'après la ligne la plus longue : le
              nom touche les bords quelle que soit sa longueur, et ne
              déborde jamais sur les légendes latérales. `nowrap` interdit
              tout retour à la ligne qui ferait une 3ᵉ ligne. */}
          <h1
            className="font-display font-black uppercase leading-[0.84] tracking-[-0.035em] text-ink"
            style={{ fontSize: titleSize }}
          >
            {titleLines.map((line, i) => (
              <span
                key={line}
                className={`block whitespace-nowrap ${
                  i === titleLines.length - 1 ? "text-brand" : ""
                }`}
              >
                {line}
              </span>
            ))}
          </h1>
        </div>

        <div className="hidden pt-6 text-right lg:block">
          <p className={sideCaption}>Un seul plat par jour, cuisiné le matin même.</p>
          <a
            href="#menu"
            className="mt-3 inline-block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-brand underline underline-offset-4 hover:text-brand-dark"
          >
            Voir la semaine
          </a>
          {/* Le prix flotte dans la marge droite : lisible d'un coup
              d'œil, et il ne prend ni place sur les photos ni une
              rangée sous la composition. */}
          <div className="mt-8 border-t border-cream-deep pt-5">
            <PriceNote amount={dish.priceFc} deliveryAmount={dish.deliveryFc} />
          </div>
        </div>
      </div>

      {/* ---- La composition du plat : les photos remontent sur le bas du
             titre, les libellés restent alignés sur une même ligne. ---- */}
      <div className="relative z-10 -mt-[2vw] min-h-0 px-4 pb-8 sm:px-6 lg:-mt-[clamp(1rem,4vw,3.5rem)] lg:flex-1 lg:pb-6">
        {/* `@container` : `100cqw` dans `--photo-cap` désigne la largeur
            de cette grille, donc le plafond suit la place réellement
            disponible, pas celle de la fenêtre. */}
        <div
          className="@container relative mx-auto grid max-w-5xl grid-rows-[var(--photo-cap)_auto] justify-center gap-x-(--tile-gap) [--tile-gap:0.75rem] sm:[--tile-gap:1.25rem] lg:h-full lg:grid-rows-[min(100%_-_4rem,var(--photo-cap))_auto] lg:content-start lg:[--tile-gap:1.5rem] xl:max-w-6xl 2xl:max-w-7xl"
          style={
            {
              // Colonnes dimensionnées par leur contenu : la largeur d'une
              // vignette se déduit de sa hauteur via le ratio, donc les
              // colonnes collent aux photos et les gouttières valent
              // exactement le `gap`. Avec des colonnes en `fr`, une photo
              // rognée en hauteur laissait un trou dans sa colonne.
              gridTemplateColumns: parts.map(() => "auto").join(" "),
              "--photo-cap": photoCap,
            } as React.CSSProperties
          }
        >
          {parts.map((part, i) => (
            <div
              key={`${part.label}-photo`}
              className="relative row-start-1 aspect-3/4 self-end overflow-hidden rounded-panel"
              // Le plat principal est plus haut — donc, à ratio constant,
              // plus large aussi. Le `min()` est le garde-fou de largeur :
              // la rangée ne peut pas déborder, même sur un écran très haut.
              style={{
                height:
                  i === heroPart
                    ? "min(100%, var(--photo-cap))"
                    : `min(${SIDE_SCALE * 100}%, calc(var(--photo-cap) * ${SIDE_SCALE}))`,
              }}
            >
              <Image
                src={part.image}
                alt={part.alt}
                preload={i === heroPart}
                placeholder="blur"
                fill
                sizes="(max-width: 640px) 33vw, 20rem"
                className="object-cover object-center"
              />
            </div>
          ))}

          {parts.map((part) => (
            /* Calé sur le bord gauche de la vignette : la cellule occupe
               toute la colonne, et la photo démarre au même point. Les
               filets verticaux de l'affiche disparaissent — ils n'avaient
               de sens qu'avec des libellés centrés. */
            <div key={`${part.label}-label`} 
              className="row-start-2 pt-4 text-left border-l border-cream-deep pl-2" 
              >
              <p className="w-0 min-w-full text-[0.7rem] font-bold uppercase leading-tight tracking-[0.1em] text-ink sm:text-sm">
                {part.label}
              </p>
              {part.detail && (
                <p className="mt-1 w-0 min-w-full text-[0.65rem] uppercase leading-tight tracking-[0.1em] text-ink-muted sm:text-xs">
                  {part.detail}
                </p>
              )}
            </div>
          ))}

          {/* Sous `lg`, les colonnes latérales n'existent pas : le lien du
              menu et le prix se replient sur une ligne en fin de
              composition, chacun sur son bord. */}
          <div className="col-span-full flex items-end justify-between gap-4 pt-5 lg:hidden">
            <a
              href="#menu"
              className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-brand underline underline-offset-4 hover:text-brand-dark"
            >
              Voir la semaine
            </a>
            <PriceNote amount={dish.priceFc} deliveryAmount={dish.deliveryFc} />
          </div>
        </div>
      </div>

      {/* ---- Réseaux, bord droit ---- */}
      <ul className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 xl:flex">
        {socials.map((social) => (
          <li key={social.label}>
            <a
              href={social.href}
              aria-label={social.label}
              className="flex size-9 items-center justify-center rounded-chip bg-ink text-cream transition-colors hover:bg-brand"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
                <path d={social.path} />
              </svg>
            </a>
          </li>
        ))}
        <li>
          <a
            href={`https://wa.me/${site.contact.whatsappDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex size-9 items-center justify-center rounded-chip bg-ink text-cream transition-colors hover:bg-brand"
          >
            <WhatsappIcon className="size-4" />
          </a>
        </li>
      </ul>
    </section>
  );
}
