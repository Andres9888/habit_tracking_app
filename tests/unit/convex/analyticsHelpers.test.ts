/**
 * Analytics Helpers Tests
 * Tests for analytics calculation utilities
 */

import {
  calculateHabitStrength,
  getDateString,
  getDaysAgo,
  getCompletionLevel,
} from '../../../convex/analytics/helpers';

// Mock Doc type since we're testing pure functions
const createMockHabit = (overrides: any = {}) => ({
  _id: 'test-id' as any,
  userId: 'user-1',
  name: 'Test Habit',
  createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  strength: 0.5,
  ...overrides,
});

describe('Analytics Helpers', () => {
  describe('calculateHabitStrength', () => {
    it('should return stored strength * 100 when available', () => {
      const habit = createMockHabit({ strength: 0.75 });
      expect(calculateHabitStrength(habit)).toBe(75);
    });

    it('should calculate from completion rate when no stored strength', () => {
      const habit = createMockHabit({ strength: undefined });
      expect(calculateHabitStrength(habit, 0.5)).toBe(50);
    });

    it('should handle zero strength', () => {
      const habit = createMockHabit({ strength: 0 });
      expect(calculateHabitStrength(habit)).toBe(0);
    });

    it('should handle full strength', () => {
      const habit = createMockHabit({ strength: 1 });
      expect(calculateHabitStrength(habit)).toBe(100);
    });

    it('should handle null completion rate', () => {
      const habit = createMockHabit({ strength: undefined });
      expect(calculateHabitStrength(habit)).toBe(0);
    });
  });

  describe('getDateString', () => {
    it('should return YYYY-MM-DD format', () => {
      const date = new Date('2025-01-15T12:00:00Z');
      expect(getDateString(date)).toBe('2025-01-15');
    });

    it('should handle different times on same day', () => {
      const morning = new Date('2025-01-15T08:00:00Z');
      const evening = new Date('2025-01-15T23:59:59Z');
      expect(getDateString(morning)).toBe(getDateString(evening));
    });
  });

  describe('getDaysAgo', () => {
    it('should return date N days ago', () => {
      const daysAgo = getDaysAgo(7);
      const expected = new Date();
      expected.setDate(expected.getDate() - 7);
      expected.setHours(0, 0, 0, 0);
      expect(daysAgo.getTime()).toBe(expected.getTime());
    });

    it('should handle zero days ago', () => {
      const today = getDaysAgo(0);
      const expected = new Date();
      expected.setHours(0, 0, 0, 0);
      expect(today.getTime()).toBe(expected.getTime());
    });

    it('should handle large number of days', () => {
      const daysAgo = getDaysAgo(365);
      const expected = new Date();
      expected.setDate(expected.getDate() - 365);
      expected.setHours(0, 0, 0, 0);
      expect(daysAgo.getTime()).toBe(expected.getTime());
    });
  });

  describe('getCompletionLevel', () => {
    it('should return "none" for 0%', () => {
      expect(getCompletionLevel(0)).toBe('none');
    });

    it('should return "none" for negative values', () => {
      expect(getCompletionLevel(-1)).toBe('none');
    });

    it('should return "low" for 1-39%', () => {
      expect(getCompletionLevel(1)).toBe('low');
      expect(getCompletionLevel(25)).toBe('low');
      expect(getCompletionLevel(39)).toBe('low');
    });

    it('should return "medium" for 40-69%', () => {
      expect(getCompletionLevel(40)).toBe('medium');
      expect(getCompletionLevel(55)).toBe('medium');
      expect(getCompletionLevel(69)).toBe('medium');
    });

    it('should return "high" for 70-100%', () => {
      expect(getCompletionLevel(70)).toBe('high');
      expect(getCompletionLevel(85)).toBe('high');
      expect(getCompletionLevel(100)).toBe('high');
    });
  });
});
