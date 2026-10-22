import { indexFromOffset } from './timeline';

describe('indexFromOffset', () => {
  it('returns 0 at the start', () => {
    expect(indexFromOffset(0, 140, 6)).toBe(0);
  });

  it('rounds to the nearest item', () => {
    expect(indexFromOffset(200, 140, 6)).toBe(1);
    expect(indexFromOffset(220, 140, 6)).toBe(2);
  });

  it('never goes below 0 or above the last index', () => {
    expect(indexFromOffset(-50, 140, 6)).toBe(0);
    expect(indexFromOffset(5000, 140, 6)).toBe(5);
  });
});