"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { createOrderAction, type CreateOrderState } from "@/app/actions";
import { formatUsd } from "@/lib/format";
import { formatLongFR } from "@/lib/dates";
import type { MenuDish } from "@/lib/orders";

/** Créneaux proposés — l'heure exacte reste libre côté API. */
const TIME_SLOTS = ["11:30", "12:00", "12:30", "13:00", "18:30", "19:00", "19:30"];

const initialState: CreateOrderState = {};

/**
 * Modal de commande sans compte : le client choisit sa quantité et ses
 * accompagnements, puis remplit ses coordonnées. À la validation, l'équipe est
 * alertée et un accusé de réception part sur son WhatsApp.
 */
export function OrderDialog({
  date,
  dish,
  deliveryFeeCents,
  open,
  onClose,
}: {
  date: string;
  dish: MenuDish;
  deliveryFeeCents: number;
  open: boolean;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    createOrderAction,
    initialState,
  );
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState<number[]>([]);
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");

  const extrasCents = useMemo(
    () =>
      dish.accompaniments
        .filter((a) => extras.includes(a.id))
        .reduce((sum, a) => sum + a.priceCents, 0),
    [dish.accompaniments, extras],
  );

  const subtotal = (dish.priceCents + extrasCents) * quantity;
  const fee = mode === "delivery" ? deliveryFeeCents : 0;
  const total = subtotal + fee;

  function toggleExtra(id: number) {
    setExtras((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));
  }

  if (!open) return null;

  /** Écran de confirmation : la commande est passée, on donne le code de suivi. */
  if (state.code) {
    return (
      <Shell onClose={onClose} title="Commande envoyée">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#e6f4ec]">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="text-ink"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div>
            <p className="font-display text-xl font-extrabold text-ink">
              Merci, c&apos;est noté !
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              Votre commande{" "}
              <span className="font-semibold text-ink">{state.code}</span> a été
              transmise. Un accusé de réception part sur votre WhatsApp, et vous
              y recevrez chaque étape jusqu&apos;à la livraison.
            </p>
          </div>
          <Link
            href={`/commande/${state.code}`}
            className="inline-flex w-full items-center justify-center rounded-btn bg-ink px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
          >
            Suivre ma commande
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-ink-muted underline-offset-4 hover:underline"
          >
            Fermer
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell onClose={onClose} title={dish.name}>
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="deliveryDate" value={date} />
        <input type="hidden" name="quantity" value={quantity} />
        <input type="hidden" name="mode" value={mode} />

        <p className="text-sm text-ink-muted">
          <span className="capitalize">{formatLongFR(date)}</span> ·{" "}
          {formatUsd(dish.priceCents)} l&apos;assiette
        </p>

        {state.error && (
          <p
            role="alert"
            className="rounded-btn border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {state.error}
          </p>
        )}

        {/* Quantité */}
        <div className="flex items-center justify-between rounded-card border border-ink/10 bg-cream px-4 py-3">
          <span className="text-sm font-semibold text-ink">Quantité</span>
          <div className="flex items-center gap-3">
            <Stepper
              label="Retirer une assiette"
              symbol="−"
              disabled={pending || quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            />
            <span className="w-6 text-center font-display text-lg font-extrabold text-ink">
              {quantity}
            </span>
            <Stepper
              label="Ajouter une assiette"
              symbol="+"
              disabled={pending || quantity >= 20}
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            />
          </div>
        </div>

        {/* Accompagnements */}
        {dish.accompaniments.length > 0 && (
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-ink">
              Accompagnements
            </legend>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {dish.accompaniments.map((a) => {
                const on = extras.includes(a.id);
                return (
                  <label
                    key={a.id}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-btn border px-3 py-2 text-sm transition-colors ${
                      on
                        ? "border-brand bg-amber-tint text-ink"
                        : "border-ink/10 bg-surface text-ink-soft hover:border-ink/25"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="accompanimentIds"
                      value={a.id}
                      checked={on}
                      onChange={() => toggleExtra(a.id)}
                      disabled={pending}
                      className="size-4 accent-[var(--color-brand,#FF4D00)]"
                    />
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {a.name}
                    </span>
                    <span className="shrink-0 text-xs text-ink-muted">
                      {a.priceCents > 0 ? `+${formatUsd(a.priceCents)}` : "inclus"}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Coordonnées */}
        <div className="space-y-3">
          <Field label="Nom complet" htmlFor="fullName">
            <input
              id="fullName"
              name="fullName"
              required
              autoComplete="name"
              placeholder="Nadine Kabila"
              disabled={pending}
              className={inputClass}
            />
          </Field>

          <Field label="Numéro WhatsApp" htmlFor="phone">
            <input
              id="phone"
              name="phone"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="099 123 45 67"
              disabled={pending}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-ink-muted">
              C&apos;est là que vous recevrez la confirmation et le suivi.
            </p>
          </Field>

          {/* Mode de retrait */}
          <div className="grid grid-cols-2 gap-2">
            {(["delivery", "pickup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                disabled={pending}
                aria-pressed={mode === m}
                className={`rounded-btn border px-3 py-2.5 text-sm font-semibold transition-colors ${
                  mode === m
                    ? "border-ink bg-ink text-cream"
                    : "border-ink/10 bg-surface text-ink-soft hover:border-ink/25"
                }`}
              >
                {m === "delivery" ? "Livraison" : "Retrait sur place"}
              </button>
            ))}
          </div>

          {mode === "delivery" && (
            <>
              <Field label="Lieu de livraison" htmlFor="address">
                <input
                  id="address"
                  name="address"
                  required
                  placeholder="Av. du Lac 12, Himbi"
                  disabled={pending}
                  className={inputClass}
                />
              </Field>
              <Field label="Point de repère (optionnel)" htmlFor="landmark">
                <input
                  id="landmark"
                  name="landmark"
                  placeholder="En face de la pharmacie"
                  disabled={pending}
                  className={inputClass}
                />
              </Field>
            </>
          )}

          <Field label="Heure souhaitée" htmlFor="deliveryTime">
            <select
              id="deliveryTime"
              name="deliveryTime"
              defaultValue="12:00"
              disabled={pending}
              className={inputClass}
            >
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Note pour la cuisine (optionnel)" htmlFor="note">
            <textarea
              id="note"
              name="note"
              rows={2}
              placeholder="Sans piment, merci."
              disabled={pending}
              className={`${inputClass} resize-y`}
            />
          </Field>
        </div>

        {/* Récapitulatif */}
        <div className="space-y-1.5 rounded-card bg-cream px-4 py-3 text-sm">
          <Row label={`Sous-total (${quantity} × assiette)`} value={formatUsd(subtotal)} />
          {mode === "delivery" && (
            <Row label="Frais de livraison" value={formatUsd(fee)} />
          )}
          <div className="flex items-center justify-between border-t border-ink/10 pt-1.5 font-display text-base font-extrabold text-ink">
            <span>Total à payer</span>
            <span>{formatUsd(total)}</span>
          </div>
          <p className="text-xs text-ink-muted">💵 Paiement à la livraison.</p>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-btn bg-brand px-5 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Envoi en cours…" : "Valider ma commande"}
        </button>
      </form>
    </Shell>
  );
}

const inputClass =
  "w-full rounded-btn border border-ink/15 bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-brand disabled:opacity-60";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-sm font-semibold text-ink"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-ink-muted">
      <span>{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}

function Stepper({
  label,
  symbol,
  disabled,
  onClick,
}: {
  label: string;
  symbol: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex size-8 items-center justify-center rounded-full border border-ink/15 bg-surface text-lg font-bold text-ink transition-colors hover:border-ink/40 disabled:opacity-40"
    >
      {symbol}
    </button>
  );
}

/** Habillage du modal : voile + panneau centré, défilable sur petit écran. */
function Shell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-ink/50 backdrop-blur-[1px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-card bg-surface p-5 shadow-2xl sm:rounded-card sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold leading-tight text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="-mr-1 -mt-1 shrink-0 rounded-full p-1.5 text-ink-muted transition-colors hover:bg-cream hover:text-ink"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
