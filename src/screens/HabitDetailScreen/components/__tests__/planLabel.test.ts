/**
 * The if-then plan line under the hero title. Both halves come from fields the
 * habit already stores, so the only real risk is printing something the reader
 * did not write — a malformed reminder, a reminder they switched off, or a cue
 * long enough to wrap the row.
 */
import type { Habit } from '../../../../features/habits/types';
import {
  planLabel,
  reminderClock,
} from '../DetailHeroBanner/DetailHeroBanner.plan';

function habitWith(overrides: Partial<Habit>): Habit {
  return { name: 'Wake-Up Movement', ...overrides } as unknown as Habit;
}

describe('reminderClock', () => {
  it('formats stored 24-hour times', () => {
    expect(reminderClock('07:30')).toBe('7:30 AM');
    expect(reminderClock('19:05')).toBe('7:05 PM');
  });

  it('calls midnight 12:00 AM', () => {
    expect(reminderClock('00:00')).toBe('12:00 AM');
  });

  it('tolerates an already-formatted 12-hour time', () => {
    expect(reminderClock('7:30 PM')).toBe('7:30 PM');
  });

  it('returns null rather than printing garbage', () => {
    expect(reminderClock('garbage')).toBeNull();
    expect(reminderClock('25:00')).toBeNull();
    expect(reminderClock(undefined)).toBeNull();
  });
});

describe('planLabel', () => {
  it('joins the cue and the reminder when both exist', () => {
    expect(
      planLabel(
        habitWith({ cueAfterBehavior: 'morning coffee', reminderTime: '07:30' })
      )
    ).toBe('After morning coffee · 7:30 AM reminder');
  });

  it('stands on the cue alone', () => {
    expect(planLabel(habitWith({ cueAfterBehavior: 'morning coffee' }))).toBe(
      'After morning coffee'
    );
  });

  it('suffixes the schedule when only a reminder exists', () => {
    expect(planLabel(habitWith({ reminderTime: '07:30' }))).toBe(
      '7:30 AM reminder · Daily'
    );
  });

  it('falls back to the schedule line when the habit has neither', () => {
    expect(planLabel(habitWith({}))).toBe('Daily');
  });

  it('drops the reminder half once reminders are switched off', () => {
    expect(
      planLabel(
        habitWith({
          cueAfterBehavior: 'morning coffee',
          remindersEnabled: false,
          reminderTime: '07:30',
        })
      )
    ).toBe('After morning coffee');
  });

  it('ellipsises a cue too long for the row', () => {
    const cue = 'I finish the last of my very long morning coffee ritual';
    const label = planLabel(habitWith({ cueAfterBehavior: cue }));

    expect(label).toBe('After I finish the last of my very long morni…');
    expect(label.length).toBeLessThan(`After ${cue}`.length);
  });
});
