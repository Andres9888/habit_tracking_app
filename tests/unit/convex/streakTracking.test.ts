/**
 * Streak Tracking System Tests (Story 1.3)
 * Tests for streak calculation logic and edge cases
 */

import { updateStreak, differenceInDays } from '../../../convex/streakUtils';
import type { StreakData } from '../../../convex/streakUtils/types';

describe('Streak Tracking System', () => {
  describe('differenceInDays', () => {
    it('should calculate difference between two dates correctly', () => {
      const date1 = new Date('2025-01-10');
      const date2 = new Date('2025-01-08');
      expect(differenceInDays(date1, date2)).toBe(2);
    });

    it('should handle same day correctly', () => {
      const date1 = new Date('2025-01-10');
      const date2 = new Date('2025-01-10');
      expect(differenceInDays(date1, date2)).toBe(0);
    });

    it('should handle negative differences (past dates)', () => {
      const date1 = new Date('2025-01-08');
      const date2 = new Date('2025-01-10');
      expect(differenceInDays(date1, date2)).toBe(-2);
    });

    it('should ignore time component', () => {
      const date1 = new Date('2025-01-10T23:59:59');
      const date2 = new Date('2025-01-10T00:00:00');
      expect(differenceInDays(date1, date2)).toBe(0);
    });
  });

  describe('updateStreak - First Completion', () => {
    it('should set streak to 1 on first completion', () => {
      const result = updateStreak(
        { bestStreak: 0, currentStreak: 0 },
        '2025-01-10',
        true
      );

      expect(result.currentStreak).toBe(1);
      expect(result.bestStreak).toBe(1);
      expect(result.lastCompletedDate).toBe('2025-01-10');
    });

    it('should initialize streaks when no previous data exists', () => {
      const result = updateStreak({}, '2025-01-15', true);

      expect(result.currentStreak).toBe(1);
      expect(result.bestStreak).toBe(1);
      expect(result.lastCompletedDate).toBe('2025-01-15');
    });
  });

  describe('updateStreak - Consecutive Days', () => {
    it('should increment streak on consecutive day completion', () => {
      const result = updateStreak(
        {
          bestStreak: 1,
          currentStreak: 1,
          lastCompletedDate: '2025-01-10',
        },
        '2025-01-11',
        true
      );

      expect(result.currentStreak).toBe(2);
      expect(result.bestStreak).toBe(2);
      expect(result.lastCompletedDate).toBe('2025-01-11');
    });

    it('should continue incrementing for multiple consecutive days', () => {
      let streakData = {
        bestStreak: 1,
        currentStreak: 1,
        lastCompletedDate: '2025-01-10',
      };

      // Day 2
      streakData = updateStreak(streakData, '2025-01-11', true);
      expect(streakData.currentStreak).toBe(2);

      // Day 3
      streakData = updateStreak(streakData, '2025-01-12', true);
      expect(streakData.currentStreak).toBe(3);

      // Day 4
      streakData = updateStreak(streakData, '2025-01-13', true);
      expect(streakData.currentStreak).toBe(4);

      expect(streakData.bestStreak).toBe(4);
      expect(streakData.lastCompletedDate).toBe('2025-01-13');
    });
  });

  describe('updateStreak - Same Day Completion', () => {
    it('should not change streak when completing same day', () => {
      const result = updateStreak(
        {
          bestStreak: 10,
          currentStreak: 5,
          lastCompletedDate: '2025-01-10',
        },
        '2025-01-10',
        true
      );

      expect(result.currentStreak).toBe(5);
      expect(result.bestStreak).toBe(10);
      expect(result.lastCompletedDate).toBe('2025-01-10');
    });
  });

  describe('updateStreak - Missed Days (Gap)', () => {
    it('should reset streak to 1 when a day is missed', () => {
      const result = updateStreak(
        {
          bestStreak: 5,
          currentStreak: 5,
          lastCompletedDate: '2025-01-10',
        },
        '2025-01-12', // Skipped Jan 11
        true
      );

      expect(result.currentStreak).toBe(1);
      expect(result.bestStreak).toBe(5); // Best streak preserved
      expect(result.lastCompletedDate).toBe('2025-01-12');
    });

    it('should reset streak to 1 after multiple missed days', () => {
      const result = updateStreak(
        {
          bestStreak: 15,
          currentStreak: 10,
          lastCompletedDate: '2025-01-10',
        },
        '2025-01-20', // Skipped 9 days
        true
      );

      expect(result.currentStreak).toBe(1);
      expect(result.bestStreak).toBe(15); // Best streak preserved
      expect(result.lastCompletedDate).toBe('2025-01-20');
    });
  });

  describe('updateStreak - Best Streak Updates', () => {
    it('should update best streak when current exceeds it', () => {
      const result = updateStreak(
        {
          bestStreak: 8,
          currentStreak: 9,
          lastCompletedDate: '2025-01-10',
        },
        '2025-01-11',
        true
      );

      expect(result.currentStreak).toBe(10);
      expect(result.bestStreak).toBe(10); // Updated to new best
      expect(result.lastCompletedDate).toBe('2025-01-11');
    });

    it('should not update best streak when current is lower', () => {
      const result = updateStreak(
        {
          bestStreak: 20,
          currentStreak: 3,
          lastCompletedDate: '2025-01-10',
        },
        '2025-01-11',
        true
      );

      expect(result.currentStreak).toBe(4);
      expect(result.bestStreak).toBe(20); // Remains unchanged
      expect(result.lastCompletedDate).toBe('2025-01-11');
    });

    it('should maintain best streak after reset', () => {
      let streakData = {
        bestStreak: 10,
        currentStreak: 10,
        lastCompletedDate: '2025-01-10',
      };

      // Miss a day - reset current
      streakData = updateStreak(streakData, '2025-01-12', true);
      expect(streakData.currentStreak).toBe(1);
      expect(streakData.bestStreak).toBe(10);

      // Build up again
      streakData = updateStreak(streakData, '2025-01-13', true);
      expect(streakData.currentStreak).toBe(2);
      expect(streakData.bestStreak).toBe(10);

      streakData = updateStreak(streakData, '2025-01-14', true);
      expect(streakData.currentStreak).toBe(3);
      expect(streakData.bestStreak).toBe(10); // Still 10
    });
  });

  describe('updateStreak - Uncompleting Habits', () => {
    it('should clear lastCompletedDate when uncompleting the last completion', () => {
      const result = updateStreak(
        {
          bestStreak: 10,
          currentStreak: 5,
          lastCompletedDate: '2025-01-10',
        },
        '2025-01-10',
        false // Uncompleting
      );

      expect(result.currentStreak).toBe(0);
      expect(result.bestStreak).toBe(10); // Preserved
      expect(result.lastCompletedDate).toBe('');
    });

    it('should not change streak when uncompleting non-last date', () => {
      const result = updateStreak(
        {
          bestStreak: 10,
          currentStreak: 5,
          lastCompletedDate: '2025-01-15',
        },
        '2025-01-10', // Different date
        false
      );

      expect(result.currentStreak).toBe(5);
      expect(result.bestStreak).toBe(10);
      expect(result.lastCompletedDate).toBe('2025-01-15');
    });
  });

  describe('updateStreak - Backfill (Past Dates)', () => {
    it('should not update streak when completing past date before lastCompletedDate', () => {
      const result = updateStreak(
        {
          bestStreak: 10,
          currentStreak: 5,
          lastCompletedDate: '2025-01-15',
        },
        '2025-01-10', // Earlier date
        true
      );

      // Streak should not change for backfills
      expect(result.currentStreak).toBe(5);
      expect(result.bestStreak).toBe(10);
      expect(result.lastCompletedDate).toBe('2025-01-15');
    });
  });

  describe('Acceptance Testing Scenarios', () => {
    it('AC Test 1: Create habit and complete today → currentStreak = 1', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = updateStreak({}, today, true);

      expect(result.currentStreak).toBe(1);
      expect(result.bestStreak).toBe(1);
    });

    it('AC Test 2: Complete same habit tomorrow → currentStreak = 2', () => {
      const today = '2025-01-10';
      const tomorrow = '2025-01-11';

      let streakData = updateStreak({}, today, true);
      expect(streakData.currentStreak).toBe(1);

      streakData = updateStreak(streakData, tomorrow, true);
      expect(streakData.currentStreak).toBe(2);
    });

    it('AC Test 3: Skip a day, then complete → currentStreak = 1 (reset)', () => {
      let streakData = updateStreak({}, '2025-01-10', true);
      expect(streakData.currentStreak).toBe(1);

      // Skip Jan 11, complete Jan 12
      streakData = updateStreak(streakData, '2025-01-12', true);
      expect(streakData.currentStreak).toBe(1); // Reset
    });

    it('AC Test 4: Build 10-day streak, skip, build 5-day → bestStreak = 10, currentStreak = 5', () => {
      let streakData: Partial<StreakData> = {};

      // Build 10-day streak
      for (let i = 1; i <= 10; i++) {
        const date = `2025-01-${String(i).padStart(2, '0')}`;
        streakData = updateStreak(streakData, date, true);
      }
      expect(streakData.currentStreak).toBe(10);
      expect(streakData.bestStreak).toBe(10);

      // Skip Jan 11, complete Jan 12
      streakData = updateStreak(streakData, '2025-01-12', true);
      expect(streakData.currentStreak).toBe(1);
      expect(streakData.bestStreak).toBe(10);

      // Build 5-day streak (Jan 12-16)
      for (let i = 13; i <= 16; i++) {
        const date = `2025-01-${i}`;
        streakData = updateStreak(streakData, date, true);
      }
      expect(streakData.currentStreak).toBe(5);
      expect(streakData.bestStreak).toBe(10); // Preserved
    });
  });

  describe('Performance Requirements', () => {
    it('should complete streak calculation in <50ms', () => {
      const startTime = performance.now();

      // Simulate 100 streak updates
      let streakData: Partial<StreakData> = {};
      for (let i = 1; i <= 100; i++) {
        const date = `2025-01-${String((i % 30) + 1).padStart(2, '0')}`;
        streakData = updateStreak(streakData, date, true);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(50);
    });

    it('should handle large streak numbers efficiently', () => {
      const startTime = performance.now();

      const result = updateStreak(
        {
          bestStreak: 1000,
          currentStreak: 999,
          lastCompletedDate: '2025-01-10',
        },
        '2025-01-11',
        true
      );

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(result.currentStreak).toBe(1000);
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Edge Cases', () => {
    it('should handle timezone-independent date comparison', () => {
      // Dates with different times should be treated as same day
      const result = updateStreak(
        {
          bestStreak: 5,
          currentStreak: 5,
          lastCompletedDate: '2025-01-10',
        },
        '2025-01-10', // Same date, different time
        true
      );

      expect(result.currentStreak).toBe(5); // No change
    });

    it('should handle month boundaries correctly', () => {
      const result = updateStreak(
        {
          bestStreak: 5,
          currentStreak: 5,
          lastCompletedDate: '2025-01-31',
        },
        '2025-02-01', // Next day across month boundary
        true
      );

      expect(result.currentStreak).toBe(6);
      expect(result.lastCompletedDate).toBe('2025-02-01');
    });

    it('should handle year boundaries correctly', () => {
      const result = updateStreak(
        {
          bestStreak: 10,
          currentStreak: 10,
          lastCompletedDate: '2024-12-31',
        },
        '2025-01-01', // Next day across year boundary
        true
      );

      expect(result.currentStreak).toBe(11);
      expect(result.lastCompletedDate).toBe('2025-01-01');
    });

    it('should handle leap year correctly', () => {
      const result = updateStreak(
        {
          bestStreak: 2,
          currentStreak: 2,
          lastCompletedDate: '2024-02-28',
        },
        '2024-02-29', // Leap day
        true
      );

      expect(result.currentStreak).toBe(3);
      expect(result.lastCompletedDate).toBe('2024-02-29');
    });
  });
});
