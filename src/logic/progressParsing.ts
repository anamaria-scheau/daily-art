import { ProgressState } from '../types/progress';

export const EMPTY_PROGRESS: ProgressState = {
  viewHistory: [],
  currentProgressIndex: 0,
};

function isViewEntry(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.date === 'string' &&
    typeof entry.movementId === 'string' &&
    typeof entry.artworkId === 'string'
  );
}

function isProgressState(value: unknown): value is ProgressState {
  if (typeof value !== 'object' || value === null) return false;
  const state = value as Record<string, unknown>;
  return (
    Array.isArray(state.viewHistory) &&
    state.viewHistory.every(isViewEntry) &&
    typeof state.currentProgressIndex === 'number' &&
    Number.isInteger(state.currentProgressIndex) &&
    state.currentProgressIndex >= 0
  );
}

export function parseProgressState(raw: string | null): ProgressState {
  if (raw === null) return EMPTY_PROGRESS;
  try {
    const data: unknown = JSON.parse(raw);
    return isProgressState(data) ? data : EMPTY_PROGRESS;
  } catch {
    return EMPTY_PROGRESS;
  }
}