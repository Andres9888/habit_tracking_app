import type { Habit } from '../types';
import {
  buildHabitEffortForecast,
  DEFAULT_DAILY_HABIT_CAPACITY_MINUTES,
  DEFAULT_HABIT_EFFORT_MINUTES,
  isHabitScheduledOnDate,
  resolveHabitEffortMinutes,
} from './habitEffortForecast';

function habit(id: string, overrides: Partial<Habit> = {}): Habit {
  return {
    _creationTime: 1,
    _id: id as Habit['_id'],
    createdAt: 1,
    name: id,
    ...overrides,
  } as Habit;
}

describe('habit effort forecast', () => {
  it('uses the gentle default for unset or invalid estimates', () => {
    expect(resolveHabitEffortMinutes()).toBe(DEFAULT_HABIT_EFFORT_MINUTES);
    expect(resolveHabitEffortMinutes(0)).toBe(DEFAULT_HABIT_EFFORT_MINUTES);
    expect(resolveHabitEffortMinutes(15)).toBe(15);
  });

  it('respects weekly schedules and paused habits', () => {
    const monday = '2026-08-03';
    expect(isHabitScheduledOnDate(habit('daily'), monday)).toBe(true);
    expect(
      isHabitScheduledOnDate(habit('monday', { daysOfWeek: [1] }), monday)
    ).toBe(true);
    expect(
      isHabitScheduledOnDate(habit('tuesday', { daysOfWeek: [2] }), monday)
    ).toBe(false);
    expect(
      isHabitScheduledOnDate(habit('paused', { paused: true }), monday)
    ).toBe(false);
  });

  it('computes future load and subtracts completed work from today', () => {
    const today = '2026-08-03';
    const tomorrow = '2026-08-04';
    const habits = [
      habit('done', { effortMinutes: 5 }),
      habit('open', { effortMinutes: 15 }),
      habit('default'),
      habit('tuesday-only', { daysOfWeek: [2], effortMinutes: 30 }),
    ];

    const forecast = buildHabitEffortForecast({
      dateStrings: [today, tomorrow],
      getHabitStatus: (habitId, dateString) =>
        habitId === 'done' && dateString === today ? 'done' : 'planned',
      habits,
      todayString: today,
    });

    expect(forecast[today]).toEqual({
      capacityMinutes: DEFAULT_DAILY_HABIT_CAPACITY_MINUTES,
      plannedMinutes: 30,
      remainingMinutes: 25,
    });
    expect(forecast[tomorrow]).toEqual({
      capacityMinutes: DEFAULT_DAILY_HABIT_CAPACITY_MINUTES,
      plannedMinutes: 60,
      remainingMinutes: 60,
    });
  });
});
