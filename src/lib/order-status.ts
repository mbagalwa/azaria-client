/** Libellés/couleurs des statuts, modes et paiement côté client. */

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  preparing: "En préparation",
  ready: "Prête",
  delivering: "En livraison",
  delivered: "Livrée",
  picked_up: "Récupérée",
  cancelled: "Annulée",
};

/** Classe de badge (chaude, cohérente avec le thème du landing). */
export function orderStatusClass(status: string): string {
  switch (status) {
    case "delivered":
    case "picked_up":
    case "ready":
      return "bg-[#e6f4ec] text-ink";
    case "cancelled":
      // État négatif : rouge atténué, jamais la teinte de marque (positive).
      return "bg-red-100 text-red-700";
    case "preparing":
    case "confirmed":
    case "delivering":
      return "bg-amber-tint text-ink";
    default:
      return "bg-cream-deep text-ink-soft";
  }
}

export const ORDER_MODE_LABEL: Record<string, string> = {
  delivery: "Livraison",
  pickup: "Retrait sur place",
};

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cash_on_delivery: "À la livraison",
  mobile_money: "Mobile Money",
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  unpaid: "À payer",
  paid: "Payé",
};
