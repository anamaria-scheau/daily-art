export function shiftDateKey(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

export type StreakInfo = {
  streak: number;
  frozenDays: string[];
};

export function analyzeStreak(dates: string[], todayKey: string): StreakInfo {
  const discovered = new Set(dates);
  const frozenMonths = new Set<string>();
  const frozenDays: string[] = [];

  let cursor = discovered.has(todayKey) ? todayKey : shiftDateKey(todayKey, -1);
  let streak = 0;

  while (true) {
    if (discovered.has(cursor)) {
      streak += 1;
    } else {
      const month = cursor.slice(0, 7);
      const previous = shiftDateKey(cursor, -1);
      const canFreeze = !frozenMonths.has(month) && discovered.has(previous);
      if (!canFreeze) break;
      frozenMonths.add(month);
      frozenDays.push(cursor);
    }
    cursor = shiftDateKey(cursor, -1);
  }

  return { streak, frozenDays };
}

export function calculateStreak(dates: string[], todayKey: string): number {
  return analyzeStreak(dates, todayKey).streak;
}