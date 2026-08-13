import { site } from "@/lib/site";

export function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.86 9.86 0 0 0 4.74 1.2h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.16 0 4.19.84 5.72 2.37a8.03 8.03 0 0 1 2.37 5.72c0 4.47-3.63 8.1-8.1 8.1a8.2 8.2 0 0 1-4.13-1.13l-.3-.18-3.06.8.82-2.99-.2-.31a8.06 8.06 0 0 1-1.24-4.3c0-4.46 3.64-8.09 8.12-8.09Zm-2.9 4.32c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.19 1.1.16 1.52.1.46-.07 1.43-.59 1.63-1.15.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.31-.74-1.79-.19-.46-.39-.4-.54-.41h-.46Z" />
    </svg>
  );
}

/** Lien wa.me avec message pré-rempli — le client n'a rien à taper. */
export function whatsappHref(message: string): string {
  return `https://wa.me/${site.contact.whatsappDigits}?text=${encodeURIComponent(message)}`;
}

type WhatsappButtonProps = {
  /** Corps du message pré-rempli. Par défaut : le plat du jour. */
  message?: string;
  label?: string;
  /** `lg` pour les CTA de section, `sm` (défaut) pour la barre de nav. */
  size?: "sm" | "lg";
};

export function WhatsappButton({
  message = `Bonjour ${site.name}, je voudrais commander le plat du jour.`,
  label = "Commander",
  size = "sm",
}: WhatsappButtonProps) {
  return (
    <a
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-btn bg-brand font-semibold text-cream transition-colors hover:bg-brand-dark ${
        size === "lg" ? "px-6 py-3.5 text-base" : "px-4 py-2.5 text-sm"
      }`}
    >
      <WhatsappIcon className={size === "lg" ? "size-5" : "size-4"} />
      {label}
    </a>
  );
}
