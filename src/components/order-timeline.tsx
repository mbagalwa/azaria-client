import { ORDER_STATUS_LABEL } from "@/lib/order-status";
import type { OrderEventLite } from "@/lib/orders";

const fmtDateTime = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * Historique du cycle de la commande, du plus ancien au plus récent. Les
 * répétitions consécutives sont filtrées (défensif vis-à-vis des backfills).
 */
export function OrderTimeline({ events }: { events: OrderEventLite[] }) {
  const timeline = [...events]
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .filter((e, i, arr) => i === 0 || e.status !== arr[i - 1].status);

  if (timeline.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        Le suivi apparaîtra ici dès la confirmation.
      </p>
    );
  }

  return (
    <ol className="relative space-y-5 border-l border-ink/15 pl-5">
      {timeline.map((event, i) => {
        const isLast = i === timeline.length - 1;
        return (
          <li key={event.id} className="relative">
            <span
              aria-hidden="true"
              className={`absolute -left-[27px] top-0.5 flex size-4 items-center justify-center rounded-full ring-4 ring-surface ${
                isLast ? "bg-brand" : "bg-ink/25"
              }`}
            />
            <p
              className={`text-sm font-semibold ${isLast ? "text-ink" : "text-ink-soft"}`}
            >
              {ORDER_STATUS_LABEL[event.status] ?? event.status}
              {isLast && (
                <span className="ml-2 text-xs font-medium text-ink-muted">
                  état actuel
                </span>
              )}
            </p>
            <p className="text-xs text-ink-muted">
              {fmtDateTime.format(new Date(event.createdAt))}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
