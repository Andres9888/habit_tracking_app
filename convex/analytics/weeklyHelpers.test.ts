import {
  calculateHabitChanges,
  categorizeHabitChanges,
  calculateWeekOverWeekChange,
} from './weeklyHelpers';

describe('analytics/weeklyHelpers', () => {
  const habitId = 'h1' as any;
  const habit = { _id: habitId, name: 'Read', icon: '📚' };

  it('computes weekly habit change and percent increase', () => {
    const trackings = [
      { habitId, completed: true, date: '2026-02-13T12:00:00.000Z' },
      { habitId, completed: true, date: '2026-02-12T12:00:00.000Z' },
      { habitId, completed: true, date: '2026-02-06T12:00:00.000Z' },
    ];

    const result = calculateHabitChanges(
      habit,
      trackings,
      new Date('2026-02-08T00:00:00.000Z'),
      new Date('2026-02-01T00:00:00.000Z'),
      5
    );

    expect(result.thisWeek).toBe(2);
    expect(result.lastWeek).toBe(1);
    expect(result.change).toBe(1);
    expect(result.percentageChange).toBe(100);
    expect(result.currentStreak).toBe(5);
  });

  it('returns 100% when prior week had zero and current week has completions', () => {
    const trackings = [
      { habitId, completed: true, date: '2026-02-12T12:00:00.000Z' },
    ];

    const result = calculateHabitChanges(
      habit,
      trackings,
      new Date('2026-02-08T00:00:00.000Z'),
      new Date('2026-02-01T00:00:00.000Z'),
      1
    );

    expect(result.lastWeek).toBe(0);
    expect(result.thisWeek).toBe(1);
    expect(result.percentageChange).toBe(100);
  });

  it('categorizes gained, lost, and at-risk habits', () => {
    const changes = [
      {
        habitId: 'a',
        name: 'A',
        emoji: 'A',
        thisWeek: 5,
        lastWeek: 1,
        change: 4,
        percentageChange: 400,
        currentStreak: 9,
      },
      {
        habitId: 'b',
        name: 'B',
        emoji: 'B',
        thisWeek: 1,
        lastWeek: 4,
        change: -3,
        percentageChange: -75,
        currentStreak: 2,
      },
      {
        habitId: 'c',
        name: 'C',
        emoji: 'C',
        thisWeek: 2,
        lastWeek: 2,
        change: 0,
        percentageChange: 0,
        currentStreak: 3,
      },
    ] as any;

    const result = categorizeHabitChanges(changes);

    expect(result.gainedStrength.map((h) => h.habitId)).toEqual(['a']);
    expect(result.lostStrength.map((h) => h.habitId)).toEqual(['b']);
    expect(result.atRisk.map((h) => h.habitId)).toEqual(['b', 'c']);
  });

  it('computes aggregate week-over-week summary', () => {
    const result = calculateWeekOverWeekChange([
      { thisWeek: 6, lastWeek: 3 },
      { thisWeek: 2, lastWeek: 4 },
    ] as any);

    expect(result.totalCompletionsThisWeek).toBe(8);
    expect(result.totalCompletionsLastWeek).toBe(7);
    expect(result.weekOverWeekChange).toBeCloseTo(14.2857, 3);
  });

  it('handles zero baseline safely in week-over-week summary', () => {
    const result = calculateWeekOverWeekChange([
      { thisWeek: 5, lastWeek: 0 },
    ] as any);

    expect(result.weekOverWeekChange).toBe(0);
  });
});
