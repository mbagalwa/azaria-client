"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { logoutAction } from "@/app/app/actions";

const NAV = [
  { href: "/app", label: "Commander" },
  { href: "/app/commandes", label: "Mes commandes" },
];

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function AppHeader({ name }: { name: string }) {
  const pathname = usePathname();
  const firstName = name.trim().split(/\s+/)[0];

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/85 backdrop-blur-md">
      {/* Desktop : logo + nav + déconnexion */}
      <div className="mx-auto hidden h-16 max-w-5xl items-center justify-between gap-3 px-5 lg:flex">
        <Link href="/app" className="shrink-0 text-brand transition-opacity hover:opacity-80">
          <Logo size={26} />
        </Link>
        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-btn px-3 py-1.5 text-sm font-medium transition-colors ${
                  active ? "bg-ink text-cream" : "text-ink-soft hover:text-brand"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2.5">
          <span className="max-w-32 truncate text-sm font-medium text-ink-soft">
            {name}
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-btn border border-ink/15 px-2.5 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-ink/5 hover:text-brand"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>

      {/* Mobile : salutation + avatar */}
      <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-5 lg:hidden">
        <div className="min-w-0">
          <p className="text-xs text-ink-muted">Bonjour 👋</p>
          <p className="truncate font-display text-lg font-bold leading-tight text-ink">
            {firstName}
          </p>
        </div>
        <Link
          href="/app/profil"
          aria-label="Mon profil"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-cream"
        >
          {initialsOf(name)}
        </Link>
      </div>
    </header>
  );
}
