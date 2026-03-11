// -----------------------------------------------
// Bid for bid – central konfiguration
// Ret navn, tagline og farver ét sted her.
// -----------------------------------------------

export const siteConfig = {
  name: "Bid for bid",

  // Skift til et af de andre forslag ved at ændre linjen herunder:
  // "Mad, der virker. Hver dag."
  // "Opskrifter, rester og små genveje."
  // "Hverdagsmad med ro i maven."
  tagline: "Mad, der virker. Hver dag.",

  description:
    "Opskrifter til en travl børnefamilie – plus konkrete AI-genveje til madplan, indkøb og rester.",

  url: "https://bid-for-bid.vercel.app",

  // Standard portioner (bruges som default i alle opskrifter)
  defaultServingsLabel: "2 voksne + 2 børn",
  defaultServingsCount: 4,

  // Navigation
  nav: [
    { label: "Opskrifter", href: "/opskrifter" },
    { label: "AI i hverdagen", href: "/ai-i-hverdagen" },
    { label: "Ugeplan", href: "/ugeplan" },
    { label: "Om", href: "/om" },
  ],

  // Opskrift-kategorier (bruges til filtrering og navigation)
  categories: [
    { slug: "hurtig-hverdagsmad", label: "Hurtig hverdagsmad", description: "20–30 min fra køleskab til bord" },
    { slug: "bornevenligt", label: "Børnevenligt", description: "Retter børn faktisk spiser" },
    { slug: "fisk-skaldyr", label: "Fisk & skaldyr", description: "Fra hav til bord" },
    { slug: "vegetar", label: "Vegetar", description: "Grønt der mætter" },
    { slug: "italien", label: "Italien", description: "Pasta, polenta og klassikere" },
    { slug: "one-pot-ovn", label: "One-pot & ovn", description: "Et fad, færre opvaskede gryder" },
    { slug: "rester-madpakke", label: "Rester & madpakke", description: "Spis op, smid mindre ud" },
    { slug: "fermentering-sylt", label: "Fermentering & sylt", description: "Det gode der tager tid" },
  ],

  // AI-guide kategorier
  aiCategories: [
    { slug: "madplan", label: "Madplan" },
    { slug: "indkob", label: "Indkøb" },
    { slug: "rester", label: "Rester" },
    { slug: "fermentering", label: "Fermentering" },
    { slug: "bornevenlig-mad", label: "Børnevenlig mad" },
    { slug: "projektstyring", label: "Projektstyring i hverdagen" },
  ],

  // Indkøbsliste-grupperinger
  shoppingGroups: [
    "Grønt",
    "Mejeri",
    "Kød & Fisk",
    "Kolonial",
    "Krydderier",
    "Andet",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
