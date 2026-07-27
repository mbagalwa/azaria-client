import Image from "next/image";
import { chef, currentWeek, featuredDish, site } from "@/lib/site";

export function Hero() {
  const { plates } = featuredDish;

  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 lg:pb-24 lg:pt-12">
      {/*
        Mobile : texte → carte du plat → mot de la cheffe.
        Desktop : texte et cheffe empilés à gauche, carte du plat à
        droite sur les deux rangées.
      */}
      {/*
        `lg:grid-rows-[auto_1fr]` : la rangée du texte se dimensionne à
        son contenu, la seconde absorbe la hauteur excédentaire de la
        carte (qui occupe les deux rangées). Sans ça, l'excédent étirait
        la rangée du texte et repoussait la cheffe ~600 px plus bas.
      */}
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-12 lg:gap-y-8">
        {/* ---------------------------------------------- Colonne texte */}
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="inline-flex items-center gap-2 rounded-btn border border-ink/10 bg-surface px-4 py-1.5 text-xs font-medium tracking-wide text-ink-soft">
            <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
            {currentWeek.range}
          </p>

          <h1 className="mt-6 font-display text-[2.75rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[4.25rem]">
            Le menu du jour,
            <br />
            <span className="marker-highlight">réservé</span> à l&apos;avance.
          </h1>

          <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-ink-muted">
            {site.description}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#menu"
              className="group inline-flex items-center gap-3 rounded-btn bg-ink py-3 pl-7 pr-3 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
            >
              Commander
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-amber text-ink transition-transform duration-300 group-hover:translate-x-0.5">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>

            {/* Lien de défilement, pas de lecteur vidéo : le chevron
                vers le bas annonce ce qu'il fait vraiment. */}
            <a
              href="#fonctionnement"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-ink/25 decoration-2 underline-offset-[6px] transition-colors hover:text-brand hover:decoration-brand"
            >
              Comment ça marche
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-y-0.5"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </a>
          </div>
        </div>

        {/* --------------------------------------------- Colonne visuelle */}
        <div className="relative order-2 overflow-hidden rounded-panel bg-amber p-6 sm:p-9 lg:order-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium tracking-wide text-ink/70">
                {featuredDish.eyebrow}
              </p>
              <h2 className="mt-2 max-w-[14ch] font-display text-[1.75rem] font-extrabold leading-[1.12] tracking-[-0.015em] text-ink sm:text-[2.05rem]">
                {featuredDish.title}
              </h2>
            </div>

            {/* Décoratif : deviendra le contrôle du carrousel quand
                l'API alimentera plusieurs plats. */}
            <div className="hidden shrink-0 gap-2 sm:flex" aria-hidden="true">
              {["M15 18l-6-6 6-6", "M9 18l6-6-6-6"].map((d) => (
                <span
                  key={d}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-ink/25 text-ink/50"
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
                  >
                    <path d={d} />
                  </svg>
                </span>
              ))}
            </div>
          </div>

          {/* Grappe de trois assiettes, comme sur le modèle */}
          <div className="relative mt-5 aspect-[1/0.74] w-full">
            <div
              className="absolute left-1/2 top-[2%] aspect-square w-[62%] -translate-x-1/2 rounded-full border border-dashed border-ink/20"
              aria-hidden="true"
            />

            {/* Assiette secondaire - gauche */}
            <div className="absolute bottom-[2%] left-[1%] aspect-square w-[34%] overflow-hidden rounded-full shadow-[0_18px_40px_-18px_rgba(18,59,46,0.55)] ring-4 ring-amber/60">
              <Image
                src={plates.left.src}
                alt={plates.left.alt}
                fill
                sizes="(max-width: 1024px) 40vw, 20vw"
                className="object-cover"
              />
            </div>

            {/* Assiette secondaire - droite */}
            <div className="absolute bottom-[0%] right-[-3%] aspect-square w-[32%] overflow-hidden rounded-full shadow-[0_18px_40px_-18px_rgba(18,59,46,0.55)] ring-4 ring-amber/60">
              <Image
                src={plates.right.src}
                alt={plates.right.alt}
                fill
                sizes="(max-width: 1024px) 38vw, 19vw"
                className="object-cover"
              />
            </div>

            {/* Assiette principale */}
            <div className="absolute left-1/2 top-[5%] aspect-square w-[56%] -translate-x-1/2 overflow-hidden rounded-full shadow-[0_28px_60px_-22px_rgba(18,59,46,0.6)] ring-[6px] ring-surface/70">
              <Image
                src={plates.main.src}
                alt={plates.main.alt}
                fill
                priority
                sizes="(max-width: 1024px) 65vw, 32vw"
                className="object-cover"
              />
            </div>

            <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-chip bg-surface px-3 py-1 text-[0.7rem] font-bold tracking-wide text-ink shadow-sm">
              {featuredDish.price}
            </span>
          </div>

          {/* Accroches - elles annoncent ce qui reste à découvrir */}
          <ul className="mt-7 flex flex-wrap justify-center gap-2">
            {featuredDish.teasers.map((teaser) => (
              <li
                key={teaser}
                className="rounded-chip bg-surface px-3.5 py-2 text-[0.72rem] font-semibold text-ink-soft shadow-sm"
              >
                {teaser}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-center">
            <a
              href="#menu"
              className="group inline-flex items-center gap-3 rounded-btn bg-ink py-3.5 pl-7 pr-5 text-sm font-semibold text-cream shadow-[0_12px_28px_-12px_rgba(18,59,46,0.8)] transition-colors hover:bg-ink-soft"
            >
              {featuredDish.cta}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="text-amber transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>

        {/* ------------------------------------------ Le mot de la cheffe
            Disposition du modèle : texte à gauche, portrait à droite
            posé sur un disque ambre, signature manuscrite en bas. */}
        <figure className="order-3 flex max-w-lg items-center gap-6 lg:order-0 lg:col-start-1 lg:row-start-2 lg:self-start">
          <div className="min-w-0 flex-1">
            <figcaption>
              <p className="font-display text-xl font-bold tracking-tight text-ink">
                {chef.name}
              </p>
              <p className="mt-0.5 text-sm text-ink-muted">{chef.role}</p>
            </figcaption>

            <blockquote className="mt-3 text-[0.85rem] leading-relaxed text-ink-muted">
              <p>{chef.quote}</p>
            </blockquote>

            <p
              className="mt-2 -rotate-3 font-signature text-[2rem] leading-none text-ink/75"
              aria-hidden="true"
            >
              {chef.signature}
            </p>
          </div>

          {/* Disque ambre décalé - évoque le détourage du modèle sans
              disposer d'une image à fond transparent. */}
          <div className="relative size-32 shrink-0 sm:size-36">
            <div
              className="absolute inset-0 rounded-full bg-amber"
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 bottom-1 top-0 -translate-x-1.5 -translate-y-1.5 overflow-hidden rounded-full">
              <Image
                src={chef.photo}
                alt=""
                fill
                sizes="144px"
                className="object-cover"
              />
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
