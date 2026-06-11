// Teaching-day math. Weekdays use JS getUTCDay(): 0 = Sunday ... 6 = Saturday.
// All dates are ISO 'YYYY-MM-DD' (UTC) to avoid timezone drift.

export function nthTeachingDayISO(
  termStartDate: string,
  weekdays: number[],
  n: number,
): string {
  const start = new Date(`${termStartDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime())) {
    throw new Error(`Invalid termStartDate: ${termStartDate}`);
  }
  const set = new Set(weekdays);
  let count = 0;
  const d = new Date(start);
  for (let i = 0; i < 730; i++) {
    if (set.has(d.getUTCDay())) {
      count++;
      if (count === n) return d.toISOString().slice(0, 10);
    }
    d.setUTCDate(d.getUTCDate() + 1);
  }
  throw new Error("teaching day not found within range");
}

export function addDaysISO(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function compareISO(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
