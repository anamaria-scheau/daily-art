import { buildMonthGrid, shiftMonth } from './calendar';

describe('buildMonthGrid', () => {
  const october = buildMonthGrid(2026, 9);

  it('fills whole weeks', () => {
    expect(october.length % 7).toBe(0);
    expect(october.length).toBe(35);
  });

  it('puts the first day under the right weekday (Monday first)', () => {
    expect(october.slice(0, 3)).toEqual([null, null, null]);
    expect(october[3]).toBe('2026-10-01');
  });

  it('ends with the last day and empty cells', () => {
    expect(october[33]).toBe('2026-10-31');
    expect(october[34]).toBeNull();
  });

  it('has one cell for every day of a normal February', () => {
    const days = buildMonthGrid(2026, 1).filter((cell) => cell !== null);
    expect(days.length).toBe(28);
  });

  it('has 29 days in a leap-year February', () => {
    const days = buildMonthGrid(2028, 1).filter((cell) => cell !== null);
    expect(days.length).toBe(29);
  });
});

describe('shiftMonth', () => {
  it('moves forward within a year', () => {
    expect(shiftMonth(2026, 9, 1)).toEqual({ year: 2026, monthIndex: 10 });
  });

  it('rolls over to the next year', () => {
    expect(shiftMonth(2026, 11, 1)).toEqual({ year: 2027, monthIndex: 0 });
  });

  it('rolls back to the previous year', () => {
    expect(shiftMonth(2026, 0, -1)).toEqual({ year: 2025, monthIndex: 11 });
  });
});