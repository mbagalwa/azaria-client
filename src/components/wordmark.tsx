import Link from "next/link";

import { site } from "@/lib/site";

/**
 * Le bloc de marque de la maquette : le nom en serif largement espacé,
 * et « RESTAURANT » en tout petit dessous, en or, centré sous le nom.
 */
export function Wordmark({
  size = "md",
  asLink = true,
}: {
  size?: "md" | "lg";
  asLink?: boolean;
}) {
  const content = (
    <span className="block text-center leading-none">
      <span
        className={`block font-display uppercase text-cream ${
          size === "lg"
            ? "text-2xl tracking-[0.3em] sm:text-[1.75rem]"
            : "text-xl tracking-[0.3em] sm:text-2xl"
        }`}
      >
        {site.name}
      </span>
      <span className="mt-1.5 block text-[0.55rem] font-semibold uppercase tracking-[0.42em] text-gold">
        Restaurant
      </span>
    </span>
  );

  if (!asLink) return content;

  return (
    <Link href="/" aria-label={`${site.name} — accueil`} className="inline-block">
      {content}
    </Link>
  );
}
