import { Artwork, Movement } from '../types/movement';

export type FavoriteGroup = { movement: Movement; artworks: Artwork[] };

export function toggleFavorite(ids: string[], artworkId: string): string[] {
  return ids.includes(artworkId)
    ? ids.filter((id) => id !== artworkId)
    : [...ids, artworkId];
}

export function parseFavorites(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const strings = value.filter(
      (item): item is string => typeof item === 'string'
    );
    return [...new Set(strings)];
  } catch {
    return [];
  }
}

export function groupFavoritesByMovement(
  ids: string[],
  movements: Movement[]
): FavoriteGroup[] {
  return [...movements]
    .sort((a, b) => a.order - b.order)
    .map((movement) => ({
      movement,
      artworks: ids
        .map((id) => movement.artworks.find((artwork) => artwork.id === id))
        .filter((artwork): artwork is Artwork => Boolean(artwork)),
    }))
    .filter((group) => group.artworks.length > 0);
}