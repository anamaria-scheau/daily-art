import { getDiscoveredArtworkIds } from './collection';
import { ViewEntry } from '../types/progress';

const entry = (
  date: string,
  movementId: string,
  artworkId: string
): ViewEntry => ({ date, movementId, artworkId });

describe('getDiscoveredArtworkIds', () => {
  it('returns an empty list when nothing was discovered', () => {
    expect(getDiscoveredArtworkIds([], 'impressionism')).toEqual([]);
  });

  it('keeps only the artworks of the requested movement', () => {
    const history = [
      entry('2026-10-01', 'renaissance', 'mona-lisa'),
      entry('2026-10-02', 'impressionism', 'impression-sunrise'),
    ];
    expect(getDiscoveredArtworkIds(history, 'impressionism')).toEqual([
      'impression-sunrise',
    ]);
  });

  it('orders artworks by the day they were discovered', () => {
    const history = [
      entry('2026-10-20', 'impressionism', 'second'),
      entry('2026-10-02', 'impressionism', 'first'),
    ];
    expect(getDiscoveredArtworkIds(history, 'impressionism')).toEqual([
      'first',
      'second',
    ]);
  });

  it('lists an artwork only once even if it was seen twice', () => {
    const history = [
      entry('2026-10-02', 'impressionism', 'first'),
      entry('2026-11-05', 'impressionism', 'first'),
    ];
    expect(getDiscoveredArtworkIds(history, 'impressionism')).toEqual([
      'first',
    ]);
  });

  it('does not modify the history it receives', () => {
    const history = [
      entry('2026-10-20', 'impressionism', 'second'),
      entry('2026-10-02', 'impressionism', 'first'),
    ];
    getDiscoveredArtworkIds(history, 'impressionism');
    expect(history[0].artworkId).toBe('second');
  });
});