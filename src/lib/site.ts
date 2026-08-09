/**
 * Configuration de la vitrine.
 *
 * ⚠️ Les coordonnées ci-dessous sont FICTIVES, en attendant les vraies
 * informations d'Azaria. Tout est centralisé ici : un seul fichier à
 * corriger le jour où les données réelles arrivent.
 */
export const site = {
  name: "Azaria",
  tagline: "Le menu du jour, réservé à l'avance.",
  /** Slogan de la marque, repris de l'affiche (design/affiche_model.png). */
  slogan: "Cuisiné avec passion, servi avec fierté",
  description:
    "Azaria programme chaque semaine un menu différent. Choisissez votre plat, votre date et votre heure de livraison - on s'occupe du reste.",

  contact: {
    /** ⚠️ Adresse fictive - la commune (Gombe) vient de l'affiche. */
    address: "Commune de la Gombe",
    city: "Kinshasa, RD Congo",
    /** Numéro réel, relevé sur l'affiche officielle. */
    phone: "+243 826 264 770",
    whatsapp: "+243 826 264 770",
    /** Chiffres uniquement, format international - pour les liens wa.me. */
    whatsappDigits: "243826264770",
    email: "bonjour@azaria.cd",
  },

  hours: [
    { days: "Lundi – Vendredi", slots: "11h00 – 21h00" },
    { days: "Samedi", slots: "12h00 – 22h00" },
    { days: "Dimanche", slots: "Fermé" },
  ],

  socials: [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "WhatsApp", href: "#" },
  ],
} as const;

/**
 * Textes de la section « plats de la semaine ». Le contenu (plats, prix,
 * accompagnements, dates) vient de l'API publique : un seul plat par jour.
 */
export const weekProgram = {
  eyebrow: "Le programme",
  title: "Les plats de la semaine",
  intro:
    "Un seul plat par jour, préparé le matin même. Choisissez votre jour, ajoutez vos accompagnements, commandez sans créer de compte.",
  /** Repli si l'API n'a encore rien programmé. */
  range: "Menu de la semaine",
} as const;

/**
 * Section « Plat du jour », calquée sur l'affiche officielle
 * (design/affiche_model.png). Le plat lui-même vient de l'API ; ne
 * restent ici que les textes fixes.
 */
export const dishOfDay = {
  title: "Le plat du jour",
  /** Avantage affiché sur l'affiche - à ajuster si l'offre change. */
  perk: "Bouteille d'eau 250 ml offerte",
  cta: "Commander ce plat",
  /** Bandeau de réassurance repris du pied de l'affiche officielle. */
  guarantees: [
    "Livraison rapide",
    "Plat frais du jour",
    "Qualité garantie",
  ],
  /** Phrase d'ambiance du bas de l'affiche, sous la composition du plat. */
  pitch: "Un repas savoureux et généreux aux saveurs locales.",
} as const;

