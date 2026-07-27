import Link from "next/link";
import { AuthForm } from "@/components/app/auth-form";
import { signupAction } from "@/app/app/actions";

export const metadata = { title: "Créer un compte" };

export default function InscriptionPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">
        Créer mon compte
      </h1>
      <p className="mb-6 mt-1 text-sm text-ink-soft">
        Quelques secondes suffisent pour commander.
      </p>

      <AuthForm mode="signup" action={signupAction} />

      <p className="mt-6 text-center text-sm text-ink-soft">
        Déjà un compte ?{" "}
        <Link href="/app/connexion" className="font-semibold text-brand hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
