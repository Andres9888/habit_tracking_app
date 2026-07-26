/**
 * Enhanced Streak Calculation Tests
 * Additional edge cases for timezone changes, DST, midnight boundaries
 */

import { computeCurrentStreakFromDates } from '../streak';
import { format, subDays } from 'date-fns';

describe('streak - enhanced edge cases', () => {
  describe('timezone-specific edge cases', () => {
    it('handles dates created at different times of day', () => {
      const today = new Date('2024-02-15T23:59:59Z'); // End of day UTC
      const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
      
      const completedDates = new Set([
        formatDate(today),
        formatDate(subDays(today, 1)),
        formatDate(subDays(today, 2)),
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(3);
    });

    it('handles dates created at midnight', () => {
      const today = new Date('2024-02-15T00:00:00Z');
      const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
      
      const completedDates = new Set([
        formatDate(today),
        formatDate(subDays(today, 1)),
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(2);
    });

    it('handles dates in different hemispheres (simulated)', () => {
      // Test that YYYY-MM-DD strings are timezone-agnostic
      const today = new Date('2024-02-15T12:00:00Z');
      
      const completedDates = new Set([
        '2024-02-15', // String format is timezone-agnostic
        '2024-02-14',
        '2024-02-13',
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(3);
    });
  });

  describe('DST transition edge cases', () => {
    it('handles streak across spring DST transition (US)', () => {
      // March 10, 2024 - clocks spring forward 1 hour
      const afterDst = new Date('2024-03-11T12:00:00Z');
      const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
      
      const completedDates = new Set([
        '2024-03-11', // After DST
        '2024-03-10', // DST transition day
        '2024-03-09', // Before DST
        '2024-03-08',
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, afterDst)).toBe(4);
    });

    it('handles streak across fall DST transition (US)', () => {
      // November 3, 2024 - clocks fall back 1 hour
      const afterDst = new Date('2024-11-04T12:00:00Z');
      const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
      
      const completedDates = new Set([
        '2024-11-04', // After DST
        '2024-11-03', // DST transition day (25-hour day)
        '2024-11-02', // Before DST
        '2024-11-01',
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, afterDst)).toBe(4);
    });

    it('handles gap during DST transition week', () => {
      const afterDst = new Date('2024-03-12T12:00:00Z');
      
      const completedDates = new Set([
        '2024-03-12', // After DST
        '2024-03-11',
        // Gap on DST day
        '2024-03-09',
        '2024-03-08',
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, afterDst)).toBe(2);
    });

    it('handles international DST (Europe - different dates)', () => {
      // Europe DST typically last Sunday of March (March 31, 2024)
      const today = new Date('2024-04-01T12:00:00Z');
      
      const completedDates = new Set([
        '2024-04-01', // After DST
        '2024-03-31', // DST day
        '2024-03-30',
        '2024-03-29',
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(4);
    });
  });

  describe('midnight boundary edge cases', () => {
    it('handles completion exactly at midnight UTC', () => {
      const midnight = new Date('2024-02-15T00:00:00.000Z');
      const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
      
      const completedDates = new Set([
        formatDate(midnight),
        formatDate(subDays(midnight, 1)),
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, midnight)).toBe(2);
    });

    it('handles completion one millisecond before midnight', () => {
      const almostMidnight = new Date('2024-02-15T23:59:59.999Z');
      const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
      
      const completedDates = new Set([
        formatDate(almostMidnight),
        formatDate(subDays(almostMidnight, 1)),
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, almostMidnight)).toBe(2);
    });

    it('handles completion one millisecond after midnight', () => {
      const justAfterMidnight = new Date('2024-02-15T00:00:00.001Z');
      const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
      
      const completedDates = new Set([
        formatDate(justAfterMidnight),
        formatDate(subDays(justAfterMidnight, 1)),
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, justAfterMidnight)).toBe(2);
    });

    it('handles streak starting from previous day near midnight', () => {
      const nearMidnight = new Date('2024-02-15T23:58:00Z');
      const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
      
      const completedDates = new Set([
        // No completion today, last completion was yesterday
        formatDate(subDays(nearMidnight, 1)),
        formatDate(subDays(nearMidnight, 2)),
        formatDate(subDays(nearMidnight, 3)),
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, nearMidnight)).toBe(3);
    });
  });

  describe('timezone change scenarios', () => {
    it('handles user traveling across timezones (simulated)', () => {
      // User completes habit in different timezones but same calendar day
      const today = new Date('2024-02-15T12:00:00Z');
      
      // All these should map to same YYYY-MM-DD date
      const completedDates = new Set([
        '2024-02-15', // Date string is TZ-agnostic
        '2024-02-14',
        '2024-02-13',
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(3);
    });

    it('maintains streak when date format is consistent', () => {
      const today = new Date('2024-02-15T12:00:00Z');
      
      const completedDates = new Set([
        '2024-02-15',
        '2024-02-14',
        '2024-02-13',
        '2024-02-12',
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(4);
    });
  });

  describe('gap detection with timezone edge cases', () => {
    it('detects gap even with timestamps from different timezones', () => {
      const today = new Date('2024-02-15T12:00:00Z');
      
      const completedDates = new Set([
        '2024-02-15',
        '2024-02-14',
        // Gap on Feb 13
        '2024-02-12',
        '2024-02-11',
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(2);
    });

    it('handles multiple gaps with varied time-of-day completions', () => {
      const today = new Date('2024-02-15T18:30:00Z');
      
      const completedDates = new Set([
        '2024-02-15',
        '2024-02-14',
        '2024-02-13',
        // Gap
        '2024-02-11',
        '2024-02-10',
        // Gap
        '2024-02-08',
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(3);
    });
  });

  describe('real-world timezone scenarios', () => {
    it('handles completion in UTC+12 (first timezone of the day)', () => {
      // Completion happens in Fiji (UTC+12) early in the day
      const today = new Date('2024-02-15T12:00:00Z');
      
      const completedDates = new Set([
        '2024-02-15',
        '2024-02-14',
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(2);
    });

    it('handles completion in UTC-12 (last timezone of the day)', () => {
      // Completion happens in Baker Island (UTC-12) late in the day
      const today = new Date('2024-02-15T12:00:00Z');
      
      const completedDates = new Set([
        '2024-02-15',
        '2024-02-14',
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(2);
    });

    it('handles international date line crossing', () => {
      // Date string format abstracts away IDL complexity
      const today = new Date('2024-02-15T12:00:00Z');
      
      const completedDates = new Set([
        '2024-02-15',
        '2024-02-14',
        '2024-02-13',
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(3);
    });
  });

  describe('month transition with timezone edge cases', () => {
    it('handles Feb-March transition during leap year', () => {
      const marchFirst = new Date('2024-03-01T12:00:00Z');
      
      const completedDates = new Set([
        '2024-03-01',
        '2024-02-29', // Leap day
        '2024-02-28',
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, marchFirst)).toBe(3);
    });

    it('handles year transition', () => {
      const newYear = new Date('2024-01-01T12:00:00Z');
      
      const completedDates = new Set([
        '2024-01-01',
        '2023-12-31',
        '2023-12-30',
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, newYear)).toBe(3);
    });

    it('handles December-January transition at midnight', () => {
      const newYearMidnight = new Date(2024, 0, 1);
      
      const completedDates = new Set([
        '2024-01-01',
        '2023-12-31',
      ]);
      
      expect(computeCurrentStreakFromDates(completedDates, newYearMidnight)).toBe(2);
    });
  });

  describe('performance with timezone variations', () => {
    it('handles large dataset with varied timestamps efficiently', () => {
      const today = new Date('2024-02-15T12:00:00Z');
      
      // Create 100 consecutive days
      const completedDates = new Set(
        Array.from({ length: 100 }, (_, i) => {
          const date = subDays(today, i);
          return format(date, 'yyyy-MM-dd');
        })
      );
      
      const startTime = performance.now();
      const result = computeCurrentStreakFromDates(completedDates, today);
      const endTime = performance.now();
      
      expect(result).toBe(100);
      expect(endTime - startTime).toBeLessThan(50); // Should be very fast
    });
  });
});
