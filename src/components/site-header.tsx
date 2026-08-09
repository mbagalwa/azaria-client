"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { site } from "@/lib/site";

/**
 * Barre de navigation flottante, fond encre, angles adoucis (rounded-md).
 * Logo à gauche, liens de section au centre, WhatsApp + « Commander » à
 * droite. Sous `md`, les liens passent dans un panneau dépliant.
 *
 * Ce header sert la vitrine ET la page de suivi de commande : les
 * destinations sont donc absolues (`/#menu`), jamais de simples ancres.
 */

const NAV_LINKS = [
  { id: "plat-du-jour", href: "/#plat-du-jour", label: "Plat du jour" },
  { id: "menu", href: "/#menu", label: "Menu de la semaine" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Surligne le lien de la section à l'écran. Sur les pages qui n'ont
  // pas ces sections (suivi de commande), il n'y a rien à observer.
  useEffect(() => {
    const sections = NAV_LINKS.map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // Bande de détection au milieu de l'écran : la section « active »
      // est celle que le visiteur regarde vraiment.
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-8 sm:pt-4">
      <div
        className={`mx-auto max-w-7xl rounded-panel bg-ink transition-shadow duration-300 ${
          scrolled ? "shadow-[0_18px_45px_-20px_rgba(18,59,46,0.75)]" : ""
        }`}
      >
        <div className="flex h-14 items-center gap-2 pl-4 pr-2 lg:h-16 lg:pl-6 lg:pr-2.5">
          {/* Gauche - logo, retour à l'accueil */}
          <Link
            href="/"
            aria-label="Azaria — retour à l'accueil"
            className="shrink-0 rounded-btn text-brand transition-opacity hover:opacity-85"
          >
            <Logo size={26} wordClassName="text-cream" />
          </Link>

          {/* Centre - sections de la vitrine */}
          <nav aria-label="Sections" className="ml-4 hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                aria-current={active === link.id ? "true" : undefined}
                className={`rounded-btn px-3 py-2 text-[0.85rem] font-medium transition-colors ${
                  active === link.id
                    ? "bg-cream/12 text-cream"
                    : "text-cream/65 hover:bg-cream/8 hover:text-cream"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Droite - contact direct puis action principale */}
          <div className="ml-auto flex items-center gap-2">
            <a
              href={`https://wa.me/${site.contact.whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center gap-2 rounded-btn border border-cream/20 px-4 text-[0.82rem] font-medium text-cream/80 transition-colors hover:border-cream/40 hover:text-cream sm:inline-flex lg:h-11"
            >
              <WhatsAppIcon />
              WhatsApp
            </a>

            <Link
              href="/#menu"
              className="inline-flex h-10 items-center rounded-btn bg-amber px-5 text-[0.82rem] font-semibold text-ink transition-colors hover:bg-amber-deep lg:h-11 lg:px-6"
            >
              Commander
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="nav-mobile"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="inline-flex size-10 items-center justify-center rounded-btn text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream md:hidden"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Panneau mobile - les mêmes destinations, en pleine largeur */}
        {menuOpen && (
          <div
            id="nav-mobile"
            className="border-t border-cream/10 px-3 pb-3 pt-2 md:hidden"
          >
            <nav aria-label="Sections" className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active === link.id ? "true" : undefined}
                  className={`rounded-btn px-3 py-2.5 text-sm font-medium transition-colors ${
                    active === link.id
                      ? "bg-cream/12 text-cream"
                      : "text-cream/70 hover:bg-cream/8 hover:text-cream"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`https://wa.me/${site.contact.whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-btn px-3 py-2.5 text-sm font-medium text-cream/70 transition-colors hover:bg-cream/8 hover:text-cream sm:hidden"
              >
                <WhatsAppIcon />
                Écrire sur WhatsApp
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.3-1.95 1.34-.5.04-.98.22-3.3-.69-2.78-1.1-4.55-3.94-4.69-4.12-.14-.18-1.12-1.49-1.12-2.85s.71-2.02.97-2.3c.25-.27.55-.34.73-.34l.53.01c.17 0 .4-.06.62.48.24.57.8 1.98.87 2.12.07.14.12.31.02.5-.1.18-.15.29-.29.45l-.44.5c-.14.14-.29.3-.13.59.17.28.74 1.22 1.59 1.98 1.09.97 2.01 1.28 2.29 1.42.28.14.45.12.62-.07.17-.2.71-.83.9-1.11.19-.29.38-.24.64-.14.26.09 1.66.78 1.95.92.28.14.47.21.54.33.07.11.07.65-.17 1.33Z" />
    </svg>
  );
}
