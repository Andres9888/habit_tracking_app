/**
 * Streak Calculator Tests
 *
 * Tests for local streak calculation during offline mode.
 * Ensures parity with server-side calculation from convex/streakUtils.
 *
 * Implements test coverage for:
 * - FR-007: Update local streak/completion counts immediately (optimistic)
 * - SC-001: Habit completion with feedback in under 200ms regardless of connectivity
 */

import {
  calculateBestStreakFromDates,
  calculateOfflineStreak,
  calculateStreakFromHistory,
  computeCurrentStreakFromDates,
  mergeTrackingWithPending,
} from './streakCalculator';
import type { PendingToggleOperation, TrackingRecord } from './types';

describe('streakCalculator', () => {
  describe('mergeTrackingWithPending', () => {
    it('returns server tracking when no pending operations', () => {
      const serverTracking: TrackingRecord[] = [
        { date: '2026-01-28', completed: true },
        { date: '2026-01-29', completed: true },
        { date: '2026-01-30', completed: false },
      ];

      const result = mergeTrackingWithPending(serverTracking, []);

      expect(result).toHaveLength(3);
      expect(result.find((r) => r.date === '2026-01-28')?.completed).toBe(true);
      expect(result.find((r) => r.date === '2026-01-29')?.completed).toBe(true);
      expect(result.find((r) => r.date === '2026-01-30')?.completed).toBe(
        false
      );
    });

    it('applies pending operations to override server state', () => {
      const serverTracking: TrackingRecord[] = [
        { date: '2026-01-29', completed: true },
        { date: '2026-01-30', completed: false },
      ];
      const pendingOperations: PendingToggleOperation[] = [
        { date: '2026-01-30', toCompleted: true },
      ];

      const result = mergeTrackingWithPending(
        serverTracking,
        pendingOperations
      );

      expect(result.find((r) => r.date === '2026-01-30')?.completed).toBe(true);
    });

    it('adds new dates from pending operations', () => {
      const serverTracking: TrackingRecord[] = [
        { date: '2026-01-29', completed: true },
      ];
      const pendingOperations: PendingToggleOperation[] = [
        { date: '2026-01-30', toCompleted: true },
      ];

      const result = mergeTrackingWithPending(
        serverTracking,
        pendingOperations
      );

      expect(result).toHaveLength(2);
      expect(result.find((r) => r.date === '2026-01-30')?.completed).toBe(true);
    });

    it('later pending operations override earlier ones for same date', () => {
      const serverTracking: TrackingRecord[] = [];
      const pendingOperations: PendingToggleOperation[] = [
        { date: '2026-01-30', toCompleted: true },
        { date: '2026-01-30', toCompleted: false },
        { date: '2026-01-30', toCompleted: true },
      ];

      const result = mergeTrackingWithPending(
        serverTracking,
        pendingOperations
      );

      expect(result).toHaveLength(1);
      expect(result[0].completed).toBe(true);
    });

    it('handles empty server tracking with pending operations', () => {
      const serverTracking: TrackingRecord[] = [];
      const pendingOperations: PendingToggleOperation[] = [
        { date: '2026-01-28', toCompleted: true },
        { date: '2026-01-29', toCompleted: true },
        { date: '2026-01-30', toCompleted: true },
      ];

      const result = mergeTrackingWithPending(
        serverTracking,
        pendingOperations
      );

      expect(result).toHaveLength(3);
      expect(result.every((r) => r.completed)).toBe(true);
    });
  });

  describe('calculateBestStreakFromDates', () => {
    it('returns 0 for empty array', () => {
      expect(calculateBestStreakFromDates([])).toBe(0);
    });

    it('returns 1 for single date', () => {
      expect(calculateBestStreakFromDates(['2026-01-30'])).toBe(1);
    });

    it('counts consecutive days correctly', () => {
      const dates = ['2026-01-28', '2026-01-29', '2026-01-30'];
      expect(calculateBestStreakFromDates(dates)).toBe(3);
    });

    it('finds best streak in non-consecutive history', () => {
      // Gap between 25 and 28
      const dates = [
        '2026-01-23',
        '2026-01-24',
        '2026-01-25',
        '2026-01-28',
        '2026-01-29',
      ];
      expect(calculateBestStreakFromDates(dates)).toBe(3); // 23-24-25
    });

    it('handles unsorted input', () => {
      const dates = ['2026-01-30', '2026-01-28', '2026-01-29'];
      expect(calculateBestStreakFromDates(dates)).toBe(3);
    });

    it('handles duplicate dates', () => {
      const dates = ['2026-01-29', '2026-01-29', '2026-01-30'];
      expect(calculateBestStreakFromDates(dates)).toBe(2);
    });

    it('handles isolated dates (no consecutive)', () => {
      const dates = ['2026-01-20', '2026-01-25', '2026-01-30'];
      expect(calculateBestStreakFromDates(dates)).toBe(1);
    });

    it('finds streak at end of history', () => {
      const dates = ['2026-01-20', '2026-01-28', '2026-01-29', '2026-01-30'];
      expect(calculateBestStreakFromDates(dates)).toBe(3);
    });
  });

  describe('calculateStreakFromHistory', () => {
    const todayDate = '2026-01-30';

    it('returns zeros for empty tracking', () => {
      const result = calculateStreakFromHistory([], todayDate);

      expect(result).toEqual({
        currentStreak: 0,
        bestStreak: 0,
        lastCompletedDate: '',
      });
    });

    it('returns zeros for no completed records', () => {
      const tracking: TrackingRecord[] = [
        { date: '2026-01-28', completed: false },
        { date: '2026-01-29', completed: false },
      ];

      const result = calculateStreakFromHistory(tracking, todayDate);

      expect(result).toEqual({
        currentStreak: 0,
        bestStreak: 0,
        lastCompletedDate: '',
      });
    });

    it('calculates current streak when completed today', () => {
      const tracking: TrackingRecord[] = [
        { date: '2026-01-28', completed: true },
        { date: '2026-01-29', completed: true },
        { date: '2026-01-30', completed: true },
      ];

      const result = calculateStreakFromHistory(tracking, todayDate);

      expect(result.currentStreak).toBe(3);
      expect(result.lastCompletedDate).toBe('2026-01-30');
    });

    it('calculates current streak when completed yesterday (grace period)', () => {
      const tracking: TrackingRecord[] = [
        { date: '2026-01-27', completed: true },
        { date: '2026-01-28', completed: true },
        { date: '2026-01-29', completed: true },
      ];

      const result = calculateStreakFromHistory(tracking, todayDate);

      expect(result.currentStreak).toBe(3);
      expect(result.lastCompletedDate).toBe('2026-01-29');
    });

    it('returns 0 current streak when last completion > 1 day ago', () => {
      const tracking: TrackingRecord[] = [
        { date: '2026-01-26', completed: true },
        { date: '2026-01-27', completed: true },
        { date: '2026-01-28', completed: true },
      ];

      const result = calculateStreakFromHistory(tracking, todayDate);

      expect(result.currentStreak).toBe(0);
      expect(result.bestStreak).toBe(3);
      expect(result.lastCompletedDate).toBe('2026-01-28');
    });

    it('calculates best streak greater than current streak', () => {
      const tracking: TrackingRecord[] = [
        // Historical 5-day streak
        { date: '2026-01-10', completed: true },
        { date: '2026-01-11', completed: true },
        { date: '2026-01-12', completed: true },
        { date: '2026-01-13', completed: true },
        { date: '2026-01-14', completed: true },
        // Gap
        // Current 2-day streak
        { date: '2026-01-29', completed: true },
        { date: '2026-01-30', completed: true },
      ];

      const result = calculateStreakFromHistory(tracking, todayDate);

      expect(result.currentStreak).toBe(2);
      expect(result.bestStreak).toBe(5);
    });

    it('updates best streak when current streak exceeds historical', () => {
      const tracking: TrackingRecord[] = [
        // Historical 2-day streak
        { date: '2026-01-10', completed: true },
        { date: '2026-01-11', completed: true },
        // Gap
        // Current 5-day streak
        { date: '2026-01-26', completed: true },
        { date: '2026-01-27', completed: true },
        { date: '2026-01-28', completed: true },
        { date: '2026-01-29', completed: true },
        { date: '2026-01-30', completed: true },
      ];

      const result = calculateStreakFromHistory(tracking, todayDate);

      expect(result.currentStreak).toBe(5);
      expect(result.bestStreak).toBe(5);
    });

    it('handles single completion today', () => {
      const tracking: TrackingRecord[] = [
        { date: '2026-01-30', completed: true },
      ];

      const result = calculateStreakFromHistory(tracking, todayDate);

      expect(result.currentStreak).toBe(1);
      expect(result.bestStreak).toBe(1);
      expect(result.lastCompletedDate).toBe('2026-01-30');
    });

    it('ignores incomplete records in streak calculation', () => {
      const tracking: TrackingRecord[] = [
        { date: '2026-01-27', completed: true },
        { date: '2026-01-28', completed: false }, // Gap!
        { date: '2026-01-29', completed: true },
        { date: '2026-01-30', completed: true },
      ];

      const result = calculateStreakFromHistory(tracking, todayDate);

      expect(result.currentStreak).toBe(2); // Only 29-30
      expect(result.bestStreak).toBe(2);
    });
  });

  describe('calculateOfflineStreak', () => {
    const todayDate = '2026-01-30';

    it('calculates streak with only server tracking', () => {
      const serverTracking: TrackingRecord[] = [
        { date: '2026-01-28', completed: true },
        { date: '2026-01-29', completed: true },
        { date: '2026-01-30', completed: true },
      ];

      const result = calculateOfflineStreak(serverTracking, [], todayDate);

      expect(result.currentStreak).toBe(3);
    });

    it('extends streak with pending completion', () => {
      const serverTracking: TrackingRecord[] = [
        { date: '2026-01-28', completed: true },
        { date: '2026-01-29', completed: true },
        { date: '2026-01-30', completed: false },
      ];
      const pendingOperations: PendingToggleOperation[] = [
        { date: '2026-01-30', toCompleted: true },
      ];

      const result = calculateOfflineStreak(
        serverTracking,
        pendingOperations,
        todayDate
      );

      expect(result.currentStreak).toBe(3);
    });

    it('breaks streak with pending uncompletion', () => {
      const serverTracking: TrackingRecord[] = [
        { date: '2026-01-28', completed: true },
        { date: '2026-01-29', completed: true },
        { date: '2026-01-30', completed: true },
      ];
      const pendingOperations: PendingToggleOperation[] = [
        { date: '2026-01-29', toCompleted: false }, // Breaks the chain!
      ];

      const result = calculateOfflineStreak(
        serverTracking,
        pendingOperations,
        todayDate
      );

      expect(result.currentStreak).toBe(1); // Only 1/30
    });

    it('calculates from scratch with only pending operations', () => {
      const pendingOperations: PendingToggleOperation[] = [
        { date: '2026-01-28', toCompleted: true },
        { date: '2026-01-29', toCompleted: true },
        { date: '2026-01-30', toCompleted: true },
      ];

      const result = calculateOfflineStreak([], pendingOperations, todayDate);

      expect(result.currentStreak).toBe(3);
      expect(result.bestStreak).toBe(3);
    });

    it('handles rapid toggle operations correctly', () => {
      // User toggles same day multiple times offline
      const serverTracking: TrackingRecord[] = [];
      const pendingOperations: PendingToggleOperation[] = [
        { date: '2026-01-30', toCompleted: true },
        { date: '2026-01-30', toCompleted: false },
        { date: '2026-01-30', toCompleted: true }, // Final state: completed
      ];

      const result = calculateOfflineStreak(
        serverTracking,
        pendingOperations,
        todayDate
      );

      expect(result.currentStreak).toBe(1);
    });
  });

  describe('computeCurrentStreakFromDates', () => {
    const todayDate = '2026-01-30';

    it('returns 0 for empty set', () => {
      expect(computeCurrentStreakFromDates(new Set(), todayDate)).toBe(0);
    });

    it('returns 0 for null/undefined set', () => {
      expect(
        computeCurrentStreakFromDates(null as unknown as Set<string>, todayDate)
      ).toBe(0);
    });

    it('counts streak from most recent completion', () => {
      const completedDates = new Set([
        '2026-01-28',
        '2026-01-29',
        '2026-01-30',
      ]);

      expect(computeCurrentStreakFromDates(completedDates, todayDate)).toBe(3);
    });

    it('ignores future dates', () => {
      const completedDates = new Set([
        '2026-01-30',
        '2026-01-31', // Future (if today is 1/30)
        '2026-02-01', // Future
      ]);

      expect(computeCurrentStreakFromDates(completedDates, todayDate)).toBe(1);
    });

    it('handles gaps correctly', () => {
      const completedDates = new Set([
        '2026-01-25',
        '2026-01-26',
        // Gap on 27
        '2026-01-28',
        '2026-01-29',
        '2026-01-30',
      ]);

      expect(computeCurrentStreakFromDates(completedDates, todayDate)).toBe(3);
    });

    it('respects maxLookbackDays limit', () => {
      // Create a very long streak
      const completedDates = new Set<string>();
      const date = new Date('2026-01-30');
      for (let i = 0; i < 50; i++) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        completedDates.add(`${year}-${month}-${day}`);
        date.setDate(date.getDate() - 1);
      }

      // With default limit, should count all
      expect(computeCurrentStreakFromDates(completedDates, todayDate)).toBe(50);

      // With small limit, should cap
      expect(computeCurrentStreakFromDates(completedDates, todayDate, 10)).toBe(
        10
      );
    });

    it('returns 0 when the most recent completion is older than yesterday', () => {
      const completedDates = new Set([
        '2026-01-20',
        '2026-01-21',
        '2026-01-22',
      ]);

      // Current streak stays active only if the last completion was today or yesterday.
      expect(computeCurrentStreakFromDates(completedDates, todayDate)).toBe(0);
    });

    it('handles single isolated completion', () => {
      const completedDates = new Set(['2026-01-30']);

      expect(computeCurrentStreakFromDates(completedDates, todayDate)).toBe(1);
    });
  });

  describe('parity with server-side calculation', () => {
    // These tests verify that our client-side calculation matches
    // the expected behavior of convex/streakUtils/historyCalculation.ts

    it('matches server behavior: streak maintained with yesterday completion', () => {
      const tracking: TrackingRecord[] = [
        { date: '2026-01-29', completed: true },
      ];
      const todayDate = '2026-01-30';

      const result = calculateStreakFromHistory(tracking, todayDate);

      // Server allows 1-day grace period
      expect(result.currentStreak).toBe(1);
    });

    it('matches server behavior: streak broken after 2+ days gap', () => {
      const tracking: TrackingRecord[] = [
        { date: '2026-01-27', completed: true }, // 3 days ago
      ];
      const todayDate = '2026-01-30';

      const result = calculateStreakFromHistory(tracking, todayDate);

      // Server breaks streak if gap > 1 day
      expect(result.currentStreak).toBe(0);
      expect(result.bestStreak).toBe(1);
    });

    it('matches server behavior: best streak preserved when current breaks', () => {
      const tracking: TrackingRecord[] = [
        // Old 10-day streak
        { date: '2026-01-01', completed: true },
        { date: '2026-01-02', completed: true },
        { date: '2026-01-03', completed: true },
        { date: '2026-01-04', completed: true },
        { date: '2026-01-05', completed: true },
        { date: '2026-01-06', completed: true },
        { date: '2026-01-07', completed: true },
        { date: '2026-01-08', completed: true },
        { date: '2026-01-09', completed: true },
        { date: '2026-01-10', completed: true },
        // Large gap, then recent activity
        { date: '2026-01-28', completed: true }, // 2 days ago - breaks current
      ];
      const todayDate = '2026-01-30';

      const result = calculateStreakFromHistory(tracking, todayDate);

      expect(result.currentStreak).toBe(0); // Broken (2 day gap)
      expect(result.bestStreak).toBe(10); // Historical streak preserved
    });
  });
});
