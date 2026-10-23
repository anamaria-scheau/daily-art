import {
  buildMuseumRooms,
  formatMonthLabel,
  splitIntoWalls,
  wallColumns,
} from './museum';
import { ViewEntry } from '../types/progress';

const entry = (date: string, artworkId: string): ViewEntry => ({
  date,
  movementId: 'm',
  artworkId,
});

describe('buildMuseumRooms', () => {
  it('returns no rooms for an empty history', () => {
    expect(buildMuseumRooms([], '2026-10-23')).toEqual([]);
  });

  it('makes one room per month, newest first', () => {
    const history = [
      entry('2026-08-03', 'a'),
      entry('2026-10-02', 'c'),
      entry('2026-09-15', 'b'),
    ];
    const rooms = buildMuseumRooms(history, '2026-10-23');
    expect(rooms.map((room) => room.monthKey)).toEqual([
      '2026-10',
      '2026-09',
      '2026-08',
    ]);
  });

  it('orders the artworks of a month by the day they were discovered', () => {
    const history = [
      entry('2026-09-20', 'later'),
      entry('2026-09-02', 'earlier'),
    ];
    const [room] = buildMuseumRooms(history, '2026-10-23');
    expect(room.artworkIds).toEqual(['earlier', 'later']);
  });

  it('lists an artwork once even if it was seen twice in a month', () => {
    const history = [entry('2026-09-02', 'a'), entry('2026-09-09', 'a')];
    const [room] = buildMuseumRooms(history, '2026-10-23');
    expect(room.artworkIds).toEqual(['a']);
  });

  it('marks past months as complete and the current month as not', () => {
    const history = [entry('2026-09-02', 'a'), entry('2026-10-02', 'b')];
    const [current, past] = buildMuseumRooms(history, '2026-10-23');
    expect(current.complete).toBe(false);
    expect(past.complete).toBe(true);
  });

  it('treats a month from a previous year as complete', () => {
    const [room] = buildMuseumRooms([entry('2025-12-31', 'a')], '2026-01-01');
    expect(room.complete).toBe(true);
  });

  it('does not modify the history it receives', () => {
    const history = [entry('2026-09-20', 'b'), entry('2026-09-02', 'a')];
    buildMuseumRooms(history, '2026-10-23');
    expect(history[0].artworkId).toBe('b');
  });
});

describe('splitIntoWalls', () => {
  it('returns empty walls for no items', () => {
    expect(splitIntoWalls([])).toEqual({ left: [], back: [], right: [] });
  });

  it('puts a single item on the back wall', () => {
    expect(splitIntoWalls(['a'])).toEqual({ left: [], back: ['a'], right: [] });
  });

  it('puts two items on the left and back walls', () => {
    expect(splitIntoWalls(['a', 'b'])).toEqual({
      left: ['a'],
      back: ['b'],
      right: [],
    });
  });

  it('gives each wall one item when there are three', () => {
    expect(splitIntoWalls(['a', 'b', 'c'])).toEqual({
      left: ['a'],
      back: ['b'],
      right: ['c'],
    });
  });

  it('gives the back wall the extra item when it does not divide evenly', () => {
    const walls = splitIntoWalls(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
    expect(walls.left).toHaveLength(2);
    expect(walls.back).toHaveLength(3);
    expect(walls.right).toHaveLength(2);
  });

  it('keeps the original order and loses nothing', () => {
    const items = Array.from({ length: 11 }, (_, index) => index);
    const { left, back, right } = splitIntoWalls(items);
    expect([...left, ...back, ...right]).toEqual(items);
  });

  it('does not modify the list it receives', () => {
    const items = ['a', 'b', 'c'];
    splitIntoWalls(items);
    expect(items).toEqual(['a', 'b', 'c']);
  });
});

describe('wallColumns', () => {
  it.each([
    [0, 1],
    [1, 1],
    [2, 2],
    [4, 2],
    [5, 3],
    [9, 3],
    [10, 4],
  ])('uses the right number of columns for %i artworks', (count, columns) => {
    expect(wallColumns(count)).toBe(columns);
  });
});

describe('formatMonthLabel', () => {
  it('turns a month key into a readable label', () => {
    expect(formatMonthLabel('2026-10')).toBe('October 2026');
    expect(formatMonthLabel('2027-01')).toBe('January 2027');
  });
});