import { Artwork, Movement } from '../types/movement';
import movementsData from './movements.json';

export const movements = movementsData as Movement[];

export function findArtwork(
  artworkId: string
): { movement: Movement; artwork: Artwork } | undefined {
  for (const movement of movements) {
    const artwork = movement.artworks.find((a) => a.id === artworkId);
    if (artwork) return { movement, artwork };
  }
  return undefined;
}