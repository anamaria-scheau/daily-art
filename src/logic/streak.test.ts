import { calculateStreak, shiftDateKey } from './streak';

describe('shiftDateKey', () => {
  it('moves a day back', () => {
    expect(shiftDateKey('2026-10-05', -1)).toBe('2026-10-04');
  });

  it('crosses month boundaries', () => {
    expect(shiftDateKey('2026-10-01', -1)).toBe('2026-09-30');
  });

  it('crosses year boundaries', () => {
    expect(shiftDateKey('2026-12-31', 1)).toBe('2027-01-01');
  });
});

describe('calculateStreak', () => {
  it('is 0 when nothing was discovered', () => {
    expect(calculateStreak([], '2026-10-05')).toBe(0);
  });

  it('is 1 when only today was discovered', () => {
    expect(calculateStreak(['2026-10-05'], '2026-10-05')).toBe(1);
  });

  it('counts consecutive days ending today', () => {
    const dates = ['2026-10-03', '2026-10-04', '2026-10-05'];
    expect(calculateStreak(dates, '2026-10-05')).toBe(3);
  });

  it('stays alive if today is not discovered yet', () => {
    const dates = ['2026-10-03', '2026-10-04'];
    expect(calculateStreak(dates, '2026-10-05')).toBe(2);
  });

  it('breaks after a missed day', () => {
    const dates = ['2026-10-01', '2026-10-02', '2026-10-04'];
    expect(calculateStreak(dates, '2026-10-04')).toBe(1);
  });

  it('is 0 when the last discovery was before yesterday', () => {
    expect(calculateStreak(['2026-10-01'], '2026-10-05')).toBe(0);
  });

  it('ignores duplicates and the order of the dates', () => {
    const dates = ['2026-10-05', '2026-10-04', '2026-10-05'];
    expect(calculateStreak(dates, '2026-10-05')).toBe(2);
  });
});