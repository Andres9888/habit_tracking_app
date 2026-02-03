/**
 * useHabitStrength Hook Tests
 * Tests habit strength calculation with exponential smoothing algorithm
 *
 * Based on Loop Habit Tracker algorithm:
 * - Growth: strength + (1 - strength) * 0.05
 * - Decay: strength * 0.95
 * - Reaches ~100% after 60-90 days of perfect consistency
 */

import { renderHook } from '@testing-library/react-native';
import { useHabitStrength } from '../useHabitStrength';
import { subDays, format } from 'date-fns';

describe('useHabitStrength', () => {
  const now = new Date('2024-02-01T12:00:00Z');
  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(now);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initialization', () => {
    it('returns zero strength for empty completion set', () => {
      const completedDates = new Set<string>();
      const habitCreatedAt = subDays(now, 30).getTime();

      const { result } = renderHook(() =>
        useHabitStrength(completedDates, habitCreatedAt)
      );

      expect(result.current.currentStrength).toBe(0);
      expect(result.current.strengthHistory.length).toBeGreaterThan(0); // Timeline exists even with no completions
      expect(
        result.current.strengthHistory.every((entry) => entry.strength === 0)
      ).toBe(true);
      expect(result.current.metrics.current).toBe(0);
      expect(result.current.isCalculating).toBe(false);
    });

    it('handles invalid habitCreatedAt timestamp', () => {
      const completedDates = new Set(['2024-01-15']);
      const invalidTimestamp = NaN;

      const { result } = renderHook(() =>
        useHabitStrength(completedDates, invalidTimestamp)
      );

      // Should not crash and return valid data
      expect(result.current.currentStrength).toBeGreaterThanOrEqual(0);
      expect(result.current.metrics).toBeDefined();
    });
  });

  describe('consecutive completions', () => {
    it('builds strength with consecutive daily completions', () => {
      const completedDates = new Set([
        formatDate(subDays(now, 7)),
        formatDate(subDays(now, 6)),
        formatDate(subDays(now, 5)),
        formatDate(subDays(now, 4)),
        formatDate(subDays(now, 3)),
        formatDate(subDays(now, 2)),
        formatDate(subDays(now, 1)),
      ]);
      const habitCreatedAt = subDays(now, 30).getTime();

      const { result } = renderHook(() =>
        useHabitStrength(completedDates, habitCreatedAt)
      );

      expect(result.current.currentStrength).toBeGreaterThan(0);
      expect(result.current.strengthHistory.length).toBeGreaterThan(0);
    });
  });

  describe('metrics calculation', () => {
    it('calculates peak and lowest from history', () => {
      const completedDates = new Set([
        formatDate(subDays(now, 20)),
        formatDate(subDays(now, 19)),
        formatDate(subDays(now, 18)),
        formatDate(subDays(now, 2)),
        formatDate(subDays(now, 1)),
      ]);
      const habitCreatedAt = subDays(now, 30).getTime();

      const { result } = renderHook(() =>
        useHabitStrength(completedDates, habitCreatedAt)
      );

      expect(result.current.metrics.peak).toBeGreaterThan(0);
      expect(result.current.metrics.lowest).toBeGreaterThanOrEqual(0);
      expect(result.current.metrics.peak).toBeGreaterThanOrEqual(
        result.current.metrics.lowest
      );
    });
  });
});
