import { EMPTY_PROGRESS, parseProgressState } from './progressParsing';

describe('parseProgressState', () => {
  it('returns the empty state when nothing was saved', () => {
    expect(parseProgressState(null)).toEqual(EMPTY_PROGRESS);
  });

  it('returns the empty state for broken JSON', () => {
    expect(parseProgressState('{not json')).toEqual(EMPTY_PROGRESS);
  });

  it('returns the empty state when the shape is wrong', () => {
    expect(parseProgressState('{"foo": 1}')).toEqual(EMPTY_PROGRESS);
  });

  it('returns the empty state for a negative progress index', () => {
    const raw = JSON.stringify({ viewHistory: [], currentProgressIndex: -1 });
    expect(parseProgressState(raw)).toEqual(EMPTY_PROGRESS);
  });

  it('returns the empty state when a history entry is incomplete', () => {
    const raw = JSON.stringify({
      viewHistory: [{ date: '2026-10-05' }],
      currentProgressIndex: 1,
    });
    expect(parseProgressState(raw)).toEqual(EMPTY_PROGRESS);
  });

  it('returns a valid saved state unchanged', () => {
    const saved = {
      viewHistory: [{ date: '2026-10-05', movementId: 'a', artworkId: 'a1' }],
      currentProgressIndex: 1,
    };
    expect(parseProgressState(JSON.stringify(saved))).toEqual(saved);
  });
});