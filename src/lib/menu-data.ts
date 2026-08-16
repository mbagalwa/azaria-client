import type { StaticImageData } from "next/image";

import braisedImg from "../../public/plats/menu/lundi.jpg";
import curryImg from "../../public/plats/menu/mardi.jpg";
import bowlImg from "../../public/plats/menu/mercredi.jpg";
import chickenHerbsImg from "../../public/plats/plat.png";
import fishImg from "../../public/plats/menu/vendredi.jpg";

/**
 * ⚠️ Menu en dur, le temps de valider la maquette. La forme correspond à
 * ce que renvoie l'API publique (`lib/orders.ts`) : un plat par jour de
 * service, prix figé au programme.
 */

export type DayDish = {
  /** Jour de service. */
  day: string;
  /** Date lisible, sous le jour. */
  date: string;
  /** Date ISO envoyée à l'API à la commande. */
  isoDate: string;
  name: string;
  priceFc: number;
  image: StaticImageData;
  alt: string;
};

/** Étiquettes nutritionnelles du plat du jour. */
export type DishTag = { label: string; icon: "leaf" | "protein" };

export const week: DayDish[] = [
  {
    day: "Lundi",
    date: "17 août",
    isoDate: "2026-08-17",
    name: "Poulet grillé aux herbes",
    priceFc: 15000,
    image: chickenHerbsImg,
    alt: "Assiette de poulet grillé aux herbes, œufs, épinards, tomates rôties et avocat",
  },
  {
    day: "Mardi",
    date: "18 août",
    isoDate: "2026-08-18",
    name: "Poisson sauce citron",
    priceFc: 17000,
    image: fishImg,
    alt: "Pavé de poisson grillé, peau croustillante",
  },
  {
    day: "Mercredi",
    date: "19 août",
    isoDate: "2026-08-19",
    name: "Bowl du marché",
    priceFc: 11000,
    image: bowlImg,
    alt: "Bol de légumes frais, avocat et patate douce",
  },
  {
    day: "Jeudi",
    date: "20 août",
    isoDate: "2026-08-20",
    name: "Curry de légumes",
    priceFc: 12000,
    image: curryImg,
    alt: "Curry de légumes servi avec du riz blanc",
  },
  {
    day: "Vendredi",
    date: "21 août",
    isoDate: "2026-08-21",
    name: "Poulet braisé",
    priceFc: 15000,
    image: braisedImg,
    alt: "Poulet braisé doré dans sa poêle en fonte",
  },
];

/** Le plat mis en avant dans le hero : le premier jour de la semaine. */
export const dishOfDay = {
  ...week[0],
  tags: [
    { label: "Équilibré", icon: "leaf" },
    { label: "Riche en protéines", icon: "protein" },
  ] satisfies DishTag[],
  description:
    "Des morceaux de poulet grillés à la perfection, relevés d'herbes fraîches et accompagnés de légumes savoureux.",
  /** Fenêtre de commande, telle qu'affichée sous les boutons du hero. */
  orderBefore: "10h00",
  pickupAt: "12h30",
};

/** Frais de livraison, ajoutés au récapitulatif du modal. */
export const DELIVERY_FEE_FC = 8000;

/** Créneaux de retrait / livraison proposés dans le modal. */
export const TIME_SLOTS = [
  "12h00",
  "12h30",
  "13h00",
  "13h30",
  "14h00",
  "14h30",
];

/** Plage de retrait affichée en pied de page — dérivée des créneaux. */
export const PICKUP_WINDOW = `${TIME_SLOTS[0]} – ${TIME_SLOTS[TIME_SLOTS.length - 1]}`;
