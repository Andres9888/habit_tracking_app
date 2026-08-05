import type { Habit, HabitStatus } from '../../types';
import { getHabitRenderData } from '../useHabitRenderItem.helpers';
import type { UseHabitRenderItemArgs } from '../useHabitRenderItem.types';

/**
 * The weekStatus cache must return a content-stable array reference even when
 * getHabitStatus is recreated (it is on every toggle, because it derives from
 * the optimistic store). A stable reference is what lets the memo() boundary
 * on HabitRenderContent hold, so a toggle re-renders only the tapped card.
 */

const WEEK_DATE_STRINGS = [
  '2025-12-01',
  '2025-12-02',
  '2025-12-03',
  '2025-12-04',
  '2025-12-05',
  '2025-12-06',
  '2025-12-07',
];

function makeHabit(id: string): Habit {
  return { _id: id, name: `Habit ${id}` } as unknown as Habit;
}

function makeArgs(
  statusByDate: Record<string, HabitStatus>,
  weekDateStrings = WEEK_DATE_STRINGS
): UseHabitRenderItemArgs {
  return {
    celebrationsEnabled: false,
    completionIcon: 'chain',
    // Fresh function identity on every call, like a real toggle render
    getHabitStatus: (_habitId, dateString) =>
      statusByDate[dateString] ?? 'planned',
    getStreak: () => 0,
    handleArchive: () => {},
    handleDelete: () => {},
    handleHabitPress: () => {},
    isReorderingEnabled: false,
    notifyWeekCompletion: () => {},
    reduceMotionPreference: true,
    toggleHabit: () => {},
    weekDateStrings,
  };
}

describe('getHabitRenderData weekStatus identity', () => {
  it('returns the same array reference across different getHabitStatus identities with identical statuses', () => {
    const habit = makeHabit('habits:stable');
    const statuses = { '2025-12-01': 'done' as const };

    const first = getHabitRenderData(habit, 0, makeArgs(statuses));
    const second = getHabitRenderData(habit, 0, makeArgs(statuses));

    expect(second.weekStatus).toBe(first.weekStatus);
  });

  it('returns a new array when a day status changes', () => {
    const habit = makeHabit('habits:changed');

    const first = getHabitRenderData(
      habit,
      0,
      makeArgs({ '2025-12-01': 'done' })
    );
    const second = getHabitRenderData(
      habit,
      0,
      makeArgs({ '2025-12-01': 'done', '2025-12-02': 'done' })
    );

    expect(second.weekStatus).not.toBe(first.weekStatus);
    expect(second.weekStatus[1]).toBe('done');
  });

  it('returns a new array when weekDateStrings changes', () => {
    const habit = makeHabit('habits:week-shift');
    const statuses = { '2025-12-01': 'done' as const };
    const nextWeek = WEEK_DATE_STRINGS.map((d) =>
      d.replace('2025-12-0', '2025-12-1')
    );

    const first = getHabitRenderData(habit, 0, makeArgs(statuses));
    const second = getHabitRenderData(
      habit,
      0,
      makeArgs(statuses, nextWeek)
    );

    expect(second.weekStatus).not.toBe(first.weekStatus);
  });

  it('caches independently per habit', () => {
    const statuses = { '2025-12-01': 'done' as const };
    const a = getHabitRenderData(makeHabit('habits:a'), 0, makeArgs(statuses));
    const b = getHabitRenderData(makeHabit('habits:b'), 1, makeArgs(statuses));

    expect(a.weekStatus).not.toBe(b.weekStatus);
    expect(a.weekStatus).toEqual(b.weekStatus);
  });
});
