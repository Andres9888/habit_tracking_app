import {
  FREE_HABIT_LIMIT,
  countHabitsTowardFreeLimit,
  hasReachedFreeHabitLimit,
  shouldGuardFreeHabitAction,
} from './habitLimit';

describe('habitLimit', () => {
  it('matches the server free-tier cap', () => {
    expect(FREE_HABIT_LIMIT).toBe(3);
  });

  it('counts only non-paused habits toward the free limit', () => {
    expect(
      countHabitsTowardFreeLimit([
        { paused: false },
        { paused: true },
        { paused: null },
        {},
      ])
    ).toBe(3);
  });

  it('does not treat premium users as at the free limit', () => {
    const habits = [{}, {}, {}];
    expect(hasReachedFreeHabitLimit(habits, true)).toBe(false);
    expect(hasReachedFreeHabitLimit(habits, false)).toBe(true);
    expect(hasReachedFreeHabitLimit([{}, {}], false)).toBe(false);
  });

  it('guards free actions at or above the cap', () => {
    expect(shouldGuardFreeHabitAction(true, 10)).toBe(false);
    expect(shouldGuardFreeHabitAction(false, 2)).toBe(false);
    expect(shouldGuardFreeHabitAction(false, 3)).toBe(true);
  });
});
