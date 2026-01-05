/**
 * HabitsEmptyStateMinimal - Utility Functions Tests
 *
 * Comprehensive tests for time-based chip selection logic.
 */

import { getTimeBasedChips, TIME_WINDOWS } from '../utils';
import {
  MORNING_CHIPS,
  AFTERNOON_CHIPS,
  EVENING_CHIPS,
  NIGHT_CHIPS,
  STATIC_CHIPS,
} from '../constants';

describe('getTimeBasedChips', () => {
  describe('Time window detection', () => {
    it('returns MORNING_CHIPS for 5am-11am', () => {
      const morningDate = new Date('2026-01-05T08:30:00'); // 8:30am
      expect(getTimeBasedChips(morningDate)).toEqual(MORNING_CHIPS);
    });

    it('returns AFTERNOON_CHIPS for 11am-5pm', () => {
      const afternoonDate = new Date('2026-01-05T14:15:00'); // 2:15pm
      expect(getTimeBasedChips(afternoonDate)).toEqual(AFTERNOON_CHIPS);
    });

    it('returns EVENING_CHIPS for 5pm-10pm', () => {
      const eveningDate = new Date('2026-01-05T19:45:00'); // 7:45pm
      expect(getTimeBasedChips(eveningDate)).toEqual(EVENING_CHIPS);
    });

    it('returns NIGHT_CHIPS for 10pm-5am', () => {
      const nightDate = new Date('2026-01-05T23:30:00'); // 11:30pm
      expect(getTimeBasedChips(nightDate)).toEqual(NIGHT_CHIPS);
    });

    it('returns NIGHT_CHIPS for hours after midnight', () => {
      const lateNightDate = new Date('2026-01-05T02:00:00'); // 2:00am
      expect(getTimeBasedChips(lateNightDate)).toEqual(NIGHT_CHIPS);
    });
  });

  describe('Boundary conditions', () => {
    it('returns MORNING_CHIPS at exactly 5am', () => {
      const boundaryDate = new Date('2026-01-05T05:00:00');
      expect(getTimeBasedChips(boundaryDate)).toEqual(MORNING_CHIPS);
    });

    it('returns AFTERNOON_CHIPS at exactly 11am', () => {
      const boundaryDate = new Date('2026-01-05T11:00:00');
      expect(getTimeBasedChips(boundaryDate)).toEqual(AFTERNOON_CHIPS);
    });

    it('returns EVENING_CHIPS at exactly 5pm', () => {
      const boundaryDate = new Date('2026-01-05T17:00:00');
      expect(getTimeBasedChips(boundaryDate)).toEqual(EVENING_CHIPS);
    });

    it('returns NIGHT_CHIPS at exactly 10pm', () => {
      const boundaryDate = new Date('2026-01-05T22:00:00');
      expect(getTimeBasedChips(boundaryDate)).toEqual(NIGHT_CHIPS);
    });

    it('returns NIGHT_CHIPS at 4:59am (just before morning)', () => {
      const boundaryDate = new Date('2026-01-05T04:59:00');
      expect(getTimeBasedChips(boundaryDate)).toEqual(NIGHT_CHIPS);
    });

    it('returns MORNING_CHIPS at 10:59am (just before afternoon)', () => {
      const boundaryDate = new Date('2026-01-05T10:59:00');
      expect(getTimeBasedChips(boundaryDate)).toEqual(MORNING_CHIPS);
    });

    it('returns AFTERNOON_CHIPS at 4:59pm (just before evening)', () => {
      const boundaryDate = new Date('2026-01-05T16:59:00');
      expect(getTimeBasedChips(boundaryDate)).toEqual(AFTERNOON_CHIPS);
    });

    it('returns EVENING_CHIPS at 9:59pm (just before night)', () => {
      const boundaryDate = new Date('2026-01-05T21:59:00');
      expect(getTimeBasedChips(boundaryDate)).toEqual(EVENING_CHIPS);
    });
  });

  describe('Feature flag behavior', () => {
    it('returns STATIC_CHIPS when useTimeBased is false', () => {
      const morningDate = new Date('2026-01-05T08:30:00');
      expect(getTimeBasedChips(morningDate, false)).toEqual(STATIC_CHIPS);
    });

    it('returns time-based chips when useTimeBased is true', () => {
      const morningDate = new Date('2026-01-05T08:30:00');
      expect(getTimeBasedChips(morningDate, true)).toEqual(MORNING_CHIPS);
    });

    it('defaults to time-based behavior when flag not provided', () => {
      const afternoonDate = new Date('2026-01-05T14:00:00');
      expect(getTimeBasedChips(afternoonDate)).toEqual(AFTERNOON_CHIPS);
    });

    it('returns STATIC_CHIPS for all times when useTimeBased is false', () => {
      const testTimes = [
        new Date('2026-01-05T08:00:00'), // Morning
        new Date('2026-01-05T14:00:00'), // Afternoon
        new Date('2026-01-05T19:00:00'), // Evening
        new Date('2026-01-05T23:00:00'), // Night
      ];

      testTimes.forEach((date) => {
        expect(getTimeBasedChips(date, false)).toEqual(STATIC_CHIPS);
      });
    });
  });

  describe('Chip array validation', () => {
    it('always returns exactly 6 chips', () => {
      const testTimes = [
        new Date('2026-01-05T08:00:00'), // Morning
        new Date('2026-01-05T14:00:00'), // Afternoon
        new Date('2026-01-05T19:00:00'), // Evening
        new Date('2026-01-05T23:00:00'), // Night
      ];

      testTimes.forEach((date) => {
        expect(getTimeBasedChips(date)).toHaveLength(6);
      });
    });

    it('returns chips with valid structure', () => {
      const chips = getTimeBasedChips();
      chips.forEach((chip) => {
        expect(chip).toHaveProperty('emoji');
        expect(chip).toHaveProperty('label');
        expect(chip).toHaveProperty('fullName');
        expect(typeof chip.emoji).toBe('string');
        expect(typeof chip.label).toBe('string');
        expect(typeof chip.fullName).toBe('string');
      });
    });

    it('returns non-empty chip properties', () => {
      const chips = getTimeBasedChips();
      chips.forEach((chip) => {
        expect(chip.emoji.length).toBeGreaterThan(0);
        expect(chip.label.length).toBeGreaterThan(0);
        expect(chip.fullName.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Default behavior', () => {
    it('uses current time when no date provided', () => {
      // This test runs at current time, so we just verify it returns valid chips
      const chips = getTimeBasedChips();
      expect(chips).toHaveLength(6);
      expect(chips[0]).toHaveProperty('emoji');
    });

    it('defaults useTimeBased to true', () => {
      const morningDate = new Date('2026-01-05T08:00:00');
      // Calling without second parameter should use time-based logic
      expect(getTimeBasedChips(morningDate)).toEqual(MORNING_CHIPS);
    });
  });

  describe('All hours of the day', () => {
    it('returns correct chips for every hour', () => {
      // Test each hour of the day
      const hourTests = [
        // Night hours (22-4)
        { hour: 22, expected: NIGHT_CHIPS }, // 10pm
        { hour: 23, expected: NIGHT_CHIPS }, // 11pm
        { hour: 0, expected: NIGHT_CHIPS }, // Midnight
        { hour: 1, expected: NIGHT_CHIPS }, // 1am
        { hour: 2, expected: NIGHT_CHIPS }, // 2am
        { hour: 3, expected: NIGHT_CHIPS }, // 3am
        { hour: 4, expected: NIGHT_CHIPS }, // 4am
        // Morning hours (5-10)
        { hour: 5, expected: MORNING_CHIPS }, // 5am
        { hour: 6, expected: MORNING_CHIPS }, // 6am
        { hour: 7, expected: MORNING_CHIPS }, // 7am
        { hour: 8, expected: MORNING_CHIPS }, // 8am
        { hour: 9, expected: MORNING_CHIPS }, // 9am
        { hour: 10, expected: MORNING_CHIPS }, // 10am
        // Afternoon hours (11-16)
        { hour: 11, expected: AFTERNOON_CHIPS }, // 11am
        { hour: 12, expected: AFTERNOON_CHIPS }, // Noon
        { hour: 13, expected: AFTERNOON_CHIPS }, // 1pm
        { hour: 14, expected: AFTERNOON_CHIPS }, // 2pm
        { hour: 15, expected: AFTERNOON_CHIPS }, // 3pm
        { hour: 16, expected: AFTERNOON_CHIPS }, // 4pm
        // Evening hours (17-21)
        { hour: 17, expected: EVENING_CHIPS }, // 5pm
        { hour: 18, expected: EVENING_CHIPS }, // 6pm
        { hour: 19, expected: EVENING_CHIPS }, // 7pm
        { hour: 20, expected: EVENING_CHIPS }, // 8pm
        { hour: 21, expected: EVENING_CHIPS }, // 9pm
      ];

      hourTests.forEach(({ hour, expected }) => {
        const date = new Date('2026-01-05');
        date.setHours(hour, 0, 0, 0);
        expect(getTimeBasedChips(date)).toEqual(expected);
      });
    });
  });
});

describe('TIME_WINDOWS constants', () => {
  it('has correct morning window', () => {
    expect(TIME_WINDOWS.MORNING).toEqual({ start: 5, end: 11 });
  });

  it('has correct afternoon window', () => {
    expect(TIME_WINDOWS.AFTERNOON).toEqual({ start: 11, end: 17 });
  });

  it('has correct evening window', () => {
    expect(TIME_WINDOWS.EVENING).toEqual({ start: 17, end: 22 });
  });

  it('has correct night window', () => {
    expect(TIME_WINDOWS.NIGHT).toEqual({ start: 22, end: 5 });
  });

  it('windows cover all 24 hours without gaps', () => {
    // Morning: 5-10 (6 hours)
    // Afternoon: 11-16 (6 hours)
    // Evening: 17-21 (5 hours)
    // Night: 22-4 (7 hours)
    // Total: 24 hours
    const morningHours = TIME_WINDOWS.MORNING.end - TIME_WINDOWS.MORNING.start;
    const afternoonHours =
      TIME_WINDOWS.AFTERNOON.end - TIME_WINDOWS.AFTERNOON.start;
    const eveningHours = TIME_WINDOWS.EVENING.end - TIME_WINDOWS.EVENING.start;
    // Night wraps around, so calculate differently
    const nightHours = 24 - TIME_WINDOWS.NIGHT.start + TIME_WINDOWS.NIGHT.end;

    expect(morningHours + afternoonHours + eveningHours + nightHours).toBe(24);
  });
});
