export function shiftDateKey(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

export function calculateStreak(dates: string[], todayKey: string): number {
  const discovered = new Set(dates);
  let cursor = discovered.has(todayKey) ? todayKey : shiftDateKey(todayKey, -1);
  let streak = 0;

  while (discovered.has(cursor)) {
    streak += 1;
    cursor = shiftDateKey(cursor, -1);
  }
  return streak;
}