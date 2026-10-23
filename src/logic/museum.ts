import { ViewEntry } from '../types/progress';

export type MuseumRoom = {
  monthKey: string;
  artworkIds: string[];
  complete: boolean;
};

export type Walls<T> = { left: T[]; back: T[]; right: T[] };

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function buildMuseumRooms(
  viewHistory: ViewEntry[],
  todayKey: string
): MuseumRoom[] {
  const currentMonth = todayKey.slice(0, 7);
  const byMonth = new Map<string, ViewEntry[]>();

  for (const entry of viewHistory) {
    const monthKey = entry.date.slice(0, 7);
    byMonth.set(monthKey, [...(byMonth.get(monthKey) ?? []), entry]);
  }

  return [...byMonth.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([monthKey, entries]) => {
      const ids = [...entries]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((entry) => entry.artworkId);
      return {
        monthKey,
        artworkIds: [...new Set(ids)],
        complete: monthKey < currentMonth,
      };
    });
}

// Reading order is left wall, back wall, right wall. The back wall is the
// one you look at first, so it gets the extra item when the split is uneven.
export function splitIntoWalls<T>(items: T[]): Walls<T> {
  const backCount = Math.ceil(items.length / 3);
  const remaining = items.length - backCount;
  const leftCount = Math.ceil(remaining / 2);

  return {
    left: items.slice(0, leftCount),
    back: items.slice(leftCount, leftCount + backCount),
    right: items.slice(leftCount + backCount),
  };
}

export function wallColumns(count: number): number {
  return Math.max(1, Math.ceil(Math.sqrt(count)));
}

export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
}