"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { navLinks } from "@/lib/site";

/**
 * Barre de navigation : menu à gauche, logo au centre, bouton « Commander »
 * à droite (disposition demandée).
 *
 * En dessous de `lg`, les liens basculent dans un panneau dépliant
 * ouvert par le bouton hamburger, qui reste à gauche pour préserver
 * l'équilibre de la composition.
 *
 * Ce header sert la vitrine ET la page de suivi de commande : toutes les
 * destinations sont donc absolues (`/#section`), jamais de simples ancres.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-ink/10 bg-cream/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto grid h-14 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 sm:px-8 lg:h-16 lg:grid-cols-3">
        {/* Gauche - navigation, compacte pour ne pas serrer le logo central */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-4 xl:gap-5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="whitespace-nowrap text-[0.8rem] font-medium text-ink-soft transition-colors hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="inline-flex size-9 items-center justify-center rounded-btn border border-ink/15 text-ink transition-colors hover:bg-ink/5 lg:hidden"
        >
          <span className="relative block h-3 w-4">
            <span
              className={`absolute left-0 block h-0.5 w-4 rounded-full bg-current transition-transform duration-300 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-0.5 w-4 rounded-full bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-4 rounded-full bg-current transition-transform duration-300 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>

        {/* Centre - logo, retour à l'accueil */}
        <div className="flex justify-center">
          <Link
            href="/"
            aria-label="Azaria — retour à l'accueil"
            className="rounded-full text-brand outline-offset-4 transition-opacity hover:opacity-80"
          >
            <Logo size={28} />
          </Link>
        </div>

        {/* Droite - accès direct au menu (aucun compte n'est nécessaire) */}
        <div className="flex justify-end">
          <Link
            href="/#menu"
            className="inline-flex items-center gap-2 rounded-btn bg-ink px-4 py-2 text-[0.82rem] font-semibold text-cream transition-colors hover:bg-ink-soft sm:px-5"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18M3 12h18M3 18h13" />
            </svg>
            <span className="hidden sm:inline">Commander</span>
          </Link>
        </div>
      </div>

      {/* Panneau mobile */}
      <div
        id="menu-mobile"
        hidden={!open}
        className="border-t border-ink/10 bg-cream/95 backdrop-blur-md lg:hidden"
      >
        <ul className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block border-b border-ink/5 py-3 text-base font-medium text-ink-soft transition-colors last:border-0 hover:text-brand"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
