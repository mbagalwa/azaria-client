import { apiFetch } from "@/lib/api";

export type MenuDish = {
  dishId: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  priceCents: number;
};

export type Menu = {
  date: string;
  dishes: MenuDish[];
  deliveryFeeCents: number;
  orderCutoff: string;
};

/** Fenêtre de commande calculée par le serveur (fuseau métier, source de vérité). */
export type OrderingWindow = {
  today: string;
  earliest: string;
  cutoff: string;
  afterCutoff: boolean;
  tz: string;
};

export type OrderItemLite = {
  id: number;
  dishId: number | null;
  name: string;
  priceCents: number;
  quantity: number;
};

export type OrderEventLite = { id: number; status: string; createdAt: string };

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
  createdAt: string;
};

export type CreateOrderPayload = {
  deliveryDate: string;
  deliveryTime: string;
  mode: "delivery" | "pickup";
  address: string | null;
  landmark: string | null;
  paymentMethod: "cash_on_delivery" | "mobile_money";
  note: string | null;
  items: { dishId: number; quantity: number }[];
};

export function getMenu(date: string, token: string) {
  return apiFetch<Menu>(`/api/v1/account/menu?date=${date}`, { token });
}

/** Fenêtre de commande (1re date commandable + cut-off), calculée côté serveur. */
export function getOrderingWindow(token: string) {
  return apiFetch<OrderingWindow>("/api/v1/account/ordering-window", { token });
}

export function listMyOrders(token: string, opts: { page?: number; limit?: number } = {}) {
  const params = new URLSearchParams();
  if (opts.page) params.set("page", String(opts.page));
  if (opts.limit) params.set("limit", String(opts.limit));
  const qs = params.toString();
  return apiFetch<Order[]>(`/api/v1/account/orders${qs ? `?${qs}` : ""}`, {
    token,
  });
}

export function getMyOrder(id: string | number, token: string) {
  return apiFetch<Order>(`/api/v1/account/orders/${id}`, { token });
}

export function createOrder(body: CreateOrderPayload, token: string) {
  return apiFetch<Order>("/api/v1/account/orders", {
    method: "POST",
    body,
    token,
  });
}
