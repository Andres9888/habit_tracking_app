/**
 * Habit Strength Formula Tests
 * Tests the momentum-based strength calculation
 *
 * Coverage:
 * - AC1: Completing a habit increases strength
 * - AC2: Missing a habit decreases strength
 * - AC3: 63 days perfect = ~85% (Automatic, Lally median)
 * - Edge cases: boundaries, zero strength, full strength
 */

import {
  calculateNewStrength,
  calculateMomentumStrengthSnapshot,
  GROWTH_RATE,
  BASE_DECAY,
  getStrengthLevel,
} from './habitStrength';

describe('calculateNewStrength - Momentum-Based Formula v2.0', () => {
  describe('Growth on Completion (AC1)', () => {
    it('should increase strength when habit is completed', () => {
      const currentStrength = 50;
      const completed = true;
      const completionsLast7Days = 7;

      const newStrength = calculateNewStrength(
        currentStrength,
        completed,
        completionsLast7Days
      );

      expect(newStrength).toBeGreaterThan(currentStrength);
    });

    it('should fill 3% of remaining gap on completion', () => {
      const currentStrength = 50;
      const completed = true;
      const completionsLast7Days = 7;

      const newStrength = calculateNewStrength(
        currentStrength,
        completed,
        completionsLast7Days
      );

      // Gap = 100 - 50 = 50
      // Growth = 50 * 0.03 = 1.5
      // Expected = 50 + 1.5 = 51.5
      expect(newStrength).toBeCloseTo(51.5, 1);
    });

    it('should grow slower as strength approaches 100 (exponential approach)', () => {
      const lowStrength = 10;
      const highStrength = 90;
      const completed = true;
      const completionsLast7Days = 7;

      const lowGrowth = calculateNewStrength(
        lowStrength,
        completed,
        completionsLast7Days
      );
      const highGrowth = calculateNewStrength(
        highStrength,
        completed,
        completionsLast7Days
      );

      const lowIncrease = lowGrowth - lowStrength;
      const highIncrease = highGrowth - highStrength;

      // Lower strength should have larger absolute increase
      expect(lowIncrease).toBeGreaterThan(highIncrease);
    });

    it('should cap at 100% maximum', () => {
      const currentStrength = 99;
      const completed = true;
      const completionsLast7Days = 7;

      const newStrength = calculateNewStrength(
        currentStrength,
        completed,
        completionsLast7Days
      );

      expect(newStrength).toBeLessThanOrEqual(100);
    });
  });

  describe('Decay on Miss (AC2)', () => {
    it('should decrease strength when habit is missed', () => {
      const currentStrength = 50;
      const completed = false;
      const completionsLast7Days = 0;

      const newStrength = calculateNewStrength(
        currentStrength,
        completed,
        completionsLast7Days
      );

      expect(newStrength).toBeLessThan(currentStrength);
    });

    it('should apply 2% base decay with no streak protection', () => {
      const currentStrength = 50;
      const completed = false;
      const completionsLast7Days = 0; // No protection

      const newStrength = calculateNewStrength(
        currentStrength,
        completed,
        completionsLast7Days
      );

      // Decay = 50 * 0.02 = 1.0
      // Expected = 50 * (1 - 0.02) = 49.0
      expect(newStrength).toBeCloseTo(49.0, 1);
    });

    it('should never go below 0%', () => {
      const currentStrength = 1;
      const completed = false;
      const completionsLast7Days = 0;

      const newStrength = calculateNewStrength(
        currentStrength,
        completed,
        completionsLast7Days
      );

      expect(newStrength).toBeGreaterThanOrEqual(0);
    });
  });

  describe('66-Day Target (AC4)', () => {
    it('should reach ~87% after 66 perfect days (Automatic level)', () => {
      let strength = 0;
      const daysToSimulate = 66;

      for (let day = 0; day < daysToSimulate; day++) {
        strength = calculateNewStrength(strength, true, 7);
      }

      expect(strength).toBeGreaterThanOrEqual(85); // Automatic level starts at 85%
      expect(strength).toBeLessThanOrEqual(90);
    });

    it('should show progressive growth aligned with PRD', () => {
      const progressionPoints: Array<{
        day: number;
        expectedMin: number;
        expectedMax: number;
      }> = [
        { day: 1, expectedMin: 2.5, expectedMax: 3.5 }, // ~3%
        { day: 7, expectedMin: 18, expectedMax: 21 }, // ~19.2%
        { day: 14, expectedMin: 33, expectedMax: 36 }, // ~34.7%
        { day: 21, expectedMin: 46, expectedMax: 49 }, // ~47.3%
        { day: 30, expectedMin: 58, expectedMax: 62 }, // ~59.9%
        { day: 45, expectedMin: 73, expectedMax: 77 }, // ~74.6%
        { day: 60, expectedMin: 82, expectedMax: 86 }, // ~83.9%
        { day: 66, expectedMin: 85, expectedMax: 89 }, // ~86.6%
      ];

      for (const point of progressionPoints) {
        let strength = 0;
        for (let day = 0; day < point.day; day++) {
          strength = calculateNewStrength(strength, true, 7);
        }
        expect(strength).toBeGreaterThanOrEqual(point.expectedMin);
        expect(strength).toBeLessThanOrEqual(point.expectedMax);
      }
    });
  });

  describe('Edge Cases and Boundaries', () => {
    it('should handle 0% strength correctly', () => {
      const zeroCompletion = calculateNewStrength(0, true, 7);
      const zeroMiss = calculateNewStrength(0, false, 0);

      expect(zeroCompletion).toBeGreaterThan(0);
      expect(zeroMiss).toBe(0);
    });

    it('should handle 100% strength correctly', () => {
      const maxCompletion = calculateNewStrength(100, true, 7);
      const maxMiss = calculateNewStrength(100, false, 0);

      expect(maxCompletion).toBe(100); // Can't exceed 100
      expect(maxMiss).toBeLessThan(100); // Should still decay
    });

    it('should handle invalid negative strength', () => {
      const result = calculateNewStrength(-10, true, 7);
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should handle strength over 100', () => {
      const result = calculateNewStrength(150, false, 0);
      expect(result).toBeLessThanOrEqual(100);
    });

    it('should match spec example: 50% completion increases to ~51.5%', () => {
      const result = calculateNewStrength(50, true, 7);
      expect(result).toBeCloseTo(51.5, 1);
    });

    it('should match spec example: 50% miss drops to 49% (2% proportional decay)', () => {
      const result = calculateNewStrength(50, false, 7);
      // 50 * (1 - 0.02) = 49.0
      expect(result).toBeCloseTo(49.0, 1);
    });
  });

  describe('Recovery Scenarios', () => {
    it('should recover from bad week in ~5 good days', () => {
      let strength = 78;

      // Miss 3 days in a row
      strength = calculateNewStrength(strength, false, 0);
      strength = calculateNewStrength(strength, false, 0);
      strength = calculateNewStrength(strength, false, 0);

      const afterMisses = strength;
      // BASE_DECAY=0.02, no shield:
      // Miss 1: 78 * 0.98 = 76.44
      // Miss 2: 76.44 * 0.98 = 74.91
      // Miss 3: 74.91 * 0.98 = 73.41
      expect(afterMisses).toBeCloseTo(73.4, 1);

      // Recovery: 5 good days
      for (let i = 0; i < 5; i++) {
        strength = calculateNewStrength(strength, true, 0);
      }

      const afterRecovery = strength;
      expect(afterRecovery).toBeGreaterThan(afterMisses);
      // 3% gap fill for 5 days recovers ~3.8 points toward 78%
      expect(afterRecovery).toBeGreaterThanOrEqual(76);
      expect(afterRecovery).toBeLessThan(80);
    });
  });
});

