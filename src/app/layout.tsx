import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

/**
 * Serif éditoriale : Lora. Contraste modéré et empattements francs — le
 * caractère de la maquette, en plus solide. Elle tient le titre du hero
 * en très gros comme le prix d'une carte en 1 rem, ce que les Didones
 * (Playfair) et les serifs à axe variable (Fraunces) rendaient fragile.
 */
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} - ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} - ${site.tagline}`,
    description: site.description,
    locale: "fr_CD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${lora.variable} ${inter.variable} h-full antialiased`}
      /* Les extensions de navigateur (LanguageTool…) injectent des
         attributs sur <html> avant l'hydratation : on ignore ce faux
         positif, limité à cette balise. */
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
