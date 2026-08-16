"use client";

import Image from "next/image";
import { useActionState, useEffect, useId, useRef, useState } from "react";

import { createOrderAction, type OrderFormState } from "@/app/actions";
import { BagIcon, CheckIcon, CloseIcon } from "@/components/icons";
import { useOrder } from "@/components/order-provider";
import { DELIVERY_FEE_FC, TIME_SLOTS, type DayDish } from "@/lib/menu-data";
import { formatFc } from "@/lib/format";
import { site } from "@/lib/site";

/**
 * Indicatifs proposés, RDC en tête puisque c'est le cas courant. Le
 * drapeau est un emoji : il ne s'affiche pas sous Windows, où le système
 * rend les lettres régionales (« CD ») — l'indicatif reste donc toujours
 * lisible à côté.
 */
const COUNTRIES = [
  { code: "+243", flag: "🇨🇩", name: "RD Congo" },
  { code: "+242", flag: "🇨🇬", name: "Congo" },
  { code: "+250", flag: "🇷🇼", name: "Rwanda" },
  { code: "+257", flag: "🇧🇮", name: "Burundi" },
  { code: "+256", flag: "🇺🇬", name: "Ouganda" },
  { code: "+260", flag: "🇿🇲", name: "Zambie" },
  { code: "+32", flag: "🇧🇪", name: "Belgique" },
  { code: "+33", flag: "🇫🇷", name: "France" },
] as const;

const INITIAL: OrderFormState = { status: "idle" };

const field =
  "w-full rounded-btn border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-gold";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft";

