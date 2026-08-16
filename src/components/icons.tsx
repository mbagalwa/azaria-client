/**
 * Icônes au trait de la maquette. Toutes partagent le même gabarit
 * 24×24 et héritent de `currentColor` : la couleur se décide au point
 * d'usage, jamais ici.
 */

type IconProps = { className?: string };

function Stroke({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  );
}

/** Cloche de service — accroche « plat du jour ». */
export function DomeIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M3 17h18" />
      <path d="M4.5 14a7.5 7.5 0 0 1 15 0" />
      <path d="M12 6.5V5" />
      <path d="M2 20h20" />
    </Stroke>
  );
}

export function LeafIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M4 20c0-8 5-13 16-13 0 8-5 13-16 13Z" />
      <path d="M9 15c1.5-3 4-5 7-6" />
    </Stroke>
  );
}

/** Silhouette de pilon — « riche en protéines ». */
export function DrumstickIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M14.5 3.5a5 5 0 0 0-7 7l-1 1a3 3 0 1 0 3 3l1-1a5 5 0 0 0 7-7 3.5 3.5 0 0 0-3-3Z" />
      <path d="M7.5 16.5 4 20" />
    </Stroke>
  );
}

export function BagIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </Stroke>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M12 20s-7-4.5-7-9.5A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.5c0 5-7 9.5-7 9.5Z" />
    </Stroke>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </Stroke>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3.5V6M16 3.5V6" />
    </Stroke>
  );
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M14.5 5 8 12l6.5 7" />
    </Stroke>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M9.5 5 16 12l-6.5 7" />
    </Stroke>
  );
}

export function SproutIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M12 20v-7" />
      <path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5Z" />
      <path d="M12 13c0-2.5-1.7-4.5-4.5-4.5 0 2.5 1.7 4.5 4.5 4.5Z" />
    </Stroke>
  );
}

export function ChefHatIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M7 14.5a4 4 0 1 1 1.2-7.8 4.2 4.2 0 0 1 7.6 0A4 4 0 1 1 17 14.5v0H7Z" />
      <path d="M7 14.5V19h10v-4.5" />
      <path d="M7 17h10" />
    </Stroke>
  );
}

export function BowlIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M3.5 11h17a8.5 8.5 0 0 1-17 0Z" />
      <path d="M9 7.5c0-1.5 3-1.5 3-3M14 7.5c0-1 1.5-1.2 1.5-2.5" />
    </Stroke>
  );
}

export function ReceiptIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M6 3.5h12v17l-2.5-1.6-2.5 1.6-2.5-1.6L8 20.5l-2 1.3V3.5Z" />
      <path d="M9.5 8h5M9.5 11.5h5" />
    </Stroke>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M6.5 3.5h3l1.2 3.4-1.8 1.4a11 11 0 0 0 5 5l1.4-1.8 3.4 1.2v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
    </Stroke>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M12 21s6.5-6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </Stroke>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Stroke>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </Stroke>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Stroke>
  );
}

/** Petit losange or au centre du filet qui souligne les titres. */
export function SparkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden className={className}>
      <path d="M6 0 7.4 4.6 12 6 7.4 7.4 6 12 4.6 7.4 0 6l4.6-1.4Z" />
    </svg>
  );
}

/* --- Réseaux : en aplat, comme sur la maquette --- */

function Solid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      {children}
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <Solid className={className}>
      <path d="M13.5 9H16V6h-2.5C11.57 6 10 7.57 10 9.5V11H8v3h2v7h3v-7h2.5l.5-3H13V9.5c0-.28.22-.5.5-.5Z" />
    </Solid>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <Solid className={className}>
      <path d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Zm0 5.94a2.34 2.34 0 1 1 0-4.68 2.34 2.34 0 0 1 0 4.68ZM17.1 8.26a.84.84 0 1 1-1.68 0 .84.84 0 0 1 1.68 0ZM16.5 3h-9A4.5 4.5 0 0 0 3 7.5v9A4.5 4.5 0 0 0 7.5 21h9a4.5 4.5 0 0 0 4.5-4.5v-9A4.5 4.5 0 0 0 16.5 3Zm3.24 13.5a3.24 3.24 0 0 1-3.24 3.24h-9a3.24 3.24 0 0 1-3.24-3.24v-9A3.24 3.24 0 0 1 7.5 4.26h9a3.24 3.24 0 0 1 3.24 3.24v9Z" />
    </Solid>
  );
}

export function WhatsappIcon({ className }: IconProps) {
  return (
    <Solid className={className}>
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.86 9.86 0 0 0 4.74 1.2h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.16 0 4.19.84 5.72 2.37a8.03 8.03 0 0 1 2.37 5.72c0 4.47-3.63 8.1-8.1 8.1a8.2 8.2 0 0 1-4.13-1.13l-.3-.18-3.06.8.82-2.99-.2-.31a8.06 8.06 0 0 1-1.24-4.3c0-4.46 3.64-8.09 8.12-8.09Zm-2.9 4.32c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.19 1.1.16 1.52.1.46-.07 1.43-.59 1.63-1.15.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.31-.74-1.79-.19-.46-.39-.4-.54-.41h-.46Z" />
    </Solid>
  );
}
