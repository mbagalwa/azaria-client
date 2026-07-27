import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { getCurrentCustomer } from "@/lib/auth";

/**
 * Espace d'authentification client : carte centrée sur fond crème. Si déjà
 * connecté, on file directement à l'app.
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customer = await getCurrentCustomer();
  if (customer) redirect("/app");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-cream px-5 py-10">
      <Link href="/" className="mb-8 text-brand transition-opacity hover:opacity-80">
        <Logo size={34} />
      </Link>
      <div className="w-full max-w-sm rounded-card border border-ink/10 bg-surface p-6 shadow-[0_25px_60px_-35px_rgba(18,59,46,0.45)] sm:p-8">
        {children}
      </div>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-ink-muted transition-colors hover:text-brand"
      >
        ← Retour au site
      </Link>
    </main>
  );
}
