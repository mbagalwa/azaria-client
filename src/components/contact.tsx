import { ContactForm } from "@/components/contact-form";
import { contactSection, site } from "@/lib/site";

/** Coordonnées cliquables affichées à gauche. */
const details = [
  {
    label: "Adresse",
    value: `${site.contact.address}, ${site.contact.city}`,
    href: undefined,
    icon: (
      <>
        <path d="M20 10c0 6-8 11-8 11s-8-5-8-11a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  },
  {
    label: "Téléphone",
    value: site.contact.phone,
    href: `tel:${site.contact.phone.replace(/\s/g, "")}`,
    icon: (
      <path d="M4 5c0 8.837 7.163 16 16 16v-3.5a1.5 1.5 0 0 0-1.2-1.47l-3-.6a1.5 1.5 0 0 0-1.5.62l-.7 1a12 12 0 0 1-5-5l1-.7a1.5 1.5 0 0 0 .62-1.5l-.6-3A1.5 1.5 0 0 0 7.5 5H4Z" />
    ),
  },
  {
    label: "WhatsApp",
    value: site.contact.whatsapp,
    href: `https://wa.me/${site.contact.whatsappDigits}`,
    icon: (
      <>
        <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z" />
        <path d="M8.5 8.8c0-.4.3-.8.7-.8.3 0 .6.2.8.6l.5 1.1c.1.3 0 .6-.2.8l-.4.4a5 5 0 0 0 2.2 2.2l.4-.4c.2-.2.5-.3.8-.2l1.1.5c.4.2.6.5.6.8 0 .4-.4.7-.8.7A6.4 6.4 0 0 1 8.5 8.8Z" />
      </>
    ),
  },
  {
    label: "E-mail",
    value: site.contact.email,
    href: `mailto:${site.contact.email}`,
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
  },
] as const;

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Colonne coordonnées */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {contactSection.eyebrow}
          </p>
          <h2 className="mt-3 max-w-[14ch] font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.015em] text-ink sm:text-4xl">
            {contactSection.title}
          </h2>
          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ink-muted">
            {contactSection.intro}
          </p>

          <ul className="mt-8 space-y-4">
            {details.map((detail) => {
              const content = (
                <>
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-tint text-brand">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {detail.icon}
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium uppercase tracking-wide text-ink-muted">
                      {detail.label}
                    </span>
                    <span className="block text-[0.95rem] font-semibold text-ink">
                      {detail.value}
                    </span>
                  </span>
                </>
              );

              return (
                <li key={detail.label}>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      target={detail.href.startsWith("http") ? "_blank" : undefined}
                      rel={detail.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-4 rounded-card p-2 transition-colors hover:bg-cream-deep/50"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-2">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Horaires */}
          <div className="mt-8 max-w-md rounded-card border border-ink/10 bg-surface p-5">
            <h3 className="font-display text-sm font-bold text-ink">
              Horaires d&apos;ouverture
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
              {site.hours.map((entry) => (
                <li key={entry.days} className="flex justify-between gap-4">
                  <span>{entry.days}</span>
                  <span className="font-medium text-ink-soft">{entry.slots}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Colonne formulaire */}
        <ContactForm />
      </div>
    </section>
  );
}
