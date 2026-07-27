import Image from "next/image";
import { about } from "@/lib/site";

/** Icônes des points de la section, tracées inline. */
const icons = {
  flame: (
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="17" rx="2.5" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
    </>
  ),
  bag: (
    <>
      <path d="M6 8h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.4h-9A1.5 1.5 0 0 1 5 20.5L4 8h2Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </>
  ),
} as const;

/** Fond de la pastille d'icône selon la tonalité - couleur pleine,
    coins arrondis (carré adouci) plutôt que cercle. */
const iconTone = {
  brand: "bg-brand text-white",
  ink: "bg-ink text-cream",
  amber: "bg-amber text-ink",
} as const;

export function About() {
  const { mosaic } = about;

  return (
    <section id="a-propos" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* ------------------------------------------ Mosaïque d'images
            `aspect-[4/3]` donne une hauteur à la grille : sans elle, les
            rangées s'effondrent et les images `fill` disparaissent. */}
        <div className="grid aspect-4/3 grid-cols-2 grid-rows-2 gap-3 sm:gap-4">
          {/* Grande image - colonne gauche, deux rangées */}
          <div className="relative row-span-2 overflow-hidden rounded-card">
            <Image
              src={mosaic.main.src}
              alt={mosaic.main.alt}
              fill
              sizes="(max-width: 1024px) 45vw, 25vw"
              className="object-cover"
            />
            <span className="absolute left-4 top-4 rounded-chip bg-brand px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-white shadow-sm">
              {about.badge}
            </span>
          </div>

          {/* Image haut-droite */}
          <div className="relative overflow-hidden rounded-card">
            <Image
              src={mosaic.top.src}
              alt={mosaic.top.alt}
              fill
              sizes="(max-width: 1024px) 45vw, 25vw"
              className="object-cover"
            />
          </div>

          {/* Image bas-droite, avec incrustation « Commander » */}
          <div className="group relative overflow-hidden rounded-card">
            <Image
              src={mosaic.bottom.src}
              alt={mosaic.bottom.alt}
              fill
              sizes="(max-width: 1024px) 45vw, 25vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink/75 via-ink/10 to-transparent" />
            <a
              href="#menu"
              className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 p-4 text-xs font-bold uppercase tracking-wide text-white"
            >
              Commander
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>

        {/* ---------------------------------------------- Titre + points */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {about.eyebrow}
          </p>
          <h2 className="mt-3 max-w-[15ch] font-display text-[2.6rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink sm:text-[3.25rem] lg:text-[3.6rem]">
            {about.title}
          </h2>
          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ink-muted">
            {about.intro}
          </p>

          <ul className="mt-8 space-y-6">
            {about.features.map((feature) => (
              <li key={feature.title} className="flex gap-4 sm:gap-5">
                <span
                  className={`inline-flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ${iconTone[feature.tone]}`}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {icons[feature.icon]}
                  </svg>
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink sm:text-xl">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-[0.9rem] leading-relaxed text-ink-muted">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
