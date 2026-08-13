import { WhatsappButton, WhatsappIcon } from "@/components/whatsapp-button";
import { site } from "@/lib/site";

/** Tracés des icônes réseaux, alignés sur ceux du hero. */
const socialPaths: Record<string, string> = {
  Facebook:
    "M13.5 9H16V6h-2.5C11.57 6 10 7.57 10 9.5V11H8v3h2v7h3v-7h2.5l.5-3H13v-1.5c0-.28.22-.5.5-.5Z",
  Instagram:
    "M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Zm0 5.94a2.34 2.34 0 1 1 0-4.68 2.34 2.34 0 0 1 0 4.68ZM17.1 8.26a.84.84 0 1 1-1.68 0 .84.84 0 0 1 1.68 0ZM16.5 3h-9A4.5 4.5 0 0 0 3 7.5v9A4.5 4.5 0 0 0 7.5 21h9a4.5 4.5 0 0 0 4.5-4.5v-9A4.5 4.5 0 0 0 16.5 3Zm3.24 13.5a3.24 3.24 0 0 1-3.24 3.24h-9a3.24 3.24 0 0 1-3.24-3.24v-9A3.24 3.24 0 0 1 7.5 4.26h9a3.24 3.24 0 0 1 3.24 3.24v9Z",
};

const columnTitle =
  "text-[0.7rem] font-bold uppercase tracking-[0.18em] text-cream/50";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        {/* ---- Appel à commander ---- */}
        <div className="flex flex-col items-start gap-6 border-b border-cream/10 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-signature text-3xl text-amber">
              {site.slogan}
            </p>
            <p className="mt-2 max-w-xl font-display text-[clamp(1.75rem,4vw,3rem)] font-black uppercase leading-[0.95] tracking-tight">
              Réservez votre part avant qu&apos;elle ne parte
            </p>
          </div>
          <WhatsappButton size="lg" label="Commander sur WhatsApp" />
        </div>

        {/* ---- Coordonnées ---- */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className={columnTitle}>Adresse</p>
            <address className="mt-3 not-italic leading-relaxed text-cream/80">
              {site.contact.address}
              <br />
              {site.contact.city}
            </address>
          </div>

          <div>
            <p className={columnTitle}>Contact</p>
            <ul className="mt-3 space-y-2 text-cream/80">
              <li>
                <a
                  href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-brand"
                >
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${site.contact.whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-brand"
                >
                  <WhatsappIcon className="size-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="transition-colors hover:text-brand"
                >
                  {site.contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className={columnTitle}>Horaires</p>
            <ul className="mt-3 space-y-2 text-cream/80">
              {site.hours.map((slot) => (
                <li key={slot.days} className="flex justify-between gap-4">
                  <span>{slot.days}</span>
                  <span className="text-cream/60">{slot.slots}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={columnTitle}>Suivez-nous</p>
            <ul className="mt-3 flex gap-2">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={
                      social.label === "WhatsApp"
                        ? `https://wa.me/${site.contact.whatsappDigits}`
                        : social.href
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-chip bg-cream/10 transition-colors hover:bg-brand"
                  >
                    {social.label === "WhatsApp" ? (
                      <WhatsappIcon className="size-4" />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden
                        className="size-4"
                      >
                        <path d={socialPaths[social.label]} />
                      </svg>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---- Signature : le nom en pleine largeur, comme un tampon ---- */}
        <p
          aria-hidden
          className="select-none border-t border-cream/10 pt-10 text-center font-display text-[clamp(4rem,18vw,15rem)] font-black uppercase leading-[0.8] tracking-[-0.04em] text-cream/10"
        >
          {site.name}
        </p>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-xs text-cream/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. Tous droits réservés.
          </p>
          <p>{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