describe('getStrengthLevel - Updated Thresholds', () => {
  it('should return "starting" for 0-29%', () => {
    expect(getStrengthLevel(0)).toBe('starting');
    expect(getStrengthLevel(0.15)).toBe('starting');
    expect(getStrengthLevel(0.29)).toBe('starting');
  });

  it('should return "building" for 30-59%', () => {
    expect(getStrengthLevel(0.3)).toBe('building');
    expect(getStrengthLevel(0.45)).toBe('building');
    expect(getStrengthLevel(0.59)).toBe('building');
  });

  it('should return "strong" for 60-84%', () => {
    expect(getStrengthLevel(0.6)).toBe('strong');
    expect(getStrengthLevel(0.7)).toBe('strong');
    expect(getStrengthLevel(0.84)).toBe('strong');
  });

  it('should return "automatic" for 85-100%', () => {
    expect(getStrengthLevel(0.85)).toBe('automatic');
    expect(getStrengthLevel(0.95)).toBe('automatic');
    expect(getStrengthLevel(1.0)).toBe('automatic');
  });

  it('should handle 0-100 scale input (backwards compatible)', () => {
    expect(getStrengthLevel(25)).toBe('starting');
    expect(getStrengthLevel(45)).toBe('building');
    expect(getStrengthLevel(70)).toBe('strong');
    expect(getStrengthLevel(90)).toBe('automatic');
  });
});

