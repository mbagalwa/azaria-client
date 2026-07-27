/** Dates calendaires en ISO "YYYY-MM-DD", sûres vis-à-vis du fuseau (UTC). */

function parseISO(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: string, n: number): string {
  const d = parseISO(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return toISO(d);
}

export function todayISO(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

const fmtLong = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const fmtShort = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const fmtWeekday = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  timeZone: "UTC",
});

/** "vendredi 25 juillet" */
export function formatLongFR(iso: string): string {
  return fmtLong.format(parseISO(iso));
}

/** "25 juil." */
export function formatShortFR(iso: string): string {
  return fmtShort.format(parseISO(iso));
}

/** "ven." */
export function weekdayShortFR(iso: string): string {
  return fmtWeekday.format(parseISO(iso));
}