export function OrderDialog({
  dish,
  onClose,
}: {
  dish: DayDish;
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState(createOrderAction, INITIAL);
  const [step, setStep] = useState<1 | 2>(1);
  const [quantity, setQuantity] = useState(1);
  const [mode, setMode] = useState<"pickup" | "delivery">("pickup");
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  /**
   * Coordonnées contrôlées : React 19 réinitialise un formulaire après
   * une action serveur, ce qui viderait les champs en cas d'erreur. On
   * garde donc la saisie en état local.
   */
  const [contact, setContact] = useState({
    fullName: "",
    countryCode: COUNTRIES[0].code,
    phoneNumber: "",
    address: "",
    landmark: "",
    deliveryTime: TIME_SLOTS[1],
    note: "",
  });

  const set = (key: keyof typeof contact) => (value: string) =>
    setContact((c) => ({ ...c, [key]: value }));

  const subtotal = dish.priceFc * quantity;
  const total = subtotal + (mode === "delivery" ? DELIVERY_FEE_FC : 0);
  const done = state.status === "done";

  // La pastille de la barre de nav compte les commandes réellement
  // enregistrées : on ne la crédite qu'au retour du serveur.
  const { notifyPlaced } = useOrder();
  useEffect(() => {
    if (done) notifyPlaced();
  }, [done, notifyPlaced]);

  // Fermeture au clavier + verrou du défilement de la page derrière.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-t-panel bg-cream shadow-2xl outline-none sm:rounded-panel"
      >
        {/* ---- En-tête ---- */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-cream px-5 py-4 sm:px-6">
          <div>
            <p className="eyebrow text-gold">
              {done ? "Commande envoyée" : `Étape ${step} sur 2`}
            </p>
            <h2 id={titleId} className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
              {done
                ? "C'est noté, merci !"
                : step === 1
                  ? "Votre commande"
                  : "Retrait & contact"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="-mr-1 rounded-btn p-2 text-ink-muted transition-colors hover:bg-line/40 hover:text-ink"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        {done ? (
          <ConfirmationPanel code={state.code} onClose={onClose} />
        ) : (
          <form action={action} className="px-5 py-5 sm:px-6">
            {/* Les valeurs de l'étape 1 restent montées : elles doivent
                partir avec le formulaire même quand l'étape 2 est
                affichée. */}
            <input type="hidden" name="deliveryDate" value={dish.isoDate} />
            <input type="hidden" name="quantity" value={quantity} />
            <input type="hidden" name="mode" value={mode} />

            {step === 1 ? (
              <StepOne
                dish={dish}
                quantity={quantity}
                setQuantity={setQuantity}
                mode={mode}
                setMode={setMode}
                subtotal={subtotal}
                total={total}
              />
            ) : (
              <StepTwo
                mode={mode}
                contact={contact}
                set={set}
                dish={dish}
                quantity={quantity}
                total={total}
              />
            )}

            {state.status === "error" && (
              <p
                role="alert"
                className="mt-4 rounded-btn border border-gold bg-gold-tint px-3.5 py-2.5 text-sm text-ink"
              >
                {state.message}
              </p>
            )}

            <div className="mt-6 flex items-center gap-3">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-btn border border-line px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-line/40"
                >
                  Retour
                </button>
              )}
              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-btn bg-ink px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
                >
                  Continuer
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={pending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-btn bg-ink px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft disabled:opacity-60"
                >
                  <BagIcon className="size-4" />
                  {pending ? "Envoi…" : `Commander · ${formatFc(total)}`}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */

function StepOne({
  dish,
  quantity,
  setQuantity,
  mode,
  setMode,
  subtotal,
  total,
}: {
  dish: DayDish;
  quantity: number;
  setQuantity: (n: number) => void;
  mode: "pickup" | "delivery";
  setMode: (m: "pickup" | "delivery") => void;
  subtotal: number;
  total: number;
}) {
  return (
    <>
      <div className="flex items-center gap-4 rounded-card border border-line bg-surface p-3">
        <Image
          src={dish.image}
          alt={dish.alt}
          placeholder="blur"
          width={72}
          height={72}
          className="size-18 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">
            {dish.day} {dish.date}
          </p>
          <p className="mt-0.5 font-display text-lg font-semibold leading-tight text-ink">
            {dish.name}
          </p>
          <p className="mt-1 font-display text-base font-semibold text-gold-deep">
            {formatFc(dish.priceFc)}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <span className={label}>Quantité</span>
        <div className="inline-flex items-center gap-1 rounded-btn border border-line bg-surface p-1">
          <QtyButton onClick={() => setQuantity(Math.max(1, quantity - 1))} label="Retirer une part">
            −
          </QtyButton>
          <span className="w-10 text-center font-display text-lg font-semibold text-ink">{quantity}</span>
          <QtyButton onClick={() => setQuantity(Math.min(20, quantity + 1))} label="Ajouter une part">
            +
          </QtyButton>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className={label}>Comment récupérer</legend>
        <div className="grid grid-cols-2 gap-2">
          <ModeCard
            active={mode === "pickup"}
            onClick={() => setMode("pickup")}
            title="Retrait"
            detail="Sur place, sans frais"
          />
          <ModeCard
            active={mode === "delivery"}
            onClick={() => setMode("delivery")}
            title="Livraison"
            detail={`+ ${formatFc(DELIVERY_FEE_FC)}`}
          />
        </div>
      </fieldset>

      <dl className="mt-5 space-y-1.5 border-t border-line pt-4 text-sm">
        <Row label={`Sous-total (${quantity} ×)`} value={formatFc(subtotal)} />
        {mode === "delivery" && (
          <Row label="Livraison" value={formatFc(DELIVERY_FEE_FC)} />
        )}
        <Row label="Total" value={formatFc(total)} strong />
      </dl>
    </>
  );
}

function StepTwo({
  mode,
  contact,
  set,
  dish,
  quantity,
  total,
}: {
  mode: "pickup" | "delivery";
  contact: Record<string, string>;
  set: (key: never) => (value: string) => void;
  dish: DayDish;
  quantity: number;
  total: number;
}) {
  // `set` est typé sur les clés de l'état du parent ; on le relâche ici
  // pour garder ce composant simple à lire.
  const on = set as unknown as (key: string) => (value: string) => void;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label} htmlFor="fullName">
            Nom complet
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            autoComplete="name"
            placeholder="Votre nom"
            className={field}
            value={contact.fullName}
            onChange={(e) => on("fullName")(e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <span className={label}>Numéro WhatsApp</span>
          {/* Indicatif et numéro forment UN seul champ encadré, séparés
              par un filet. Deux contrôles côte à côte réutilisant la
              classe `field` ne marchaient pas : elle contient `w-full`,
              que le `w-24` du select ne pouvait pas écraser — le select
              occupait toute la ligne et poussait le numéro hors du
              modal. Ici le select se dimensionne sur son contenu. */}
          <div className="flex items-stretch overflow-hidden rounded-btn border border-line bg-surface transition-colors focus-within:border-gold">
            <select
              name="countryCode"
              aria-label="Indicatif du pays"
              className="shrink-0 bg-transparent py-2.5 pl-3 pr-1 text-sm text-ink outline-none"
              value={contact.countryCode}
              onChange={(e) => on("countryCode")(e.target.value)}
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.code}
                </option>
              ))}
            </select>
            <span className="my-2 w-px shrink-0 bg-line" aria-hidden />
            <input
              name="phoneNumber"
              required
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="826 264 770"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink/40"
              value={contact.phoneNumber}
              onChange={(e) => on("phoneNumber")(e.target.value)}
            />
          </div>
        </div>

        {mode === "delivery" && (
          <>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="address">
                Adresse de livraison
              </label>
              <input
                id="address"
                name="address"
                required
                placeholder="Avenue, numéro, commune"
                className={field}
                value={contact.address}
                onChange={(e) => on("address")(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="landmark">
                Repère <span className="normal-case text-ink-muted">(facultatif)</span>
              </label>
              <input
                id="landmark"
                name="landmark"
                placeholder="En face de la pharmacie…"
                className={field}
                value={contact.landmark}
                onChange={(e) => on("landmark")(e.target.value)}
              />
            </div>
          </>
        )}

        <div>
          <label className={label} htmlFor="deliveryTime">
            Heure {mode === "delivery" ? "de livraison" : "de retrait"}
          </label>
          <select
            id="deliveryTime"
            name="deliveryTime"
            className={field}
            value={contact.deliveryTime}
            onChange={(e) => on("deliveryTime")(e.target.value)}
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={label} htmlFor="note">
            Note <span className="normal-case text-ink-muted">(facultatif)</span>
          </label>
          <input
            id="note"
            name="note"
            placeholder="Sans piment…"
            className={field}
            value={contact.note}
            onChange={(e) => on("note")(e.target.value)}
          />
        </div>
      </div>

      <dl className="mt-5 space-y-1.5 border-t border-line pt-4 text-sm">
        <Row label={`${quantity} × ${dish.name}`} value={dish.day} />
        <Row
          label={mode === "delivery" ? "Livraison" : "Retrait sur place"}
          value={contact.deliveryTime}
        />
        <Row label="Total" value={formatFc(total)} strong />
      </dl>
    </>
  );
}

function ConfirmationPanel({ code, onClose }: { code: string; onClose: () => void }) {
  return (
    <div className="px-5 py-8 text-center sm:px-6">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-ink text-cream">
        <CheckIcon className="size-7" />
      </span>
      <p className="mt-5 text-sm text-ink-soft">
        Votre commande est enregistrée sous la référence
      </p>
      <p className="mt-1 font-display text-3xl font-semibold tracking-wide text-ink">{code}</p>
      <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
        Vous recevez la confirmation sur WhatsApp. En cas de besoin, appelez le{" "}
        <span className="whitespace-nowrap text-ink">{site.contact.phone}</span>.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 rounded-btn bg-ink px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
      >
        Fermer
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- */

function QtyButton({
  children,
  onClick,
  label: aria,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={aria}
      className="size-9 rounded-chip text-lg text-ink transition-colors hover:bg-line/40"
    >
      {children}
    </button>
  );
}

function ModeCard({
  active,
  onClick,
  title,
  detail,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  detail: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-card border px-4 py-3 text-left transition-colors ${
        active
          ? "border-ink bg-ink text-cream"
          : "border-line bg-surface text-ink hover:border-gold"
      }`}
    >
      <span className="block font-display text-base font-semibold">{title}</span>
      <span
        className={`mt-0.5 block text-xs ${active ? "text-cream/70" : "text-ink-muted"}`}
      >
        {detail}
      </span>
    </button>
  );
}

function Row({
  label: rowLabel,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={strong ? "font-semibold text-ink" : "text-ink-muted"}>{rowLabel}</dt>
      <dd
        className={
          strong ? "font-display text-lg font-semibold text-gold-deep" : "text-ink"
        }
      >
        {value}
      </dd>
    </div>
  );
}
