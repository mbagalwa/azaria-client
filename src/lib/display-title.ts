/**
 * Mise en page des titres géants (nom du plat dans le hero).
 *
 * Le nom vient de l'API sous forme d'une seule chaîne, de longueur
 * imprévisible. Deux problèmes à régler sans JavaScript côté client :
 * le découpage en lignes, et une taille de police qui remplisse la
 * largeur sans jamais la dépasser.
 */

/** Nombre de lignes maximum : au-delà, le hero ne tient plus en un écran. */
const MAX_LINES = 2;

/**
 * Découpe un nom en deux lignes en minimisant la ligne la plus longue,
 * pour un bloc à peu près rectangulaire. Un mot seul reste sur une ligne.
 */
export function splitTitleLines(name: string): string[] {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return words;

  let bestAt = 1;
  let bestWidth = Infinity;

  for (let at = 1; at < words.length; at++) {
    const first = words.slice(0, at).join(" ");
    const second = words.slice(at).join(" ");
    // On compare en largeur typographique, pas en nombre de caractères :
    // « MW » est bien plus large que « il ».
    const width = Math.max(lineWidthEm(first), lineWidthEm(second));
    if (width < bestWidth) {
      bestWidth = width;
      bestAt = at;
    }
  }

  return [
    words.slice(0, bestAt).join(" "),
    words.slice(bestAt).join(" "),
  ].slice(0, MAX_LINES);
}

/**
 * Largeur approximative d'un glyphe capitale, en `em`, pour la police
 * d'affichage (Outfit Black). Les valeurs sont calées sur des mesures
 * faites dans le navigateur ; elles surestiment légèrement, ce qui est
 * le bon sens de l'erreur : on préfère un titre un peu petit à un titre
 * qui déborde.
 */
const GLYPH_EM: Record<string, number> = {
  M: 0.93,
  W: 0.93,
  A: 0.73,
  D: 0.73,
  G: 0.73,
  H: 0.73,
  N: 0.73,
  O: 0.73,
  Q: 0.73,
  U: 0.73,
  V: 0.73,
  I: 0.34,
  J: 0.34,
  " ": 0.28,
  "'": 0.24,
  "-": 0.4,
};

/** Toutes les autres capitales (B, C, E, L, P, R, S, T…) et les chiffres. */
const DEFAULT_GLYPH_EM = 0.66;

/** Interlettrage appliqué au titre — il faut le déduire de la largeur. */
const TRACKING_EM = 0.035;

/** Largeur d'une ligne, en `em`, une fois passée en capitales. */
export function lineWidthEm(line: string): number {
  const chars = [...line.toUpperCase()];
  const width = chars.reduce(
    (total, char) => total + (GLYPH_EM[char] ?? DEFAULT_GLYPH_EM),
    0,
  );
  return Math.max(width - chars.length * TRACKING_EM, 1);
}

/**
 * Taille de police qui fait tenir la ligne la plus longue dans la
 * largeur du conteneur, plafonnée par `maxRem`.
 *
 * S'exprime en `cqw`, donc en pourcentage de la largeur du conteneur de
 * requête : c'est le navigateur qui recalcule à chaque point de rupture,
 * sans mesure JavaScript ni cascade de classes par breakpoint.
 */
export function fitFontSize(lines: string[], maxRem: number): string {
  const widest = Math.max(...lines.map(lineWidthEm));
  return `min(${maxRem}rem, calc(100cqw / ${widest.toFixed(2)}))`;
}
