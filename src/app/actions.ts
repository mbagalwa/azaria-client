"use server";

import { createOrder, type CreateOrderPayload } from "@/lib/orders";

/**
 * Commande passée depuis la vitrine, SANS COMPTE. Le formulaire du modal
 * envoie l'identité du client (nom + numéro WhatsApp) ; le serveur résout le
 * plat du jour, valide le cut-off, enregistre, puis envoie l'accusé de
 * réception WhatsApp et alerte l'équipe.
 */
export type CreateOrderState = {
  error?: string;
  /** Code de la commande créée : le modal bascule alors sur la confirmation. */
  code?: string;
};

export async function createOrderAction(
  _prev: CreateOrderState,
  formData: FormData,
): Promise<CreateOrderState> {
  const text = (k: string) => String(formData.get(k) ?? "").trim();

  const fullName = text("fullName");
  const mode = text("mode") === "pickup" ? "pickup" : "delivery";
  const address = text("address");

  // Le numéro arrive en deux parties : indicatif (+243…) + numéro national.
  // On retire le 0 de tête pour recomposer un E.164 propre (+243991234567).
  const countryCode = text("countryCode") || "+243";
  const national = text("phoneNumber")
    .replace(/\D/g, "")
    .replace(/^0+/, "");
  const phone = `${countryCode}${national}`;

  if (fullName.length < 2) {
    return { error: "Indiquez votre nom complet." };
  }
  if (national.length < 6) {
    return { error: "Indiquez un numéro WhatsApp valide (ex. 099 123 45 67)." };
  }
  if (mode === "delivery" && !address) {
    return { error: "Indiquez le lieu de livraison." };
  }

  const quantity = Number.parseInt(text("quantity"), 10);
  if (!Number.isFinite(quantity) || quantity < 1) {
    return { error: "La quantité est invalide." };
  }

  const payload: CreateOrderPayload = {
    fullName,
    phone,
    deliveryDate: text("deliveryDate"),
    deliveryTime: text("deliveryTime"),
    mode,
    address: mode === "delivery" ? address : null,
    landmark: text("landmark") || null,
    note: text("note") || null,
    quantity,
    accompanimentIds: formData
      .getAll("accompanimentIds")
      .map((v) => Number(v))
      .filter((n) => Number.isFinite(n) && n > 0),
  };

  const res = await createOrder(payload);
  if (!res.ok) return { error: res.message };

  return { code: res.data.code };
}
