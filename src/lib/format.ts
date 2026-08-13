/** Prix en centimes USD → "$12.00". */
export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/**
 * Séparateur de milliers en point, comme sur l'affiche officielle
 * (« 15.000 FC »). `de-DE` est la locale qui produit exactement ce
 * format ; `fr-FR` mettrait une espace insécable.
 */
const fcFormatter = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 0,
});

/** Devise affichée sur l'affiche et dans les commandes à Kinshasa. */
export const FC = "FC";

/**
 * Montant et devise séparés : l'étiquette de prix les compose elle-même,
 * le nombre en gros et la devise en petit à côté.
 */
export function formatFcParts(amount: number): {
  value: string;
  currency: string;
} {
  return { value: fcFormatter.format(amount), currency: FC };
}

/** Prix en francs congolais → "15.000 FC", sur une seule ligne. */
export function formatFc(amount: number): string {
  return `${fcFormatter.format(amount)} ${FC}`;
}
