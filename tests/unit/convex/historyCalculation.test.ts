/**
 * History-based Streak Calculation Tests
 * Tests for calculateStreakFromHistory function
 */

import { calculateStreakFromHistory } from '../../../convex/streakUtils/historyCalculation';
import type {
  TrackingRecord,
  StreakData,
} from '../../../convex/streakUtils/types';

describe('History-based Streak Calculation', () => {
  const createTracking = (
    dates: string[],
    completed: boolean = true
  ): TrackingRecord[] => dates.map((date) => ({ date, completed }));

  describe('calculateStreakFromHistory', () => {
    describe('Empty or no completions', () => {
      it('should return zero streaks for empty tracking', () => {
        const result = calculateStreakFromHistory([], '2025-01-15');
        expect(result.currentStreak).toBe(0);
        expect(result.bestStreak).toBe(0);
        expect(result.lastCompletedDate).toBe('');
      });

      it('should return zero streaks for no completed tracking', () => {
        const tracking = createTracking(['2025-01-10', '2025-01-11'], false);
        const result = calculateStreakFromHistory(tracking, '2025-01-15');
        expect(result.currentStreak).toBe(0);
        expect(result.bestStreak).toBe(0);
      });
    });

    describe('Single completion', () => {
      it('should return streak of 1 for single completion today', () => {
        const tracking = createTracking(['2025-01-15']);
        const result = calculateStreakFromHistory(tracking, '2025-01-15');
        expect(result.currentStreak).toBe(1);
        expect(result.bestStreak).toBe(1);
        expect(result.lastCompletedDate).toBe('2025-01-15');
      });

      it('should return streak of 1 for single completion yesterday', () => {
        const tracking = createTracking(['2025-01-14']);
        const result = calculateStreakFromHistory(tracking, '2025-01-15');
        expect(result.currentStreak).toBe(1);
        expect(result.bestStreak).toBe(1);
      });

      it('should return 0 current streak if last completion was >1 day ago', () => {
        const tracking = createTracking(['2025-01-12']);
        const result = calculateStreakFromHistory(tracking, '2025-01-15');
        expect(result.currentStreak).toBe(0);
        expect(result.bestStreak).toBe(1);
      });
    });

    describe('Consecutive days', () => {
      it('should calculate streak for consecutive days', () => {
        const tracking = createTracking([
          '2025-01-10',
          '2025-01-11',
          '2025-01-12',
          '2025-01-13',
        ]);
        const result = calculateStreakFromHistory(tracking, '2025-01-13');
        expect(result.currentStreak).toBe(4);
        expect(result.bestStreak).toBe(4);
      });

      it('should handle month boundary', () => {
        const tracking = createTracking([
          '2025-01-30',
          '2025-01-31',
          '2025-02-01',
        ]);
        const result = calculateStreakFromHistory(tracking, '2025-02-01');
        expect(result.currentStreak).toBe(3);
        expect(result.bestStreak).toBe(3);
      });

      it('should handle year boundary', () => {
        const tracking = createTracking([
          '2024-12-30',
          '2024-12-31',
          '2025-01-01',
        ]);
        const result = calculateStreakFromHistory(tracking, '2025-01-01');
        expect(result.currentStreak).toBe(3);
        expect(result.bestStreak).toBe(3);
      });

      it('should handle leap year', () => {
        const tracking = createTracking([
          '2024-02-27',
          '2024-02-28',
          '2024-02-29',
        ]);
        const result = calculateStreakFromHistory(tracking, '2024-02-29');
        expect(result.currentStreak).toBe(3);
        expect(result.bestStreak).toBe(3);
      });
    });

    describe('Broken streaks', () => {
      it('should reset current streak after gap', () => {
        const tracking = createTracking([
          '2025-01-10',
          '2025-01-11',
          '2025-01-13',
          '2025-01-14',
        ]);
        const result = calculateStreakFromHistory(tracking, '2025-01-14');
        // Current streak is 2 (Jan 13-14), best is 2 (first run was 2 days max)
        expect(result.currentStreak).toBe(2);
        expect(result.bestStreak).toBe(2);
      });

      it('should track best streak when multiple runs exist', () => {
        const tracking = createTracking([
          '2025-01-01',
          '2025-01-02',
          '2025-01-03', // 3-day streak
          '2025-01-10',
          '2025-01-11',
          '2025-01-12',
          '2025-01-13', // 4-day streak
        ]);
        const result = calculateStreakFromHistory(tracking, '2025-01-13');
        // Current streak is 4 (last run), best is 4
        expect(result.currentStreak).toBe(4);
        expect(result.bestStreak).toBeGreaterThanOrEqual(4);
      });
    });

    describe('Duplicate dates', () => {
      it('should handle duplicate dates gracefully', () => {
        const tracking = [
          { date: '2025-01-10', completed: true },
          { date: '2025-01-10', completed: true }, // Duplicate
          { date: '2025-01-11', completed: true },
        ];
        const result = calculateStreakFromHistory(tracking, '2025-01-11');
        expect(result.currentStreak).toBe(2);
        expect(result.bestStreak).toBe(2);
      });
    });

    describe('Unsorted input', () => {
      it('should work with unsorted dates', () => {
        const tracking = createTracking([
          '2025-01-13',
          '2025-01-10',
          '2025-01-12',
          '2025-01-11',
        ]);
        const result = calculateStreakFromHistory(tracking, '2025-01-13');
        expect(result.currentStreak).toBe(4);
        expect(result.bestStreak).toBe(4);
      });
    });

    describe('Grace period logic', () => {
      it('should count today as valid streak', () => {
        const tracking = createTracking(['2025-01-14', '2025-01-15']);
        const result = calculateStreakFromHistory(tracking, '2025-01-15');
        expect(result.currentStreak).toBe(2);
      });

      it('should count yesterday as valid (1-day grace)', () => {
        const tracking = createTracking(['2025-01-13', '2025-01-14']);
        const result = calculateStreakFromHistory(tracking, '2025-01-15');
        expect(result.currentStreak).toBe(2);
      });

      it('should not count 2 days ago', () => {
        const tracking = createTracking(['2025-01-12', '2025-01-13']);
        const result = calculateStreakFromHistory(tracking, '2025-01-15');
        expect(result.currentStreak).toBe(0); // Streak broken
        expect(result.bestStreak).toBe(2);
      });
    });

    describe('Best streak tracking', () => {
      it('should track best streak even when current is lower', () => {
        const tracking = createTracking([
          '2025-01-01',
          '2025-01-02',
          '2025-01-03',
          '2025-01-04',
          '2025-01-05', // 5-day
          '2025-01-15',
          '2025-01-16', // 2-day current
        ]);
        const result = calculateStreakFromHistory(tracking, '2025-01-16');
        expect(result.currentStreak).toBe(2);
        expect(result.bestStreak).toBe(5);
      });

      it('should update best when current exceeds', () => {
        const tracking = createTracking([
          '2025-01-10',
          '2025-01-11',
          '2025-01-12',
        ]);
        const result = calculateStreakFromHistory(tracking, '2025-01-12');
        expect(result.currentStreak).toBe(3);
        expect(result.bestStreak).toBe(3);
      });
    });

    describe('Mixed completion status', () => {
      it('should only count completed entries', () => {
        const tracking: TrackingRecord[] = [
          { date: '2025-01-10', completed: true },
          { date: '2025-01-11', completed: false },
          { date: '2025-01-12', completed: true },
          { date: '2025-01-13', completed: true },
        ];
        const result = calculateStreakFromHistory(tracking, '2025-01-13');
        // Only counts completed dates
        expect(result.currentStreak).toBe(2); // Jan 12, 13
        expect(result.bestStreak).toBe(2);
      });
    });

    describe('Edge cases', () => {
      it('should handle long consecutive streaks', () => {
        // Create 30-day streak starting from 2025-01-01
        const dates = Array.from({ length: 30 }, (_, i) => {
          const d = new Date('2025-01-01');
          d.setDate(d.getDate() + i);
          return d.toISOString().split('T')[0];
        });
        const tracking = createTracking(dates);
        const result = calculateStreakFromHistory(tracking, dates[29]);
        expect(result.bestStreak).toBe(30);
        expect(result.currentStreak).toBe(30); // All consecutive from start
      });

      it('should handle far future evaluation date', () => {
        const tracking = createTracking(['2025-01-01', '2025-01-02']);
        const result = calculateStreakFromHistory(tracking, '2030-01-01');
        expect(result.currentStreak).toBe(0); // Old streak not current
        expect(result.bestStreak).toBe(2);
      });
    });
  });
});
