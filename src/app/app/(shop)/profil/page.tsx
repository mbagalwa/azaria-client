import Link from "next/link";
import { getCurrentCustomer, getToken } from "@/lib/auth";
import { listMyOrders } from "@/lib/orders";
import { logoutAction } from "@/app/app/actions";

export const metadata = { title: "Mon profil" };

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default async function ProfilPage() {
  const [customer, token] = await Promise.all([getCurrentCustomer(), getToken()]);
  const name = customer?.fullName ?? "Mon compte";
  const ordersRes = token ? await listMyOrders(token, { limit: 1 }) : null;
  const ordersCount = ordersRes?.ok ? (ordersRes.meta?.total ?? 0) : 0;

  return (
    <div className="mx-auto max-w-md space-y-5">
      {/* Carte identité */}
      <div className="flex flex-col items-center rounded-card border border-ink/10 bg-surface px-6 py-8 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-ink text-2xl font-bold text-cream">
          {initialsOf(name)}
        </span>
        <h1 className="mt-4 font-display text-xl font-bold text-ink">{name}</h1>
        {customer?.phone && (
          <p className="mt-0.5 text-sm text-ink-soft">{customer.phone}</p>
        )}
      </div>

      {/* Stat */}
      <Link
        href="/app/commandes"
        className="flex items-center justify-between rounded-card border border-ink/10 bg-surface px-5 py-4 transition-colors hover:border-brand/40"
      >
        <span className="text-sm font-medium text-ink-soft">Mes commandes</span>
        <span className="flex items-center gap-2">
          <span className="rounded-chip bg-brand-tint px-2.5 py-1 font-display text-sm font-bold text-brand-dark">
            {ordersCount}
          </span>
          <span className="text-ink-muted">›</span>
        </span>
      </Link>

      <div className="space-y-2 rounded-card border border-ink/10 bg-surface p-2">
        <Link
          href="/app"
          className="flex items-center justify-between rounded-btn px-3 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
        >
          Passer une commande <span className="text-ink-muted">›</span>
        </Link>
        <Link
          href="/"
          className="flex items-center justify-between rounded-btn px-3 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
        >
          Retour au site <span className="text-ink-muted">›</span>
        </Link>
      </div>

      <form action={logoutAction}>
        <button
          type="submit"
          className="w-full rounded-btn border border-brand/30 bg-brand-tint px-4 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand hover:text-cream"
        >
          Se déconnecter
        </button>
      </form>
    </div>
  );
}
