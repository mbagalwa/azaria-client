import type { Metadata } from "next";
import { Caveat, Inter, Outfit } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

/** Sans géométrique des titres, dans l'esprit du modèle du hero. */
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

/** Utilisée uniquement pour la signature manuscrite de la cheffe. */
const caveat = Caveat({
  variable: "--font-caveat",
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
      className={`${outfit.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
      /* Les extensions de navigateur (LanguageTool…) injectent des
         attributs sur <html> avant l'hydratation : on ignore ce faux
         positif, limité à cette balise. */
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
