import {
  frequencyLabel,
  scheduleLabel,
  timeGroupLabel,
} from '../DetailHeroBanner/DetailHeroBanner.utils';
import type { Habit } from '../../../../features/habits/types';

function habit(overrides: Partial<Habit> = {}): Habit {
  return { name: 'Wake-Up Movement', ...overrides } as Habit;
}

describe('scheduleLabel', () => {
  it('does not invent a morning grouping without time-of-day data', () => {
    expect(scheduleLabel(habit())).toBe('Daily');
    expect(timeGroupLabel(habit())).toBeUndefined();
  });

  it('joins a real morning grouping with daily cadence', () => {
    expect(scheduleLabel(habit({ preferredTime: 'morning' }))).toBe(
      'Morning routine · Daily'
    );
  });

  it('maps reminder hour to a daypart instead of dumping the clock', () => {
    expect(scheduleLabel(habit({ reminderTime: '6:45 AM' }))).toBe(
      'Morning routine · Daily'
    );
    expect(scheduleLabel(habit({ reminderTime: '20:00' }))).toBe(
      'Evening routine · Daily'
    );
  });

  it('uses weekday count when the habit is not every day', () => {
    expect(frequencyLabel(habit({ daysOfWeek: [1, 3, 5] }))).toBe(
      '3 days a week'
    );
    expect(
      scheduleLabel(habit({ daysOfWeek: [1], preferredTime: 'evening' }))
    ).toBe('Evening routine · Once a week');
  });
});
