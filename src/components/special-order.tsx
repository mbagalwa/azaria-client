import { site, specialOrder } from "@/lib/site";

/** Message WhatsApp pré-rempli pour une demande spéciale. */
const waHref = `https://wa.me/${site.contact.whatsappDigits}?text=${encodeURIComponent(
  "Bonjour Azaria, j'aimerais passer une commande spéciale : ",
)}`;

export function SpecialOrder() {
  return (
    <section
      id="commande-speciale"
      className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12"
    >
      <div className="overflow-hidden rounded-panel bg-ink px-6 py-12 text-cream sm:px-10 lg:px-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
          {/* Colonne texte */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">
              {specialOrder.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-[2.1rem] font-extrabold leading-[1.08] tracking-[-0.015em] text-cream sm:text-[2.75rem]">
              {specialOrder.title}
            </h2>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-cream/75">
              {specialOrder.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-btn bg-amber py-3.5 pl-7 pr-5 text-sm font-semibold text-ink transition-colors hover:bg-amber-deep"
              >
                {specialOrder.cta}
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
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <p className="text-xs text-cream/60">{specialOrder.note}</p>
            </div>
          </div>

          {/* Colonne étapes du devis */}
          <ol className="space-y-3">
            {specialOrder.steps.map((step, index) => (
              <li
                key={step.title}
                className="flex items-start gap-4 rounded-card bg-cream/[0.06] p-4 ring-1 ring-cream/10"
              >
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-amber font-display text-sm font-bold text-ink">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-cream">
                    {step.title}
                  </h3>
                  <p className="mt-0.5 text-[0.85rem] leading-relaxed text-cream/70">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
