import {
  getPendingPick,
  hasViewedOn,
  nextProgressIndex,
  recordView,
  toDateKey,
} from './progress';
import { Artwork, Movement } from '../types/movement';
import { ProgressState } from '../types/progress';

const artwork = (id: string): Artwork => ({
  id,
  title: id,
  artist: '',
  year: '',
  imageKey: id,
  imageCredit: '',
  description: '',
  story: [],
  lookCloser: [],
  context: [],
  artistBio: '',
  artistAtTheTime: '',
  details: { medium: '', dimensions: '', location: '' },
});

const movement = (id: string, order: number, artworkIds: string[]): Movement => ({
  id,
  order,
  name: id,
  yearRange: '',
  description: '',
  artworks: artworkIds.map(artwork),
});

const movements: Movement[] = [
  movement('a', 1, ['a1', 'a2']),
  movement('b', 2, ['b1']),
];

const empty: ProgressState = { viewHistory: [], currentProgressIndex: 0 };

describe('nextProgressIndex', () => {
  it('moves from 0 to 1', () => {
    expect(nextProgressIndex(0, 26)).toBe(1);
  });

  it('moves from 24 to 25', () => {
    expect(nextProgressIndex(24, 26)).toBe(25);
  });

  it('wraps from the last index back to 0', () => {
    expect(nextProgressIndex(25, 26)).toBe(0);
  });
});

describe('toDateKey', () => {
  it('formats a date as YYYY-MM-DD using the local calendar day', () => {
    expect(toDateKey(new Date(2026, 9, 5))).toBe('2026-10-05');
  });
});

describe('hasViewedOn', () => {
  const state: ProgressState = {
    viewHistory: [{ date: '2026-10-05', movementId: 'a', artworkId: 'a1' }],
    currentProgressIndex: 1,
  };

  it('is true for a day that is in the history', () => {
    expect(hasViewedOn(state, '2026-10-05')).toBe(true);
  });

  it('is false for any other day', () => {
    expect(hasViewedOn(state, '2026-10-06')).toBe(false);
  });
});

describe('getPendingPick', () => {
  it('picks the movement at currentProgressIndex and its first artwork', () => {
    const pick = getPendingPick(movements, {
      viewHistory: [],
      currentProgressIndex: 1,
    });
    expect(pick.movement.id).toBe('b');
    expect(pick.artwork.id).toBe('b1');
  });

  it('picks the next unseen artwork of a movement', () => {
    const pick = getPendingPick(movements, {
      viewHistory: [{ date: '2026-10-01', movementId: 'a', artworkId: 'a1' }],
      currentProgressIndex: 0,
    });
    expect(pick.artwork.id).toBe('a2');
  });

  it('starts over with the first artwork once all were seen', () => {
    const pick = getPendingPick(movements, {
      viewHistory: [
        { date: '2026-10-01', movementId: 'a', artworkId: 'a1' },
        { date: '2026-10-02', movementId: 'a', artworkId: 'a2' },
      ],
      currentProgressIndex: 0,
    });
    expect(pick.artwork.id).toBe('a1');
  });
});

describe('recordView', () => {
  it('adds the pending artwork to the history and advances', () => {
    const next = recordView(movements, empty, '2026-10-05');
    expect(next.viewHistory).toEqual([
      { date: '2026-10-05', movementId: 'a', artworkId: 'a1' },
    ]);
    expect(next.currentProgressIndex).toBe(1);
  });

  it('wraps the progress index after the last movement', () => {
    const next = recordView(
      movements,
      { viewHistory: [], currentProgressIndex: 1 },
      '2026-10-05'
    );
    expect(next.currentProgressIndex).toBe(0);
  });

  it('does nothing if today was already discovered', () => {
    const once = recordView(movements, empty, '2026-10-05');
    const twice = recordView(movements, once, '2026-10-05');
    expect(twice).toBe(once);
  });

  it('does not skip an artwork after missed days', () => {
    const state: ProgressState = {
      viewHistory: [{ date: '2026-10-01', movementId: 'a', artworkId: 'a1' }],
      currentProgressIndex: 1,
    };
    const next = recordView(movements, state, '2026-10-09');
    expect(next.viewHistory[1]).toEqual({
      date: '2026-10-09',
      movementId: 'b',
      artworkId: 'b1',
    });
  });

  it('does not modify the original state', () => {
    recordView(movements, empty, '2026-10-05');
    expect(empty.viewHistory).toEqual([]);
    expect(empty.currentProgressIndex).toBe(0);
  });
});












// implementarea rosie

// import { nextProgressIndex } from './progress';

// describe('nextProgressIndex', () => {
//   it('moves from 0 to 1', () => {
//     expect(nextProgressIndex(0, 26)).toBe(1);
//   });

//   it('moves from 24 to 25', () => {
//     expect(nextProgressIndex(24, 26)).toBe(25);
//   });

//   it('wraps from the last index back to 0', () => {
//     expect(nextProgressIndex(25, 26)).toBe(0);
//   });
// });