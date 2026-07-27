"use client";

import { useActionState } from "react";
import type { AuthState } from "@/app/app/actions";

type Props = {
  mode: "login" | "signup";
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
};

const inputClass =
  "w-full rounded-btn border border-ink/15 bg-surface px-3.5 py-2.5 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:opacity-50";

export function AuthForm({ mode, action }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p
          role="alert"
          className="rounded-btn border border-brand/30 bg-brand-tint px-3 py-2 text-sm font-medium text-brand-dark"
        >
          {state.error}
        </p>
      )}

      {isSignup && (
        <Field
          label="Nom complet"
          name="fullName"
          placeholder="Nadine Kabila"
          defaultValue={state.values?.fullName}
          autoComplete="name"
          required
        />
      )}

      <Field
        label="Numéro WhatsApp"
        name="phone"
        type="tel"
        placeholder="+243 990 000 000"
        defaultValue={state.values?.phone}
        autoComplete="tel"
        required
      />

      <Field
        label="Mot de passe"
        name="password"
        type="password"
        placeholder={isSignup ? "8 caractères minimum" : "••••••••"}
        autoComplete={isSignup ? "new-password" : "current-password"}
        required
      />

      {isSignup && (
        <Field
          label="Confirmer le mot de passe"
          name="passwordConfirmation"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
        />
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-btn bg-brand px-4 py-3 text-[0.95rem] font-semibold text-cream transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {pending
          ? "Un instant…"
          : isSignup
            ? "Créer mon compte"
            : "Se connecter"}
      </button>
    </form>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.ComponentProps<"input">) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-soft">
        {label}
      </span>
      <input className={inputClass} {...props} />
    </label>
  );
}
