import { nextProgressIndex } from './progress';

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