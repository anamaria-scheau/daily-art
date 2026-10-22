import { Artwork, Movement } from '../types/movement';
import { ProgressState } from '../types/progress';

export function nextProgressIndex(current: number, total: number): number {
  return (current + 1) % total;
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function hasViewedOn(state: ProgressState, dateKey: string): boolean {
  return state.viewHistory.some((entry) => entry.date === dateKey);
}

export type Pick = {
  movement: Movement;
  artwork: Artwork;
};

export function getPendingPick(
  movements: Movement[],
  state: ProgressState
): Pick {
  const movement = movements[state.currentProgressIndex];
  const seen = state.viewHistory.filter(
    (entry) => entry.movementId === movement.id
  ).length;
  const artwork = movement.artworks[seen % movement.artworks.length];
  return { movement, artwork };
}

export function recordView(
  movements: Movement[],
  state: ProgressState,
  dateKey: string
): ProgressState {
  if (hasViewedOn(state, dateKey)) return state;

  const { movement, artwork } = getPendingPick(movements, state);
  return {
    viewHistory: [
      ...state.viewHistory,
      { date: dateKey, movementId: movement.id, artworkId: artwork.id },
    ],
    currentProgressIndex: nextProgressIndex(
      state.currentProgressIndex,
      movements.length
    ),
  };
}

















// implementarea verdee




// export function nextProgressIndex(current: number, total: number): number {
//   return (current + 1) % total;
// }