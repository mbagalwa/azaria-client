import { apiFetch } from "@/lib/api";

/**
 * Accès à l'API PUBLIQUE : le client commande sans compte, aucune de ces
 * requêtes ne porte de jeton.
 */

export type MenuAccompaniment = {
  id: number;
  name: string;
  description: string | null;
  /** Supplément par assiette. 0 = inclus dans le prix du plat. */
  priceCents: number;
  imageUrl: string | null;
};

/** LE plat du jour (un seul par date). */
export type MenuDish = {
  dishId: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  /** Prix figé du programme : celui qui sera facturé. */
  priceCents: number;
  /**
   * Prix de référence du catalogue. S'il dépasse le prix figé, la date est
   * programmée en promotion et la vitrine barre ce montant.
   */
  catalogPriceCents: number;
  /** Commandes non annulées ayant déjà contenu ce plat. */
  orderCount: number;
  accompaniments: MenuAccompaniment[];
};

export type MenuDay = { date: string; dish: MenuDish | null };

export type WeekMenu = {
  from: string;
  days: MenuDay[];
  deliveryFeeCents: number;
  orderCutoff: string;
};

/** Fenêtre de commande calculée par le serveur (fuseau métier, source de vérité). */
export type OrderingWindow = {
  today: string;
  earliest: string;
  cutoff: string;
  afterCutoff: boolean;
  deliveryFeeCents: number;
  tz: string;
};

export type OrderItemAccompaniment = {
  id: number;
  accompanimentId: number | null;
  name: string;
  priceCents: number;
};

export type OrderItemLite = {
  id: number;
  dishId: number | null;
  name: string;
  priceCents: number;
  quantity: number;
  accompaniments: OrderItemAccompaniment[];
};

export type OrderEventLite = { id: number; status: string; createdAt: string };

export type OrderCustomer = {
  fullName: string;
  phone: string | null;
  initials: string;
};

export type Order = {
  id: number;
  code: string;
  deliveryDate: string;
  deliveryTime: string;
  mode: "delivery" | "pickup";
  status: string;
  paymentMethod: "cash_on_delivery" | "mobile_money";
  paymentStatus: "unpaid" | "paid";
  totalCents: number;
  deliveryFeeCents: number;
  address: string | null;
  landmark: string | null;
  note: string | null;
  itemsCount: number;
  items: OrderItemLite[];
  events: OrderEventLite[];
  customer: OrderCustomer;
  createdAt: string;
};

/**
 * Payload de commande. Le plat n'y figure pas : il n'y en a qu'un par jour, le
 * serveur le résout depuis la date (et facture le prix affiché).
 */
export type CreateOrderPayload = {
  fullName: string;
  phone: string;
  deliveryDate: string;
  deliveryTime: string;
  mode: "delivery" | "pickup";
  address: string | null;
  landmark: string | null;
  note: string | null;
  quantity: number;
  accompanimentIds: number[];
};

/** Le plat du jour d'une date. */
export function getMenu(date: string) {
  return apiFetch<{
    date: string;
    dish: MenuDish | null;
    deliveryFeeCents: number;
    orderCutoff: string;
  }>(`/api/v1/public/menu?date=${date}`);
}

/** Les plats de la semaine (7 jours à partir de la 1re date commandable). */
export function getWeekMenu(from?: string) {
  const qs = from ? `?from=${from}` : "";
  return apiFetch<WeekMenu>(`/api/v1/public/menu/week${qs}`);
}

/** Fenêtre de commande (1re date commandable + cut-off), calculée côté serveur. */
export function getOrderingWindow() {
  return apiFetch<OrderingWindow>("/api/v1/public/ordering-window");
}

/** Suivi d'une commande par son code (le lien envoyé sur WhatsApp). */
export function getOrderByCode(code: string) {
  return apiFetch<Order>(`/api/v1/public/orders/${encodeURIComponent(code)}`);
}

export function createOrder(body: CreateOrderPayload) {
  return apiFetch<Order>("/api/v1/public/orders", { method: "POST", body });
}
