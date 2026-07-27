import { WeekMenu } from "@/components/week-menu";
import { getOrderingWindow, getWeekMenu } from "@/lib/orders";
import { formatShortFR } from "@/lib/dates";
import { weekProgram } from "@/lib/site";

/**
 * Section « plats de la semaine », alimentée par l'API publique : un plat par
 * jour, commandable sans compte. Les dates commandables et le cut-off viennent
 * du serveur (fuseau métier) — la vitrine ne recalcule rien.
 */
export async function WeekProgram() {
  const [menuRes, windowRes] = await Promise.all([
    getWeekMenu(),
    getOrderingWindow(),
  ]);

  const menu = menuRes.ok ? menuRes.data : null;
  const win = windowRes.ok ? windowRes.data : null;
  const days = menu?.days ?? [];
  const range =
    days.length > 0
      ? `Du ${formatShortFR(days[0].date)} au ${formatShortFR(days[days.length - 1].date)}`
      : weekProgram.range;

  return (
    <section id="menu" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
      {/* En-tête de section */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {weekProgram.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.015em] text-ink sm:text-4xl">
            {weekProgram.title}
          </h2>
          <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink-muted">
            {weekProgram.intro}
          </p>
        </div>

        <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-btn border border-ink/10 bg-surface px-4 py-2.5 text-sm font-semibold text-ink-soft sm:self-auto">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="text-brand"
          >
            <rect x="3" y="4.5" width="18" height="17" rx="2.5" />
            <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
          </svg>
          {range}
        </span>
      </div>

      {days.length === 0 ? (
        <p className="mt-10 rounded-card border border-dashed border-ink/15 px-6 py-14 text-center text-sm text-ink-muted">
          {menuRes.ok
            ? "Le menu de la semaine arrive très bientôt."
            : "Le menu est momentanément indisponible. Réessayez dans un instant."}
        </p>
      ) : (
        <WeekMenu
          days={days}
          deliveryFeeCents={menu?.deliveryFeeCents ?? 0}
          today={win?.today ?? ""}
          earliest={win?.earliest ?? days[0].date}
        />
      )}

      {/* Note : cut-off */}
      <p className="mt-8 flex items-center justify-center gap-2 text-center text-[0.8rem] text-ink-muted">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0 text-brand"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
        Commandes du jour jusqu&apos;à{" "}
        {win?.cutoff ?? menu?.orderCutoff ?? "09:00"} — au-delà, réservez pour le
        lendemain.
      </p>
    </section>
  );
}
