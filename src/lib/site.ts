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
  description:
    "Azaria programme chaque semaine un menu différent. Choisissez votre plat, votre date et votre heure de livraison - on s'occupe du reste.",

  contact: {
    address: "42, avenue du Lac · Quartier Himbi",
    city: "Goma, RD Congo",
    phone: "+243 990 000 000",
    whatsapp: "+243 990 000 000",
    /** Chiffres uniquement, format international - pour les liens wa.me. */
    whatsappDigits: "243990000000",
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

/** Liens de la barre de navigation (colonne de gauche). */
export const navLinks = [
  { label: "Menu", href: "#menu" },
  { label: "Comment ça marche", href: "#fonctionnement" },
  { label: "Commande spéciale", href: "#commande-speciale" },
  { label: "Contact", href: "#contact" },
] as const;

/** Semaine actuellement programmée - viendra de l'API plus tard. */
export const currentWeek = {
  range: "Semaine du 20 au 24 juillet",
} as const;

/**
 * Programme de la semaine - DONNÉES FICTIVES en attendant l'API.
 *
 * Reflète le domaine : le menu est un calendrier (un plat par jour sur
 * un intervalle de dates), avec un statut de disponibilité basculé à la
 * main (« disponible » / « épuisé »). `today` met en avant le jour
 * courant. Les prix sont ceux de la formule, en USD.
 */
export const weekProgram = {
  eyebrow: "Le programme",
  title: "Le menu de la semaine",
  intro:
    "Un plat différent chaque jour, préparé le matin même. Réservez le vôtre pour le jour qui vous arrange.",
  range: "Semaine du 20 au 24 juillet",
  days: [
    {
      key: "lun",
      day: "Lundi",
      date: "20 juil.",
      dish: "Haricots · Poulet fumé · Riz",
      price: "8,50 $",
      image: "/plats/menu/lundi.jpg",
      status: "available" as const,
    },
    {
      key: "mar",
      day: "Mardi",
      date: "21 juil.",
      dish: "Ratatouille · Mabundu grillé · Riz ou Foufou",
      price: "9,00 $",
      image: "/plats/menu/mardi.jpg",
      status: "sold_out" as const,
    },
    {
      key: "mer",
      day: "Mercredi",
      date: "22 juil.",
      dish: "Madesu · Chikwangue · Légumes",
      price: "7,50 $",
      image: "/plats/menu/mercredi.jpg",
      status: "available" as const,
      today: true,
    },
    {
      key: "jeu",
      day: "Jeudi",
      date: "23 juil.",
      dish: "Poulet mayo · Frites · Salade",
      price: "8,00 $",
      image: "/plats/menu/jeudi.jpg",
      status: "available" as const,
    },
    {
      key: "ven",
      day: "Vendredi",
      date: "24 juil.",
      dish: "Poisson braisé · Banane plantain",
      price: "10,00 $",
      image: "/plats/menu/vendredi.jpg",
      status: "available" as const,
    },
  ],
} as const;

/** Plat mis en avant dans la carte du hero. */
export const featuredDish = {
  eyebrow: "Le choix du jour",
  title: "Haricots, poulet fumé & riz",
  price: "8,50 $",
  /**
   * Trois assiettes, comme sur le modèle : une principale au centre et
   * deux secondaires en retrait. Images d'illustration Unsplash -
   * voir public/plats/CREDITS.md.
   */
  plates: {
    main: {
      src: "/plats/plat-riz.jpg",
      alt: "Assiette de riz épicé aux légumes",
    },
    left: { src: "/plats/plat-poulet.jpg", alt: "Plat de poulet grillé" },
    right: {
      src: "/plats/plat-legumes.jpg",
      alt: "Bol de légumes et céréales",
    },
  },
  /**
   * Accroches destinées à ouvrir l'appétit et à pousser vers le menu
   * complet - volontairement pas des prix : un tarif referme la
   * question, une promesse donne envie de cliquer.
   */
  teasers: [
    "4 autres plats cette semaine",
    "Nouveau programme chaque lundi",
    "Riz, foufou ou plantain au choix",
  ],
  cta: "Voir les 5 plats de la semaine",
} as const;

/**
 * Mot de la cheffe affiché dans le hero.
 *
 * ⚠️ PLACEHOLDER : le nom, la citation et la photo sont inventés.
 * À remplacer par la vraie cheffe d'Azaria, avec son accord, avant
 * toute mise en ligne - présenter ceci comme authentique tromperait
 * les clients.
 */
export const chef = {
  name: "Cheffe Nadine Mwamba",
  role: "Cheffe de cuisine",
  quote:
    "Je cuisine chaque plat le jour même, avec ce que le marché offre de meilleur. Rien n'attend au congélateur.",
  photo: "/plats/cheffe.jpg",
  /** Reproduit la signature manuscrite du modèle. */
  signature: "Nadine M.",
} as const;

/**
 * Section « À propos » - mosaïque d'images à gauche, titre + points à
 * droite (d'après design/model-about-us.png). Images d'illustration
 * Unsplash, voir public/plats/CREDITS.md.
 */
export const about = {
  eyebrow: "La maison",
  title: "Une cuisine fraîche, pensée pour vous.",
  intro:
    "Azaria n'est pas un fast-food comme les autres. Chaque semaine, un menu différent ; chaque jour, des plats préparés le matin même.",
  mosaic: {
    main: {
      src: "/plats/about/about-main.jpg",
      alt: "Plat mijoté servi avec des légumes frais",
    },
    top: {
      src: "/plats/about/about-top.jpg",
      alt: "Assiette dressée avec soin",
    },
    bottom: {
      src: "/plats/about/about-bottom.jpg",
      alt: "Plat de nouilles sautées",
    },
  },
  badge: "Fait maison",
  features: [
    {
      title: "Cuisiné le jour même",
      description:
        "Rien ne dort au congélateur. On prépare le matin, avec les produits du marché.",
      icon: "flame" as const,
      tone: "brand" as const,
    },
    {
      title: "Un menu qui change",
      description:
        "Un nouveau programme chaque semaine. Cinq plats, jamais la lassitude.",
      icon: "calendar" as const,
      tone: "ink" as const,
    },
    {
      title: "Livré ou à emporter",
      description:
        "Vous choisissez le jour et l'heure. On s'occupe du reste, chez vous ou à retirer.",
      icon: "bag" as const,
      tone: "amber" as const,
    },
  ],
} as const;

/** Section « Comment ça marche » - le parcours en trois étapes. */
export const howItWorks = {
  eyebrow: "En trois étapes",
  title: "Comment ça marche",
  intro:
    "De la carte à votre table, tout tient en trois gestes. Pas de compte compliqué, pas d'attente au comptoir.",
  steps: [
    {
      n: "01",
      title: "Choisissez votre plat",
      description:
        "Parcourez le menu de la semaine et sélectionnez le plat du jour qui vous fait envie.",
      icon: "menu" as const,
    },
    {
      n: "02",
      title: "Dites-nous quand et où",
      description:
        "Livraison ou retrait, à la date et à l'heure qui vous arrangent. Ajoutez une note si besoin.",
      icon: "clock" as const,
    },
    {
      n: "03",
      title: "On cuisine, vous dégustez",
      description:
        "Votre plat est préparé le matin même, puis livré chez vous ou tenu prêt à emporter.",
      icon: "serve" as const,
    },
  ],
} as const;

/**
 * Section « Commande spéciale ».
 *
 * Reflète le flux du domaine : plat hors menu décrit librement → devis
 * fixé par l'admin → validation du client, puis préparation.
 */
export const specialOrder = {
  eyebrow: "Sur mesure",
  title: "Une envie hors menu ?",
  description:
    "Un plat qui n'est pas au programme, un repas pour un événement, une grande tablée ? Décrivez ce que vous voulez : on vous répond avec un prix, vous validez, on cuisine.",
  steps: [
    {
      title: "Décrivez votre demande",
      description: "Le plat, la quantité, la date. En quelques lignes.",
    },
    {
      title: "On vous envoie un devis",
      description: "Un prix clair, sans engagement, sous 24 h.",
    },
    {
      title: "Vous validez, on prépare",
      description: "Dès votre accord, votre commande entre en cuisine.",
    },
  ],
  cta: "Faire une demande",
  note: "Prévoyez au moins 48 h pour les commandes spéciales.",
} as const;

/** Section « Contact ». */
export const contactSection = {
  eyebrow: "Nous écrire",
  title: "Une question ? Parlons-en.",
  intro:
    "Une demande, une commande spéciale, une remarque ? Le plus simple reste WhatsApp - on répond vite.",
  /** Sujets proposés dans le formulaire (pré-remplissent le message). */
  topics: [
    "Passer une commande",
    "Commande spéciale",
    "Question sur le menu",
    "Autre",
  ],
} as const;
