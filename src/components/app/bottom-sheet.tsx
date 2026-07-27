"use client";

import { useEffect } from "react";

/**
 * Feuille modale qui glisse depuis le bas (façon app mobile). Toujours montée
 * pour l'animation ; `open` pilote la translation. Ferme sur backdrop + Échap.
 * Sur desktop, elle reste centrée en bas mais bornée en largeur.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-ink/40 backdrop-blur-[1px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`absolute inset-x-0 bottom-0 mx-auto flex max-h-[90dvh] w-full max-w-lg flex-col rounded-t-[1.75rem] border border-ink/10 bg-surface shadow-[0_-20px_60px_-30px_rgba(18,59,46,0.5)] transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex shrink-0 flex-col items-center pt-3">
          <span className="h-1.5 w-10 rounded-full bg-ink/15" aria-hidden="true" />
          {title && (
            <div className="mt-2 flex w-full items-center justify-between px-5 pb-1">
              <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="-mr-1 rounded-full p-1.5 text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-2">
          {children}
        </div>
      </div>
    </div>
  );
}
