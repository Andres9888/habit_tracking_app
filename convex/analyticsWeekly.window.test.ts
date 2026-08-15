import type { Doc, Id } from './_generated/dataModel';
import { computeWeeklyInsights } from './analyticsWeekly';

function tracking(date: string): Doc<'tracking'> {
  return {
    _creationTime: 0,
    _id: `t_${date}` as Id<'tracking'>,
    completed: true,
    date,
    habitId: 'habit_1' as Id<'habits'>,
    userId: 'user_1',
  } as Doc<'tracking'>;
}

describe('computeWeeklyInsights window', () => {
  it('counts 7 days this week and 7 days last week', () => {
    const habit = {
      _id: 'habit_1' as Id<'habits'>,
      currentStreak: 3,
      icon: '🏃',
      name: 'Run',
    } as Doc<'habits'>;

    const dates = [
      '2026-01-02',
      '2026-01-03',
      '2026-01-04',
      '2026-01-05',
      '2026-01-06',
      '2026-01-07',
      '2026-01-08',
      '2026-01-09',
      '2026-01-10',
      '2026-01-11',
      '2026-01-12',
      '2026-01-13',
      '2026-01-14',
      '2026-01-15',
    ];
    const result = computeWeeklyInsights(
      [habit],
      dates.map(tracking),
      '2026-01-15'
    );

    expect(result.totalCompletionsThisWeek).toBe(7);
    expect(result.totalCompletionsLastWeek).toBe(7);
    expect(result.weekOverWeekChange).toBe(0);
  });
});
