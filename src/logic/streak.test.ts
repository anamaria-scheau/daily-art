import { analyzeStreak, calculateStreak, shiftDateKey } from './streak';

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

  it('is 0 when the last discovery was before yesterday', () => {
    expect(calculateStreak(['2026-10-01'], '2026-10-05')).toBe(0);
  });

  it('ignores duplicates and the order of the dates', () => {
    const dates = ['2026-10-05', '2026-10-04', '2026-10-05'];
    expect(calculateStreak(dates, '2026-10-05')).toBe(2);
  });

  it('forgives a single missed day (the missed day is not counted)', () => {
    const dates = ['2026-10-01', '2026-10-02', '2026-10-04'];
    expect(calculateStreak(dates, '2026-10-04')).toBe(3);
  });

  it('breaks after two missed days in a row', () => {
    const dates = ['2026-10-01', '2026-10-02', '2026-10-05'];
    expect(calculateStreak(dates, '2026-10-05')).toBe(1);
  });

  it('forgives only one missed day per month', () => {
    const dates = ['2026-10-01', '2026-10-03', '2026-10-05'];
    expect(calculateStreak(dates, '2026-10-05')).toBe(2);
  });

  it('gives a fresh freeze in a new month', () => {
    const dates = ['2026-09-27', '2026-09-29', '2026-10-01', '2026-10-03'];
    expect(calculateStreak(dates, '2026-10-03')).toBe(3);
  });

  it('keeps the streak alive when yesterday was missed and frozen', () => {
    const dates = ['2026-10-01', '2026-10-02', '2026-10-03'];
    expect(calculateStreak(dates, '2026-10-05')).toBe(3);
  });
});

describe('analyzeStreak', () => {
  it('lists the frozen days', () => {
    const dates = ['2026-10-01', '2026-10-02', '2026-10-04'];
    expect(analyzeStreak(dates, '2026-10-04').frozenDays).toEqual(['2026-10-03']);
  });

  it('has no frozen days when nothing was missed', () => {
    const dates = ['2026-10-03', '2026-10-04'];
    expect(analyzeStreak(dates, '2026-10-04').frozenDays).toEqual([]);
  });
});