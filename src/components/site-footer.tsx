import {
  FacebookIcon,
  InstagramIcon,
  SparkIcon,
  WhatsappIcon,
} from "@/components/icons";
import { Wordmark } from "@/components/wordmark";
import { site } from "@/lib/site";

const SOCIALS = [
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  {
    label: "WhatsApp",
    href: `https://wa.me/${site.contact.whatsappDigits}`,
    Icon: WhatsappIcon,
  },
] as const;

/** Signature de la maquette, au centre du pied de page. */
const TAGLINE = "Le plaisir de bien manger chaque jour";

export function SiteFooter() {
  return (
    <footer className="bg-ink-deep text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-6 lg:grid-cols-3 lg:items-center">
        <div className="flex justify-center lg:justify-start">
          <Wordmark size="lg" />
        </div>

        <div className="text-center">
          <span
            aria-hidden
            className="mx-auto flex w-32 items-center gap-2 text-gold"
          >
            <span className="h-px flex-1 bg-gold/40" />
            <SparkIcon className="size-2" />
            <span className="h-px flex-1 bg-gold/40" />
          </span>
          <p className="mt-3 text-sm text-cream/80">{TAGLINE}</p>
        </div>

        <ul className="flex items-center justify-center gap-3 lg:justify-end">
          {SOCIALS.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="grid size-9 place-items-center rounded-full border border-cream/25 text-cream/80 transition-colors hover:border-gold hover:text-gold"
              >
                <Icon className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-ink-line">
        <p className="mx-auto max-w-7xl px-5 py-4 text-center text-xs text-cream/45 sm:px-6">
          © {new Date().getFullYear()} {site.name} Restaurant. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
