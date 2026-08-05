/**
 * ProgressSection Utility Functions Tests
 *
 * Tests for habit insights calculation functions.
 */

import {
  calculateDayOfWeekStats,
  calculateCurrentStreak,
  calculateStreakRecords,
  calculateTrendComparison,
  generateActionableTip,
  getBestAndWorstDays,
} from '../utils';
import type { HabitTrackingEntry } from '../../../features/habits/types';
import type { DayStats } from '../types';

// Helper to create tracking entries
function createTrackingEntry(
  date: string,
  completed: boolean
): HabitTrackingEntry {
  return {
    date,
    completed,
    timestamp: new Date(date).getTime(),
  };
}

// Helper to create a range of dates
function createDateRange(
  startDate: string,
  days: number,
  completedDays: number[]
): HabitTrackingEntry[] {
  const entries: HabitTrackingEntry[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    entries.push(createTrackingEntry(dateStr, completedDays.includes(i)));
  }

  return entries;
}

describe('calculateDayOfWeekStats', () => {
  it('should return stats for all 7 days of the week', () => {
    const result = calculateDayOfWeekStats([]);
    expect(result).toHaveLength(7);
    expect(result[0].day).toBe('Sun');
    expect(result[6].day).toBe('Sat');
  });

  it('should calculate correct rates for completed days', () => {
    // Create entries for two weeks with all Mondays completed
    const tracking: HabitTrackingEntry[] = [
      createTrackingEntry('2024-12-02', true), // Monday
      createTrackingEntry('2024-12-03', false), // Tuesday
      createTrackingEntry('2024-12-09', true), // Monday
      createTrackingEntry('2024-12-10', false), // Tuesday
    ];

    const result = calculateDayOfWeekStats(
      tracking,
      new Date('2024-12-02').getTime()
    );

    // Monday should have higher rate than Tuesday
    const monday = result.find((d) => d.day === 'Mon');
    const tuesday = result.find((d) => d.day === 'Tue');

    expect(monday?.rate).toBeGreaterThan(tuesday?.rate || 0);
  });

  it('should handle empty tracking array', () => {
    const result = calculateDayOfWeekStats([]);
    expect(result.every((d) => d.rate === 0)).toBe(true);
    expect(result.every((d) => d.total === 0 || d.completed === 0)).toBe(true);
  });

  it('should set dayIndex correctly for each day', () => {
    const result = calculateDayOfWeekStats([]);
    expect(result[0].dayIndex).toBe(0); // Sunday
    expect(result[1].dayIndex).toBe(1); // Monday
    expect(result[6].dayIndex).toBe(6); // Saturday
  });

  it('should count completions and totals correctly', () => {
    // 3 Sundays: 2 completed
    const tracking: HabitTrackingEntry[] = [
      createTrackingEntry('2024-12-01', true), // Sunday
      createTrackingEntry('2024-12-08', true), // Sunday
      createTrackingEntry('2024-12-15', false), // Sunday
    ];

    const result = calculateDayOfWeekStats(
      tracking,
      new Date('2024-12-01').getTime()
    );

    const sunday = result.find((d) => d.day === 'Sun');
    expect(sunday?.completed).toBe(2);
  });
});

describe('calculateCurrentStreak', () => {
  it('should return 0 for empty tracking', () => {
    expect(calculateCurrentStreak([])).toBe(0);
  });

  it('should return 0 if today and yesterday are not completed', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 2);

    const tracking = [createTrackingEntry(yesterday.toISOString().split('T')[0], true)];

    expect(calculateCurrentStreak(tracking)).toBe(0);
  });

  it('should count streak starting from today', () => {
    const today = new Date();
    const yesterday = new Date();
    const dayBefore = new Date();

    yesterday.setDate(today.getDate() - 1);
    dayBefore.setDate(today.getDate() - 2);

    const tracking = [
      createTrackingEntry(today.toISOString().split('T')[0], true),
      createTrackingEntry(yesterday.toISOString().split('T')[0], true),
      createTrackingEntry(dayBefore.toISOString().split('T')[0], true),
    ];

    expect(calculateCurrentStreak(tracking)).toBe(3);
  });

  it('should count streak starting from yesterday if today not completed', () => {
    const yesterday = new Date();
    const dayBefore = new Date();

    yesterday.setDate(yesterday.getDate() - 1);
    dayBefore.setDate(dayBefore.getDate() - 2);

    const tracking = [
      createTrackingEntry(yesterday.toISOString().split('T')[0], true),
      createTrackingEntry(dayBefore.toISOString().split('T')[0], true),
    ];

    expect(calculateCurrentStreak(tracking)).toBe(2);
  });

  it('should stop counting on gap', () => {
    const today = new Date();
    const yesterday = new Date();
    const threeDaysAgo = new Date();

    yesterday.setDate(today.getDate() - 1);
    threeDaysAgo.setDate(today.getDate() - 3);

    const tracking = [
      createTrackingEntry(today.toISOString().split('T')[0], true),
      createTrackingEntry(yesterday.toISOString().split('T')[0], true),
      // Gap on 2 days ago
      createTrackingEntry(threeDaysAgo.toISOString().split('T')[0], true),
    ];

    expect(calculateCurrentStreak(tracking)).toBe(2);
  });
});

