/**
 * Streak Calculation Utility Tests
 * Tests consecutive completion counting logic
 */

import { computeCurrentStreakFromDates } from '../streak';
import { format, subDays } from 'date-fns';

describe('streak', () => {
  describe('computeCurrentStreakFromDates', () => {
    const today = new Date('2024-02-01T12:00:00Z');
    const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

    it('returns 0 for empty completion set', () => {
      const completedDates = new Set<string>();
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(0);
    });

    it('returns 0 for null/undefined completion set', () => {
      expect(computeCurrentStreakFromDates(null as unknown, today)).toBe(0);
      expect(computeCurrentStreakFromDates(undefined as unknown, today)).toBe(0);
    });

    it('returns 1 for single completion today', () => {
      const completedDates = new Set([formatDate(today)]);
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(1);
    });

    it('returns 1 for single completion yesterday', () => {
      const completedDates = new Set([formatDate(subDays(today, 1))]);
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(1);
    });

    it('returns 0 for completion older than yesterday', () => {
      const completedDates = new Set([formatDate(subDays(today, 5))]);
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(0);
    });

    it('calculates streak for consecutive days', () => {
      const completedDates = new Set([
        formatDate(today),
        formatDate(subDays(today, 1)),
        formatDate(subDays(today, 2)),
        formatDate(subDays(today, 3)),
      ]);
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(4);
    });

    it('stops at first gap', () => {
      const completedDates = new Set([
        formatDate(today),
        formatDate(subDays(today, 1)),
        // Gap on day 2
        formatDate(subDays(today, 3)),
        formatDate(subDays(today, 4)),
      ]);
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(2);
    });

    it('ignores future completions', () => {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const completedDates = new Set([
        formatDate(tomorrow), // Future date
        formatDate(today),
        formatDate(subDays(today, 1)),
      ]);
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(2);
    });

    it('handles very long streaks', () => {
      const completedDates = new Set(
        Array.from({ length: 100 }, (_, i) => formatDate(subDays(today, i)))
      );
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(100);
    });

    it('respects maxLookbackDays limit', () => {
      // Create 500 consecutive days (exceeds 400 limit)
      const completedDates = new Set(
        Array.from({ length: 500 }, (_, i) => formatDate(subDays(today, i)))
      );
      const result = computeCurrentStreakFromDates(completedDates, today);

      // Should cap at maxLookbackDays (400)
      expect(result).toBe(400);
    });

    it('handles unsorted dates correctly', () => {
      const completedDates = new Set([
        formatDate(subDays(today, 2)),
        formatDate(today),
        formatDate(subDays(today, 1)),
      ]);
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(3);
    });

    it('treats isolated old completion as broken streak (0)', () => {
      const completedDates = new Set([formatDate(subDays(today, 50))]);
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(0);
    });

    it('counts from most recent completion, not today', () => {
      const completedDates = new Set([
        formatDate(subDays(today, 1)),
        formatDate(subDays(today, 2)),
        formatDate(subDays(today, 3)),
      ]);
      // No completion today, so streak starts from yesterday
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(3);
    });

    it('handles multiple isolated completions', () => {
      const completedDates = new Set([
        formatDate(today),
        formatDate(subDays(today, 5)),
        formatDate(subDays(today, 10)),
      ]);
      // Most recent completion is today (isolated)
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(1);
    });

    it('handles completion on day boundary', () => {
      const midnight = new Date('2024-02-01T00:00:00Z');
      const completedDates = new Set([
        formatDate(midnight),
        formatDate(subDays(midnight, 1)),
      ]);
      expect(computeCurrentStreakFromDates(completedDates, midnight)).toBe(2);
    });

    it('handles sparse completions correctly', () => {
      const completedDates = new Set([
        formatDate(subDays(today, 1)),
        formatDate(subDays(today, 2)),
        // Gap
        formatDate(subDays(today, 10)),
        formatDate(subDays(today, 11)),
        formatDate(subDays(today, 12)),
      ]);
      // Streak is the most recent consecutive sequence
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(2);
    });

    it('handles completion with only future dates', () => {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const completedDates = new Set([formatDate(tomorrow)]);
      expect(computeCurrentStreakFromDates(completedDates, today)).toBe(0);
    });

    it('maintains streak across different months', () => {
      const janEnd = new Date('2024-01-31T12:00:00Z');
      const completedDates = new Set([
        '2024-02-01',
        '2024-01-31',
        '2024-01-30',
        '2024-01-29',
      ]);
      const testDate = new Date('2024-02-01T12:00:00Z');
      expect(computeCurrentStreakFromDates(completedDates, testDate)).toBe(4);
    });

    it('maintains streak across different years', () => {
      const newYear = new Date('2024-01-02T12:00:00Z');
      const completedDates = new Set([
        '2024-01-02',
        '2024-01-01',
        '2023-12-31',
        '2023-12-30',
      ]);
      expect(computeCurrentStreakFromDates(completedDates, newYear)).toBe(4);
    });

    it('handles leap year dates', () => {
      const leapDay = new Date('2024-02-29T12:00:00Z');
      const completedDates = new Set([
        '2024-02-29',
        '2024-02-28',
        '2024-02-27',
      ]);
      expect(computeCurrentStreakFromDates(completedDates, leapDay)).toBe(3);
    });

    describe('edge cases', () => {
      it('handles date strings with different formats gracefully', () => {
        const completedDates = new Set([
          formatDate(today),
          formatDate(subDays(today, 1)),
        ]);
        expect(computeCurrentStreakFromDates(completedDates, today)).toBe(2);
      });

      it('handles duplicate dates', () => {
        const completedDates = new Set([
          formatDate(today),
          formatDate(today), // Duplicate (Set will ignore)
          formatDate(subDays(today, 1)),
        ]);
        expect(computeCurrentStreakFromDates(completedDates, today)).toBe(2);
      });

      it('handles very old today date', () => {
        const oldToday = new Date('2020-01-01T12:00:00Z');
        const completedDates = new Set([
          formatDate(oldToday),
          formatDate(subDays(oldToday, 1)),
        ]);
        expect(computeCurrentStreakFromDates(completedDates, oldToday)).toBe(2);
      });

      it('handles very future today date', () => {
        const futureToday = new Date('2030-01-01T12:00:00Z');
        const completedDates = new Set([
          formatDate(futureToday),
          formatDate(subDays(futureToday, 1)),
        ]);
        expect(computeCurrentStreakFromDates(completedDates, futureToday)).toBe(
          2
        );
      });

      it('performance test with large dataset', () => {
        const largeSet = new Set(
          Array.from({ length: 1000 }, (_, i) => formatDate(subDays(today, i)))
        );

        const startTime = performance.now();
        const result = computeCurrentStreakFromDates(largeSet, today);
        const endTime = performance.now();

        expect(result).toBe(400); // Capped at maxLookbackDays
        expect(endTime - startTime).toBeLessThan(100); // Should be fast
      });
    });

    describe('real-world scenarios', () => {
      it('handles perfect habit since creation', () => {
        const createdAt = subDays(today, 30);
        const completedDates = new Set(
          Array.from({ length: 31 }, (_, i) => formatDate(subDays(today, i)))
        );
        expect(computeCurrentStreakFromDates(completedDates, today)).toBe(31);
      });

      it('handles habit with recent restart', () => {
        const completedDates = new Set([
          formatDate(today),
          formatDate(subDays(today, 1)),
          formatDate(subDays(today, 2)),
          // Long gap
          formatDate(subDays(today, 100)),
          formatDate(subDays(today, 101)),
        ]);
        expect(computeCurrentStreakFromDates(completedDates, today)).toBe(3);
      });

      it('handles habit completed only on weekdays', () => {
        // Assuming today is Thursday (Feb 1, 2024)
        const completedDates = new Set([
          '2024-02-01', // Thu
          '2024-01-31', // Wed
          '2024-01-30', // Tue
          '2024-01-29', // Mon
          // Weekend gap
          '2024-01-26', // Fri
        ]);
        const testDate = new Date('2024-02-01T12:00:00Z');
        // Should count Thu, Wed, Tue, Mon as streak (4 days)
        expect(computeCurrentStreakFromDates(completedDates, testDate)).toBe(4);
      });

      it('handles habit with single miss breaking long streak', () => {
        const completedDates = new Set([
          formatDate(today),
          formatDate(subDays(today, 1)),
          // Miss on day 2
          ...Array.from({ length: 50 }, (_, i) =>
            formatDate(subDays(today, i + 3))
          ),
        ]);
        expect(computeCurrentStreakFromDates(completedDates, today)).toBe(2);
      });
    });
  });
});
