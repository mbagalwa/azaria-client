"use server";

import { createOrder } from "@/lib/orders";

export type OrderFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "done"; code: string };

/** Champs obligatoires du formulaire, avec le message affiché sous le champ. */
const REQUIRED: Array<[string, string]> = [
  ["fullName", "Votre nom est nécessaire pour préparer la commande."],
  ["phoneNumber", "Un numéro WhatsApp est nécessaire pour vous joindre."],
  ["deliveryTime", "Choisissez une heure."],
];

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/**
 * Commande publique : aucun compte, aucun jeton. Le plat n'est pas
 * transmis — il n'y en a qu'un par jour, le serveur le résout depuis la
 * date et facture le prix affiché.
 */
export async function createOrderAction(
  _prev: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  for (const [field, message] of REQUIRED) {
    if (!text(formData, field)) return { status: "error", message };
  }

  const mode = text(formData, "mode") === "delivery" ? "delivery" : "pickup";
  const address = text(formData, "address");

  if (mode === "delivery" && !address) {
    return {
      status: "error",
      message: "Indiquez l'adresse de livraison.",
    };
  }

  // Numéro scindé à la saisie : indicatif au select, national à l'input.
  // On retire le zéro de tête avant de recomposer — l'API ramène ensuite
  // le tout en E.164.
  const national = text(formData, "phoneNumber").replace(/\D/g, "").replace(/^0+/, "");
  const phone = `${text(formData, "countryCode")}${national}`;

  const quantity = Math.max(1, Number(text(formData, "quantity")) || 1);

  const result = await createOrder({
    fullName: text(formData, "fullName"),
    phone,
    deliveryDate: text(formData, "deliveryDate"),
    deliveryTime: text(formData, "deliveryTime"),
    mode,
    address: mode === "delivery" ? address : null,
    landmark: mode === "delivery" ? text(formData, "landmark") || null : null,
    note: text(formData, "note") || null,
    quantity,
    accompanimentIds: [],
  });

  if (!result.ok) {
    return {
      status: "error",
      message:
        result.message ||
        "La commande n'a pas pu être enregistrée. Réessayez dans un instant.",
    };
  }

  return { status: "done", code: result.data.code };
}
