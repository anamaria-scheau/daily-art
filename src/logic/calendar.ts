const pad = (value: number) => String(value).padStart(2, '0');

export function buildMonthGrid(
  year: number,
  monthIndex: number
): (string | null)[] {
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  // getUTCDay(): Sunday = 0. We want Monday = 0.
  const firstWeekday =
    (new Date(Date.UTC(year, monthIndex, 1)).getUTCDay() + 6) % 7;

  const cells: (string | null)[] = Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(`${year}-${pad(monthIndex + 1)}-${pad(day)}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function shiftMonth(
  year: number,
  monthIndex: number,
  delta: number
): { year: number; monthIndex: number } {
  const total = year * 12 + monthIndex + delta;
  return { year: Math.floor(total / 12), monthIndex: total % 12 };
}