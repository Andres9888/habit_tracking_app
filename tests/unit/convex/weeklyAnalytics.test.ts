/**
 * Weekly Analytics Helpers Tests
 * Tests for weekly insights calculations
 */

import {
  calculateHabitChanges,
  categorizeHabitChanges,
  calculateWeekOverWeekChange,
} from '../../../convex/analytics/weeklyHelpers';
import type { HabitChange } from '../../../convex/analytics/types';

// Test constants
const oneWeekAgo = new Date('2025-01-08');
const twoWeeksAgo = new Date('2025-01-01');

const createMockHabit = (id: string, name: string, icon?: string) => ({
  _id: id as any,
  name,
  icon,
});

describe('Weekly Analytics Helpers', () => {
  describe('calculateHabitChanges', () => {
    it('should calculate correct changes for improved habit', () => {
      const habit = createMockHabit('habit-run', 'Running', '🏃');
      const trackings = [
        // This week (Jan 8-14)
        { habitId: 'habit-run', date: '2025-01-10', completed: true },
        { habitId: 'habit-run', date: '2025-01-11', completed: true },
        { habitId: 'habit-run', date: '2025-01-12', completed: true },
        { habitId: 'habit-run', date: '2025-01-13', completed: true },
        // Last week (Jan 1-7)
        { habitId: 'habit-run', date: '2025-01-02', completed: true },
        { habitId: 'habit-run', date: '2025-01-03', completed: true },
        { habitId: 'habit-run', date: '2025-01-04', completed: true },
      ];
      
      const result = calculateHabitChanges(
        habit,
        trackings,
        oneWeekAgo,
        twoWeeksAgo,
        4
      );

      expect(result.name).toBe('Running');
      expect(result.emoji).toBe('🏃');
      expect(result.thisWeek).toBe(4); // Jan 10, 11, 12, 13
      expect(result.lastWeek).toBe(3); // Jan 2, 3, 4
      expect(result.change).toBe(1);
      expect(result.percentageChange).toBeCloseTo(33.33, 1);
      expect(result.currentStreak).toBe(4);
    });

    it('should calculate correct changes for decreased habit', () => {
      const habit = createMockHabit('habit-read', 'Reading', '📚');
      const trackings = [
        // This week - no completions
        // Last week (Jan 1-7)
        { habitId: 'habit-read', date: '2025-01-05', completed: true },
        { habitId: 'habit-read', date: '2025-01-06', completed: true },
        { habitId: 'habit-read', date: '2025-01-07', completed: true },
      ];
      
      const result = calculateHabitChanges(
        habit,
        trackings,
        oneWeekAgo,
        twoWeeksAgo,
        0
      );

      expect(result.thisWeek).toBe(0); // No completions this week
      expect(result.lastWeek).toBe(3); // Jan 5, 6, 7
      expect(result.change).toBe(-3);
      expect(result.percentageChange).toBe(-100);
    });

    it('should handle 100% increase from zero', () => {
      const habit = createMockHabit('habit-new', 'New Habit', '⭐');
      const trackings = [
        // This week
        { habitId: 'habit-new', date: '2025-01-10', completed: true },
        // Last week - no completions
      ];
      
      const result = calculateHabitChanges(
        habit,
        trackings,
        oneWeekAgo,
        twoWeeksAgo,
        1
      );

      expect(result.thisWeek).toBe(1);
      expect(result.lastWeek).toBe(0);
      expect(result.change).toBe(1);
      expect(result.percentageChange).toBe(100);
    });

    it('should handle no completions in either week', () => {
      const habit = createMockHabit('habit-never', 'Never Done', '❌');
      const trackings: any[] = [];
      
      const result = calculateHabitChanges(
        habit,
        trackings,
        oneWeekAgo,
        twoWeeksAgo,
        0
      );

      expect(result.thisWeek).toBe(0);
      expect(result.lastWeek).toBe(0);
      expect(result.change).toBe(0);
      expect(result.percentageChange).toBe(0);
    });

    it('should handle missing icon gracefully', () => {
      const habit = createMockHabit('habit-no-icon', 'No Icon');
      const trackings: any[] = [];
      
      const result = calculateHabitChanges(
        habit,
        trackings,
        oneWeekAgo,
        twoWeeksAgo,
        0
      );

      expect(result.emoji).toBe('🎯'); // Default icon
    });
  });

  describe('categorizeHabitChanges', () => {
    const createHabitChange = (overrides: Partial<HabitChange> = {}): HabitChange => ({
      habitId: 'test' as any,
      name: 'Test',
      thisWeek: 5,
      lastWeek: 3,
      change: 2,
      percentageChange: 66.67,
      currentStreak: 7,
      emoji: '🎯',
      ...overrides,
    });

    it('should categorize habits with positive change as gainedStrength', () => {
      const changes = [
        createHabitChange({ change: 5, percentageChange: 100 }),
        createHabitChange({ change: 2, percentageChange: 50 }),
        createHabitChange({ change: -1, percentageChange: -20 }),
      ];

      const result = categorizeHabitChanges(changes);
      
      expect(result.gainedStrength).toHaveLength(2);
      expect(result.gainedStrength[0].percentageChange).toBe(100);
    });

    it('should categorize habits with negative change as lostStrength', () => {
      const changes = [
        createHabitChange({ change: -3, percentageChange: -50 }),
        createHabitChange({ change: -1, percentageChange: -25 }),
      ];

      const result = categorizeHabitChanges(changes);
      
      expect(result.lostStrength).toHaveLength(2);
    });

    it('should limit top results to 3 each', () => {
      const changes = Array.from({ length: 10 }, (_, i) =>
        createHabitChange({ 
          habitId: `habit-${i}` as any, 
          change: i - 5,
          percentageChange: (i - 5) * 10,
        })
      );

      const result = categorizeHabitChanges(changes);
      
      expect(result.gainedStrength).toHaveLength(3);
      expect(result.lostStrength).toHaveLength(3);
    });

    it('should identify at-risk habits', () => {
      const changes = [
        createHabitChange({ thisWeek: 2, change: -1, currentStreak: 5 }), // At risk: low completions
        createHabitChange({ thisWeek: 5, change: -2, currentStreak: 3 }), // At risk: declining with low streak
        createHabitChange({ thisWeek: 6, change: 1, currentStreak: 10 }), // Not at risk
      ];

      const result = categorizeHabitChanges(changes);
      
      expect(result.atRisk.length).toBeGreaterThan(0);
    });
  });

  describe('calculateWeekOverWeekChange', () => {
    it('should calculate positive change correctly', () => {
      const habitChanges = [
        { thisWeek: 5, lastWeek: 3 },
        { thisWeek: 3, lastWeek: 2 },
        { thisWeek: 2, lastWeek: 5 },
      ] as any[];

      const result = calculateWeekOverWeekChange(habitChanges);

      expect(result.totalCompletionsThisWeek).toBe(10);
      expect(result.totalCompletionsLastWeek).toBe(10);
      expect(result.weekOverWeekChange).toBe(0);
    });

    it('should calculate negative change correctly', () => {
      const habitChanges = [
        { thisWeek: 2, lastWeek: 5 },
        { thisWeek: 1, lastWeek: 3 },
      ] as any[];

      const result = calculateWeekOverWeekChange(habitChanges);

      expect(result.totalCompletionsThisWeek).toBe(3);
      expect(result.totalCompletionsLastWeek).toBe(8);
      expect(result.weekOverWeekChange).toBe(-62.5);
    });

    it('should handle zero last week completions', () => {
      const habitChanges = [
        { thisWeek: 5, lastWeek: 0 },
      ] as any[];

      const result = calculateWeekOverWeekChange(habitChanges);

      expect(result.totalCompletionsThisWeek).toBe(5);
      expect(result.totalCompletionsLastWeek).toBe(0);
      expect(result.weekOverWeekChange).toBe(0);
    });

    it('should handle empty array', () => {
      const habitChanges: any[] = [];

      const result = calculateWeekOverWeekChange(habitChanges);

      expect(result.totalCompletionsThisWeek).toBe(0);
      expect(result.totalCompletionsLastWeek).toBe(0);
      expect(result.weekOverWeekChange).toBe(0);
    });
  });
});
