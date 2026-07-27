import Link from "next/link";
import { AuthForm } from "@/components/app/auth-form";
import { loginAction } from "@/app/app/actions";

export const metadata = { title: "Connexion" };

export default function ConnexionPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Bon retour 👋</h1>
      <p className="mb-6 mt-1 text-sm text-ink-soft">
        Connectez-vous avec votre numéro WhatsApp.
      </p>

      <AuthForm mode="login" action={loginAction} />

      <p className="mt-6 text-center text-sm text-ink-soft">
        Pas encore de compte ?{" "}
        <Link href="/app/inscription" className="font-semibold text-brand hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
