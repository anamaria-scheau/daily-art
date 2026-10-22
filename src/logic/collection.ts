import { ViewEntry } from '../types/progress';

export function getDiscoveredArtworkIds(
  viewHistory: ViewEntry[],
  movementId: string
): string[] {
  const ids = [...viewHistory]
    .filter((entry) => entry.movementId === movementId)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((entry) => entry.artworkId);
  return [...new Set(ids)];
}