describe('calculateStreakRecords', () => {
  it('should return empty array for empty tracking', () => {
    expect(calculateStreakRecords([], 0)).toEqual([]);
  });

  it('should return empty array if no streaks >= 2 days', () => {
    const tracking = [
      createTrackingEntry('2024-12-01', true),
      createTrackingEntry('2024-12-03', true), // Gap
      createTrackingEntry('2024-12-05', true), // Gap
    ];

    expect(calculateStreakRecords(tracking, 0)).toEqual([]);
  });

  it('should find streak records of 2+ days', () => {
    const tracking = [
      createTrackingEntry('2024-12-01', true),
      createTrackingEntry('2024-12-02', true),
      createTrackingEntry('2024-12-03', true),
      // Gap
      createTrackingEntry('2024-12-10', true),
      createTrackingEntry('2024-12-11', true),
    ];

    const records = calculateStreakRecords(tracking, 0);
    expect(records.length).toBeGreaterThan(0);
    expect(records[0].days).toBe(3); // Longest streak
  });

  it('should sort records by days descending', () => {
    const tracking = [
      createTrackingEntry('2024-12-01', true),
      createTrackingEntry('2024-12-02', true),
      // Gap
      createTrackingEntry('2024-12-10', true),
      createTrackingEntry('2024-12-11', true),
      createTrackingEntry('2024-12-12', true),
      createTrackingEntry('2024-12-13', true),
    ];

    const records = calculateStreakRecords(tracking, 0);
    expect(records[0].days).toBeGreaterThanOrEqual(records[1]?.days || 0);
  });

  it('should limit to top 5 records', () => {
    // Create 7 separate 2-day streaks
    const tracking: HabitTrackingEntry[] = [];
    for (let i = 0; i < 7; i++) {
      const base = i * 5;
      tracking.push(createTrackingEntry(`2024-12-${(base + 1).toString().padStart(2, '0')}`, true));
      tracking.push(createTrackingEntry(`2024-12-${(base + 2).toString().padStart(2, '0')}`, true));
    }

    const records = calculateStreakRecords(tracking, 0);
    expect(records.length).toBeLessThanOrEqual(5);
  });

  it('should mark current streak correctly', () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const tracking = [
      createTrackingEntry(yesterday.toISOString().split('T')[0], true),
      createTrackingEntry(today.toISOString().split('T')[0], true),
    ];

    const records = calculateStreakRecords(tracking, 2);
    expect(records.some((r) => r.isCurrent)).toBe(true);
  });
});

describe('calculateTrendComparison', () => {
  it('should return 0 for all values with empty tracking', () => {
    const result = calculateTrendComparison([]);
    expect(result.thisMonth).toBe(0);
    expect(result.lastMonth).toBe(0);
    expect(result.change).toBe(0);
  });

  it('should calculate positive change when this month is better', () => {
    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    // Create entries - all completed this month
    const tracking: HabitTrackingEntry[] = [];
    for (let i = 1; i <= 10; i++) {
      const date = new Date(thisYear, thisMonth, i);
      if (date <= today) {
        tracking.push(createTrackingEntry(date.toISOString().split('T')[0], true));
      }
    }

    // Add incomplete entries from last month
    for (let i = 1; i <= 15; i++) {
      const date = new Date(thisYear, thisMonth - 1, i);
      tracking.push(
        createTrackingEntry(date.toISOString().split('T')[0], i <= 5) // Only first 5 completed
      );
    }

    const result = calculateTrendComparison(tracking);
    expect(result.change).toBeGreaterThan(0);
  });

  it('should calculate negative change when this month is worse', () => {
    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    // Create entries - few completed this month
    const tracking: HabitTrackingEntry[] = [];
    for (let i = 1; i <= 10; i++) {
      const date = new Date(thisYear, thisMonth, i);
      if (date <= today) {
        tracking.push(
          createTrackingEntry(date.toISOString().split('T')[0], i <= 2) // Only first 2
        );
      }
    }

    // Add more completed entries from last month
    for (let i = 1; i <= 15; i++) {
      const date = new Date(thisYear, thisMonth - 1, i);
      tracking.push(createTrackingEntry(date.toISOString().split('T')[0], true)); // All completed
    }

    const result = calculateTrendComparison(tracking);
    expect(result.change).toBeLessThan(0);
  });
});

