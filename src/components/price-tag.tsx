import { formatFc, formatFcParts } from "@/lib/format";

/**
 * Montant en gros, devise détachée à côté en petites capitales : la
 * lecture de l'affiche officielle, où « 15.000 » et « FC » ne sont pas
 * au même niveau.
 */
function Amount({
  amount,
  className,
  currencyClassName,
}: {
  amount: number;
  className: string;
  currencyClassName: string;
}) {
  const { value, currency } = formatFcParts(amount);

  return (
    <span className="flex items-baseline gap-1.5">
      <span className={`font-display font-black leading-none ${className}`}>
        {value}
      </span>
      <span
        className={`font-bold uppercase tracking-[0.18em] ${currencyClassName}`}
      >
        {currency}
      </span>
    </span>
  );
}

/**
 * Pastille compacte posée sur une photo : montant et devise seuls, sur
 * fond encre pour rester lisible quelle que soit l'image.
 */
export function PriceChip({ amount }: { amount: number }) {
  return (
    <span className="inline-block rounded-card bg-ink/95 px-3 py-2 text-cream backdrop-blur-sm">
      <Amount amount={amount} className="text-xl" currencyClassName="text-[0.65rem] text-amber" />
    </span>
  );
}

type PriceNoteProps = {
  /** Prix du repas, en francs congolais. */
  amount: number;
  /** Frais de livraison, en seconde ligne discrète. */
  deliveryAmount?: number;
};

/**
 * Le prix posé sur le fond clair, sans cadre : deux lignes alignées à
 * droite, le montant puis la livraison en petit. Volontairement léger —
 * dans le hero, le prix accompagne la composition, il ne la concurrence
 * pas.
 */
export function PriceNote({ amount, deliveryAmount }: PriceNoteProps) {
  return (
    <div className="text-right">
      <Amount
        amount={amount}
        className="text-2xl text-ink sm:text-3xl"
        currencyClassName="text-xs text-brand"
      />
      <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-ink-muted">
        Prix du repas
        {deliveryAmount !== undefined && (
          <>
            {" · "}
            <span className="whitespace-nowrap">
              + {formatFc(deliveryAmount)} livraison
            </span>
          </>
        )}
      </p>
    </div>
  );
}
