import type { Doc, Id } from '../_generated/dataModel';
import {
  buildWeeklyCompletionIndex,
  calculateHabitChanges,
} from './weeklyHelpers';

const habitId = 'habit_1' as Id<'habits'>;
const habit = { _id: habitId, name: 'Run' };

function tracking(date: string, completed = true): Doc<'tracking'> {
  return {
    _creationTime: 0,
    _id: `t_${date}` as Id<'tracking'>,
    completed,
    date,
    habitId,
    userId: 'user_1',
  } as Doc<'tracking'>;
}

describe('calculateHabitChanges', () => {
  const oneWeekAgoKey = '2026-06-04';
  const twoWeeksAgoKey = '2026-05-28';

  it('buckets boundary dates by calendar-day key, not Date instants', () => {
    const trackings = [
      tracking('2026-06-04'), // exactly one week ago → this week (inclusive)
      tracking('2026-06-03'), // day before boundary → last week
      tracking('2026-05-28'), // exactly two weeks ago → last week (inclusive)
      tracking('2026-05-27'), // before window → excluded
    ];
    const result = calculateHabitChanges(
      habit,
      buildWeeklyCompletionIndex(trackings, oneWeekAgoKey, twoWeeksAgoKey),
      3
    );
    expect(result.thisWeek).toBe(1);
    expect(result.lastWeek).toBe(2);
    expect(result.change).toBe(-1);
  });

  it('ignores incomplete entries and other habits', () => {
    const otherHabit = tracking('2026-06-05');
    (otherHabit as { habitId: Id<'habits'> }).habitId =
      'habit_2' as Id<'habits'>;
    const trackings = [tracking('2026-06-05', false), otherHabit];
    const result = calculateHabitChanges(
      habit,
      buildWeeklyCompletionIndex(trackings, oneWeekAgoKey, twoWeeksAgoKey),
      0
    );
    expect(result.thisWeek).toBe(0);
    expect(result.lastWeek).toBe(0);
  });
});
