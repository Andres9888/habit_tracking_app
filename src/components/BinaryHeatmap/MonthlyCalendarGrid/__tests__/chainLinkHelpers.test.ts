import { isLinkable, shouldJoinRight } from '../chainLinkHelpers';
import type { DayData } from '../types';

function makeDay(overrides: Partial<DayData> = {}): DayData {
  return {
    date: new Date('2026-07-15'),
    dateString: '2026-07-15',
    dayNumber: 15,
    isCurrentMonth: true,
    isToday: false,
    isFuture: false,
    isBeforeCreation: false,
    isCompleted: false,
    isMissed: false,
    ...overrides,
  };
}

describe('isLinkable', () => {
  it('is true for a completed, current-month, non-future day', () => {
    expect(isLinkable(makeDay({ isCompleted: true }))).toBe(true);
  });

  it('is false when not completed', () => {
    expect(isLinkable(makeDay({ isCompleted: false }))).toBe(false);
  });

  it('is false when outside the current month', () => {
    expect(
      isLinkable(makeDay({ isCompleted: true, isCurrentMonth: false }))
    ).toBe(false);
  });

  it('is false when in the future', () => {
    expect(isLinkable(makeDay({ isCompleted: true, isFuture: true }))).toBe(
      false
    );
  });

  it('is false for undefined', () => {
    expect(isLinkable(undefined)).toBe(false);
  });
});

describe('shouldJoinRight', () => {
  it('joins two adjacent completed days mid-row', () => {
    const week = [
      makeDay({ isCompleted: true }),
      makeDay({ isCompleted: true }),
      makeDay({ isCompleted: false }),
    ];
    expect(shouldJoinRight(week, 0)).toBe(true);
  });

  it('does not join when the right neighbor is not completed', () => {
    const week = [
      makeDay({ isCompleted: true }),
      makeDay({ isCompleted: false }),
    ];
    expect(shouldJoinRight(week, 0)).toBe(false);
  });

  it('does not join when the current cell is not completed', () => {
    const week = [
      makeDay({ isCompleted: false }),
      makeDay({ isCompleted: true }),
    ];
    expect(shouldJoinRight(week, 0)).toBe(false);
  });

  it('CRITICAL: never joins across the week-wrap boundary (last column)', () => {
    // index 6 is the last column of a 7-day week — even though both this
    // cell and the (nonexistent, next-row) neighbor "look" completed, the
    // index bound must block the join.
    const week = Array.from({ length: 7 }, () =>
      makeDay({ isCompleted: true })
    );
    expect(shouldJoinRight(week, 6)).toBe(false);
  });

  it('joins the second-to-last column when both it and the last column are completed', () => {
    const week = Array.from({ length: 7 }, () =>
      makeDay({ isCompleted: true })
    );
    expect(shouldJoinRight(week, 5)).toBe(true);
  });
});
