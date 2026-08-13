"use client";

import { useEffect, useState } from "react";

import { Logo } from "@/components/logo";
import { WhatsappButton } from "@/components/whatsapp-button";

/** Défilement à partir duquel la barre se densifie et le CTA apparaît. */
const REVEAL_AT = 80;

/**
 * Barre de navigation minimale : le logo est centré tant qu'on est en
 * haut de page — le hero parle tout seul — puis il glisse à gauche et
 * laisse apparaître le bouton WhatsApp dès que la page défile.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > REVEAL_AT);
    onScroll(); // état correct si la page est rechargée en cours de page
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-cream-deep bg-white/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div
        className={`relative mx-auto flex max-w-7xl items-center px-6 transition-[height] duration-500 ease-out ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        {/* Positionné en absolu pour pouvoir glisser du centre vers la
            gauche : `left` et `transform` s'animent tous les deux. */}
        <div
          className={`absolute top-1/2 transition-[left,transform] duration-500 ease-out ${
            scrolled
              ? "left-6 -translate-y-1/2"
              : "left-1/2 -translate-x-1/2 -translate-y-1/2"
          }`}
        >
          <Logo />
        </div>

        {/* Réservé dans le flux en permanence : l'apparition se joue sur
            l'opacité, pas sur le montage, pour ne rien décaler. */}
        <div
          className={`ml-auto transition-all duration-300 ${
            scrolled
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0"
          }`}
          aria-hidden={!scrolled}
        >
          <WhatsappButton />
        </div>
      </div>
    </header>
  );
}
