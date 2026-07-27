import { Logo } from "@/components/logo";
import { navLinks, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-ink/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <span className="text-brand">
            <Logo />
          </span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
            {site.tagline}
          </p>
          <ul className="mt-5 flex gap-3">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  className="inline-flex rounded-chip border border-ink/15 px-4 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-brand hover:text-brand"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold text-ink">
            Navigation
          </h2>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-ink-muted transition-colors hover:text-brand"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold text-ink">
            Nous trouver
          </h2>
          <address className="mt-4 space-y-1.5 text-sm not-italic text-ink-muted">
            <p>{site.contact.address}</p>
            <p>{site.contact.city}</p>
            <p>
              <a
                href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-brand"
              >
                {site.contact.phone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${site.contact.email}`}
                className="transition-colors hover:text-brand"
              >
                {site.contact.email}
              </a>
            </p>
          </address>

          <ul className="mt-5 space-y-1.5 text-sm text-ink-muted">
            {site.hours.map((entry) => (
              <li key={entry.days} className="flex justify-between gap-4">
                <span>{entry.days}</span>
                <span className="text-ink-soft">{entry.slots}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. Tous droits réservés.
          </p>
          <p>Coordonnées de démonstration - à remplacer.</p>
        </div>
      </div>
    </footer>
  );
}
