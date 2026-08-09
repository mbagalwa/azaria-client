import Image from "next/image";
import { site } from "@/lib/site";

/**
 * Hero d'après design/hero-model.png : composition en deux colonnes.
 * À gauche, badge ambre, grand titre serif, description et deux boutons
 * pilule ; à droite, une photo plein cadre aux angles arrondis qui
 * occupe toute la hauteur.
 *
 * Le plat du jour et les plats de la semaine ont chacun leur propre
 * section juste en dessous : le hero ne porte que la promesse.
 */
export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 lg:pb-20">
      <div className="grid gap-10 lg:min-h-[calc(100svh-9.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        {/* ---------------------------------------------- Colonne texte */}
        <div className="flex flex-col items-start justify-center py-2 lg:py-10">
          <p className="inline-flex items-center rounded-chip bg-amber px-4 py-1.5 text-xs font-semibold tracking-wide text-ink">
            Cuisine maison · {site.contact.city.split(",")[0]}
          </p>

          <h1 className="mt-6 font-display text-[2.9rem] font-bold leading-[1.04] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[4.4rem]">
            Le menu du jour, réservé à l&apos;avance.
          </h1>

          <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-ink-muted">
            {site.description}
          </p>

          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <a
              href="#menu"
              className="inline-flex items-center justify-center rounded-btn bg-ink px-10 py-4 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft sm:min-w-52"
            >
              Commander
            </a>

            <a
              href={`https://wa.me/${site.contact.whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-btn border border-ink/25 px-10 py-4 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-surface sm:min-w-52"
            >
              Écrire sur WhatsApp
            </a>
          </div>
        </div>

        {/* --------------------------------------------- Colonne visuelle */}
        <div className="relative aspect-4/5 overflow-hidden rounded-panel sm:aspect-16/10 lg:aspect-auto lg:h-full">
          <Image
            src="/plats/hero.jpg"
            alt="Foufou et légumes verts mijotés, servis à l'assiette"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
