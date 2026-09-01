/**
 * The detail screen used to build completedDates from server tracking only, so
 * every calendar cell waited on the Convex round-trip before it filled. These
 * tests pin the optimistic merge: a pending toggle in the shared store must
 * show up in completedDates immediately, before any tracking update arrives.
 */

import { renderHook, act } from '@testing-library/react-native';

import { optimisticStore } from '../../../lib/optimistic';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { HabitTrackingEntry } from '../../../features/habits/types';
import { useHabitDetailScreenState } from '../useHabitDetailScreenState';

const HABIT_ID = 'habit-1' as Id<'habits'>;
const OTHER_HABIT_ID = 'habit-2' as Id<'habits'>;
const DATE = '2026-08-20';

function trackingEntry(
  habitId: Id<'habits'>,
  date: string,
  completed: boolean
): HabitTrackingEntry {
  return { completed, date, habitId } as unknown as HabitTrackingEntry;
}

function renderState(tracking: HabitTrackingEntry[]) {
  return renderHook(
    (props: { tracking: HabitTrackingEntry[] }) =>
      useHabitDetailScreenState({
        bestStreak: 0,
        currentStreak: 0,
        habitId: HABIT_ID,
        tracking: props.tracking,
      }),
    { initialProps: { tracking } }
  );
}

describe('useHabitDetailScreenState optimistic completedDates', () => {
  beforeEach(() => {
    optimisticStore.reset();
  });

  afterEach(() => {
    optimisticStore.reset();
  });

  it('marks a date complete from a pending toggle before tracking updates', () => {
    const { result } = renderState([]);

    expect(result.current.completedDates.has(DATE)).toBe(false);

    act(() => {
      optimisticStore.addToggle({
        date: DATE,
        habitId: HABIT_ID,
        toCompleted: true,
      });
    });

    expect(result.current.completedDates.has(DATE)).toBe(true);
  });

  it('removes a server-completed date from a pending un-toggle', () => {
    const { result } = renderState([trackingEntry(HABIT_ID, DATE, true)]);

    expect(result.current.completedDates.has(DATE)).toBe(true);

    act(() => {
      optimisticStore.addToggle({
        date: DATE,
        habitId: HABIT_ID,
        toCompleted: false,
      });
    });

    expect(result.current.completedDates.has(DATE)).toBe(false);
  });

  it('ignores pending toggles belonging to a different habit', () => {
    const { result } = renderState([]);
    const before = result.current.completedDates;

    act(() => {
      optimisticStore.addToggle({
        date: DATE,
        habitId: OTHER_HABIT_ID,
        toCompleted: true,
      });
    });

    expect(result.current.completedDates.has(DATE)).toBe(false);
    // Identity must hold, or every memo boundary below re-renders on an
    // unrelated habit's toggle.
    expect(result.current.completedDates).toBe(before);
  });
});

/**
 * `habit.currentStreak` is a stored field; nothing recomputes it when a day is
 * missed. The success toast used to read it (+1) and announce a run that had
 * already ended — "Logged — 9-day streak." right after a recovery log.
 */
describe('useHabitDetailScreenState loggedStreak', () => {
  beforeEach(() => {
    optimisticStore.reset();
  });

  function renderWithLog(tracking: HabitTrackingEntry[]) {
    return renderHook(() =>
      useHabitDetailScreenState({
        bestStreak: 9,
        currentStreak: 9,
        habitId: HABIT_ID,
        tracking,
      })
    );
  }

  function daysAgo(offset: number): string {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    return getLocalDateString(date);
  }

  it('reports one day after a recovery log, not the stale stored streak', () => {
    const { result } = renderWithLog([
      trackingEntry(HABIT_ID, daysAgo(5), true),
      trackingEntry(HABIT_ID, getLocalDateString(), true),
    ]);

    expect(result.current.currentStreak).toBe(9);
    expect(result.current.loggedStreak).toBe(1);
  });

  it('counts the live run the log actually contains', () => {
    const { result } = renderWithLog([
      trackingEntry(HABIT_ID, daysAgo(2), true),
      trackingEntry(HABIT_ID, daysAgo(1), true),
      trackingEntry(HABIT_ID, getLocalDateString(), true),
    ]);

    expect(result.current.loggedStreak).toBe(3);
  });

  it('counts an optimistic log before the server confirms it', () => {
    const today = getLocalDateString();
    const { result } = renderWithLog([
      trackingEntry(HABIT_ID, daysAgo(1), true),
    ]);

    expect(result.current.loggedStreak).toBe(1);

    act(() => {
      optimisticStore.addToggle({
        date: today,
        habitId: HABIT_ID,
        toCompleted: true,
      });
    });

    expect(result.current.loggedStreak).toBe(2);
  });
});
