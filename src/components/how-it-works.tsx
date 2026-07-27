import { howItWorks } from "@/lib/site";

/** Icônes des étapes, tracées inline. */
const stepIcons = {
  menu: (
    <>
      <path d="M4 6h16M4 12h16M4 18h10" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  serve: (
    <>
      <path d="M4 15h16a8 8 0 0 0-16 0Z" />
      <path d="M12 15V8M9.5 9.5h5M3 19h18" />
    </>
  ),
} as const;

export function HowItWorks() {
  return (
    <section
      id="fonctionnement"
      className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24"
    >
      {/* En-tête centré */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          {howItWorks.eyebrow}
        </p>
        <h2 className="mt-3 font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.015em] text-ink sm:text-4xl">
          {howItWorks.title}
        </h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">
          {howItWorks.intro}
        </p>
      </div>

      {/* Étapes */}
      <div className="relative mt-14 grid gap-8 sm:grid-cols-3 sm:gap-6">
        {/* Ligne de liaison, derrière les étapes, desktop seulement */}
        <div
          className="absolute inset-x-[16.66%] top-8 hidden border-t-2 border-dashed border-ink/15 sm:block"
          aria-hidden="true"
        />

        {howItWorks.steps.map((step) => (
          <div key={step.n} className="relative flex flex-col items-center text-center">
            <span className="relative inline-flex size-16 items-center justify-center rounded-2xl bg-ink text-cream shadow-[0_16px_30px_-16px_rgba(18,59,46,0.9)]">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {stepIcons[step.icon]}
              </svg>
              <span className="absolute -right-2 -top-2 inline-flex size-7 items-center justify-center rounded-full bg-amber font-display text-xs font-bold text-ink shadow-sm">
                {step.n}
              </span>
            </span>

            <h3 className="mt-5 font-display text-lg font-bold text-ink">
              {step.title}
            </h3>
            <p className="mt-2 max-w-xs text-[0.9rem] leading-relaxed text-ink-muted">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 flex justify-center">
        <a
          href="#menu"
          className="group inline-flex items-center gap-3 rounded-btn bg-brand py-3.5 pl-7 pr-5 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(255,77,0,0.9)] transition-colors hover:bg-brand-dark"
        >
          Voir le menu de la semaine
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
      </div>
    </section>
  );
}
