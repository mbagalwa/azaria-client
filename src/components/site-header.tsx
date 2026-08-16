"use client";

import { useState } from "react";

import { BagIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { useOrder } from "@/components/order-provider";
import { Wordmark } from "@/components/wordmark";

const NAV = [
  { label: "Plat du jour", href: "#plat-du-jour" },
  { label: "Menu de la semaine", href: "#menu" },
];

/**
 * Barre sombre, du même vert que le hero : les deux ne forment qu'un
 * seul bloc en haut de page. Navigation au centre sur grand écran ;
 * panier et menu déroulant sur mobile, comme sur la maquette.
 */
export function SiteHeader() {
  const { openOrder, placedCount } = useOrder();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ink-deep">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-6">
        <Wordmark />

        <nav className="hidden md:block">
          <ul className="flex items-center gap-9">
            {NAV.map((item, i) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`relative block py-1 text-sm transition-colors hover:text-cream ${
                    // Le premier lien porte le filet or de la maquette.
                    i === 0
                      ? "text-cream after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:bg-gold"
                      : "text-cream/70"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bouton complet à partir de `md`, icône seule en dessous. */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => openOrder()}
            aria-label="Commander"
            className="relative inline-flex items-center gap-2.5 rounded-btn text-sm text-gold transition-colors hover:text-cream md:border md:border-gold/60 md:px-5 md:py-2.5 md:hover:border-gold md:hover:text-gold"
          >
            <BagIcon className="size-6 md:size-4" />
            <span className="hidden md:inline">Commander</span>
            {placedCount > 0 && (
              <span className="absolute -right-2 -top-2 flex size-4.5 items-center justify-center rounded-full bg-gold text-[0.6rem] font-bold text-ink-deep">
                {placedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className="text-cream transition-colors hover:text-gold md:hidden"
          >
            {menuOpen ? <CloseIcon className="size-7" /> : <MenuIcon className="size-7" />}
          </button>
        </div>
      </div>

      {/* Volet mobile : replié par défaut, il pousse le contenu plutôt que
          de le recouvrir — la page reste lisible derrière. */}
      <div
        id="menu-mobile"
        hidden={!menuOpen}
        className="border-t border-ink-line md:hidden"
      >
        <ul className="mx-auto max-w-7xl px-5 py-3">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-sm text-cream/80 transition-colors hover:text-gold"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
