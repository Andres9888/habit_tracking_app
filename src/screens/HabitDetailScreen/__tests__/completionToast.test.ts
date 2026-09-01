import {
  deriveCompletionToastStreak,
  getNextCompletionToast,
} from '../completionToast';

const TODAY = '2026-08-29';

function next(
  overrides: Partial<Parameters<typeof getNextCompletionToast>[0]> = {}
) {
  return getNextCompletionToast({
    currentStreak: 0,
    date: null,
    didHabitChange: false,
    isCompletedToday: false,
    previousCompletedToday: null,
    streak: 1,
    today: TODAY,
    visible: false,
    ...overrides,
  });
}

describe('completionToast', () => {
  it('reuses the overlaid streak after a log', () => {
    expect(deriveCompletionToastStreak(4)).toBe(4);
  });

  it('clamps the streak floor to one day', () => {
    expect(deriveCompletionToastStreak(0)).toBe(1);
  });

  it('does not fire on mount when today is already logged', () => {
    expect(next({ currentStreak: 6, isCompletedToday: true })).toEqual({
      date: null,
      streak: 1,
      visible: false,
    });
  });

  it('fires only on not-logged to logged transitions', () => {
    expect(
      next({
        currentStreak: 3,
        isCompletedToday: true,
        previousCompletedToday: false,
      })
    ).toEqual({ date: TODAY, streak: 3, visible: true });
    expect(
      next({
        currentStreak: 2,
        previousCompletedToday: true,
        streak: 3,
        visible: true,
      })
    ).toEqual({ date: null, streak: 3, visible: false });
  });

  it('captures the fired date so Undo cannot drift to another day', () => {
    const fired = next({
      currentStreak: 3,
      isCompletedToday: true,
      previousCompletedToday: false,
    });

    expect(fired.date).toBe(TODAY);
    expect(
      next({
        ...fired,
        currentStreak: 9,
        isCompletedToday: true,
        previousCompletedToday: true,
        today: '2026-08-30',
      })
    ).toEqual({ date: TODAY, streak: 3, visible: true });
  });

  it('freezes the streak while the toast is up', () => {
    const fired = next({
      currentStreak: 1,
      isCompletedToday: true,
      previousCompletedToday: false,
    });

    // The server value lands mid-display and disagrees with the optimistic one.
    expect(
      next({
        ...fired,
        currentStreak: 9,
        isCompletedToday: true,
        previousCompletedToday: true,
      })
    ).toEqual({ date: TODAY, streak: 1, visible: true });
  });

  it('does not fire when the habit changes to one already logged today', () => {
    expect(
      next({
        currentStreak: 5,
        didHabitChange: true,
        isCompletedToday: true,
        previousCompletedToday: false,
        streak: 2,
        visible: true,
      })
    ).toEqual({ date: null, streak: 2, visible: false });
  });
});