describe('Formula Constants', () => {
  it('should have correct constant values', () => {
    expect(GROWTH_RATE).toBe(0.03);
    expect(BASE_DECAY).toBe(0.02);
  });
});

describe('calculateMomentumStrengthSnapshot - day-by-day simulation', () => {
  it('should apply decay on missed days between completions', () => {
    const habitCreatedAt = new Date(2025, 0, 1).getTime(); // 2025-01-01 local
    const tracking = [{ completed: true, date: '2025-01-01' }];

    const snapshot = calculateMomentumStrengthSnapshot({
      habitCreatedAt,
      throughDate: '2025-01-03',
      tracking,
    });

    // Day 1 completion: 0 -> 3.0 (growthRate 0.03)
    // Day 2 miss: 3.0 * (1 - 0.02) = 2.94 (balanced baseDecay 0.02)
    // Day 3 miss: 2.94 * (1 - 0.02) = 2.8812
    expect(snapshot.daysProcessed).toBe(3);
    expect(snapshot.strength100).toBeLessThan(3);
    expect(snapshot.strength100).toBeCloseTo(2.8812, 3);
  });

  it('should include backfilled tracking dates before habit creation', () => {
    const habitCreatedAt = new Date(2025, 0, 2).getTime(); // created 2025-01-02 local
    const tracking = [
      { completed: true, date: '2025-01-01' },
      { completed: true, date: '2025-01-02' },
    ];

    const snapshot = calculateMomentumStrengthSnapshot({
      habitCreatedAt,
      throughDate: '2025-01-02',
      tracking,
    });

    // Day 1 completion: 0 -> 3.0
    // Day 2 completion: 3.0 + (100 - 3.0) * 0.03 = 5.91
    expect(snapshot.daysProcessed).toBe(2);
    expect(snapshot.strength100).toBeCloseTo(5.91, 2);
  });

  // TEST-002: Edge Cases for calculateMomentumStrengthSnapshot
  describe('Edge Cases (TEST-002)', () => {
    it('should handle empty tracking array (earliestDateKey null)', () => {
      const habitCreatedAt = new Date(2025, 0, 1).getTime();
      const tracking: Array<{ completed: boolean; date: string }> = [];

      const snapshot = calculateMomentumStrengthSnapshot({
        habitCreatedAt,
        throughDate: '2025-01-03',
        tracking,
      });

      // With empty tracking, starts from creation date, no completions
      // Day 1 miss: 0 * (1 - 0.02) = 0
      // Day 2 miss: 0 * (1 - 0.02) = 0
      // Day 3 miss: 0 * (1 - 0.02) = 0
      expect(snapshot.daysProcessed).toBe(3);
      expect(snapshot.strength100).toBe(0);
      expect(snapshot.strength).toBe(0);
      expect(snapshot.strengthLevel).toBe('starting');
    });

    it('should use earliestDate when before creationDate (backfill scenario)', () => {
      // Habit created on Jan 5, but tracking has backfilled entries from Jan 1
      const habitCreatedAt = new Date(2025, 0, 5).getTime();
      const tracking = [
        { completed: true, date: '2025-01-01' },
        { completed: true, date: '2025-01-02' },
        { completed: false, date: '2025-01-03' },
      ];

      const snapshot = calculateMomentumStrengthSnapshot({
        habitCreatedAt,
        throughDate: '2025-01-05',
        tracking,
      });

      // Should start from Jan 1 (earliestDate), not Jan 5 (creationDate)
      expect(snapshot.daysProcessed).toBe(5);
      expect(snapshot.strength100).toBeGreaterThan(0);
    });

    it('should return zero values when startDate > evaluationDate (future habit)', () => {
      // Habit created "tomorrow" but evaluating "today"
      const tomorrow = new Date(2025, 0, 2).getTime();

      const snapshot = calculateMomentumStrengthSnapshot({
        habitCreatedAt: tomorrow,
        throughDate: '2025-01-01', // "today" is before creation
        tracking: [],
      });

      // Early return path: startDate > evaluationDate
      expect(snapshot.daysProcessed).toBe(0);
      expect(snapshot.strength).toBe(0);
      expect(snapshot.strength100).toBe(0);
      expect(snapshot.strengthLevel).toBe('starting');
    });

    it('should handle tracking with no completions (empty completionDates Set)', () => {
      const habitCreatedAt = new Date(2025, 0, 1).getTime();
      const tracking = [
        { completed: false, date: '2025-01-01' },
        { completed: false, date: '2025-01-02' },
        { completed: false, date: '2025-01-03' },
      ];

      const snapshot = calculateMomentumStrengthSnapshot({
        habitCreatedAt,
        throughDate: '2025-01-03',
        tracking,
      });

      // All days missed, but tracking records exist
      // All days have completed: false, so strength stays 0
      expect(snapshot.daysProcessed).toBe(3);
      expect(snapshot.strength100).toBe(0);
      expect(snapshot.strength).toBe(0);
    });

    it('should use creationDate when no valid dates in tracking', () => {
      const habitCreatedAt = new Date(2025, 0, 1).getTime();
      // Tracking with only invalid date formats
      const tracking = [
        { completed: true, date: 'invalid-date' },
        { completed: true, date: '2025/01/01' }, // wrong format
      ];

      const snapshot = calculateMomentumStrengthSnapshot({
        habitCreatedAt,
        throughDate: '2025-01-03',
        tracking,
      });

      // Invalid dates are skipped, so earliestDateKey is null
      // Falls back to creationDate, no valid completions
      expect(snapshot.daysProcessed).toBe(3);
      expect(snapshot.strength100).toBe(0);
    });

    it('should handle throughDate defaulting to current date', () => {
      const habitCreatedAt = new Date(2025, 0, 1).getTime();
      const tracking = [{ completed: true, date: '2025-01-01' }];

      // Don't provide throughDate - should use current date
      const snapshot = calculateMomentumStrengthSnapshot({
        habitCreatedAt,
        tracking,
      });

      // Since we're testing in 2026, daysProcessed should be > 0
      expect(snapshot.daysProcessed).toBeGreaterThan(0);
      // Some strength should exist from the Jan 1 completion (heavily decayed)
      expect(snapshot.strength100).toBeGreaterThanOrEqual(0);
    });

    it('should correctly filter only completed entries for completionDates', () => {
      const habitCreatedAt = new Date(2025, 0, 1).getTime();
      const tracking = [
        { completed: true, date: '2025-01-01' },
        { completed: false, date: '2025-01-02' },
        { completed: true, date: '2025-01-03' },
      ];

      const snapshot = calculateMomentumStrengthSnapshot({
        habitCreatedAt,
        throughDate: '2025-01-03',
        tracking,
      });

      // Day 1: completion 0 -> 3.0 (growthRate 0.03)
      // Day 2: miss 3.0 * (1 - 0.02) = 2.94 (balanced baseDecay 0.02)
      // Day 3: completion 2.94 + (100 - 2.94) * 0.03 = 5.8518
      expect(snapshot.daysProcessed).toBe(3);
      expect(snapshot.strength100).toBeCloseTo(5.8518, 2);
    });
  });
});