describe('generateActionableTip', () => {
  const createDayStats = (
    day: string,
    dayIndex: number,
    rate: number,
    total: number = 10
  ): DayStats => ({
    day,
    dayIndex,
    rate,
    completed: Math.round((rate / 100) * total),
    total,
  });

  const allDaysStats: DayStats[] = [
    createDayStats('Sun', 0, 80),
    createDayStats('Mon', 1, 85),
    createDayStats('Tue', 2, 90),
    createDayStats('Wed', 3, 75),
    createDayStats('Thu', 4, 80),
    createDayStats('Fri', 5, 70),
    createDayStats('Sat', 6, 60),
  ];

  it('should encourage user with good streak (>= 7 days)', () => {
    const tip = generateActionableTip(allDaysStats, 7);
    expect(tip).toBe('Amazing streak! Keep the momentum going.');
  });

  it('should suggest focusing on weak days when present', () => {
    const weakDaysStats = [
      createDayStats('Sun', 0, 50),
      createDayStats('Mon', 1, 40),
      createDayStats('Tue', 2, 90),
      createDayStats('Wed', 3, 75),
      createDayStats('Thu', 4, 80),
      createDayStats('Fri', 5, 70),
      createDayStats('Sat', 6, 60),
    ];

    const tip = generateActionableTip(weakDaysStats, 3);
    expect(tip).toContain('Focus on');
    expect(tip).toContain('Mon'); // Weakest day (40%)
  });

  it('should encourage short streak to reach 7 days', () => {
    const goodDaysStats = allDaysStats.map((d) => ({ ...d, rate: 90 }));
    const tip = generateActionableTip(goodDaysStats, 4);
    expect(tip).toBe('3 more days to hit a week streak!');
  });

  it('should prompt to start new streak when no current streak', () => {
    const goodDaysStats = allDaysStats.map((d) => ({ ...d, rate: 90 }));
    const tip = generateActionableTip(goodDaysStats, 0);
    expect(tip).toBe('Complete today to start a new streak!');
  });

  it('should handle days with no data', () => {
    const noDataStats = allDaysStats.map((d) => ({ ...d, total: 0, rate: 0 }));
    const tip = generateActionableTip(noDataStats, 0);
    expect(tip).toBe('Complete today to start a new streak!');
  });
});

describe('getBestAndWorstDays', () => {
  it('should return null for both when no data', () => {
    const emptyStats: DayStats[] = [
      { day: 'Sun', dayIndex: 0, rate: 0, completed: 0, total: 0 },
      { day: 'Mon', dayIndex: 1, rate: 0, completed: 0, total: 0 },
    ];

    const result = getBestAndWorstDays(emptyStats);
    expect(result.bestDay).toBeNull();
    expect(result.worstDay).toBeNull();
  });

  it('should find best and worst days correctly', () => {
    const stats: DayStats[] = [
      { day: 'Sun', dayIndex: 0, rate: 50, completed: 5, total: 10 },
      { day: 'Mon', dayIndex: 1, rate: 90, completed: 9, total: 10 },
      { day: 'Tue', dayIndex: 2, rate: 30, completed: 3, total: 10 },
    ];

    const result = getBestAndWorstDays(stats);
    expect(result.bestDay?.day).toBe('Mon');
    expect(result.bestDay?.rate).toBe(90);
    expect(result.worstDay?.day).toBe('Tue');
    expect(result.worstDay?.rate).toBe(30);
  });

  it('should only consider days with data (total > 0)', () => {
    const stats: DayStats[] = [
      { day: 'Sun', dayIndex: 0, rate: 0, completed: 0, total: 0 }, // No data
      { day: 'Mon', dayIndex: 1, rate: 80, completed: 8, total: 10 },
      { day: 'Tue', dayIndex: 2, rate: 60, completed: 6, total: 10 },
    ];

    const result = getBestAndWorstDays(stats);
    expect(result.bestDay?.day).toBe('Mon');
    expect(result.worstDay?.day).toBe('Tue');
  });

  it('should return same day for best and worst when only one day has data', () => {
    const stats: DayStats[] = [
      { day: 'Sun', dayIndex: 0, rate: 0, completed: 0, total: 0 },
      { day: 'Mon', dayIndex: 1, rate: 75, completed: 7, total: 10 },
      { day: 'Tue', dayIndex: 2, rate: 0, completed: 0, total: 0 },
    ];

    const result = getBestAndWorstDays(stats);
    expect(result.bestDay?.day).toBe('Mon');
    expect(result.worstDay?.day).toBe('Mon');
  });
});
