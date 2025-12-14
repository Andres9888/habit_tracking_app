/**
 * Habit Strength Formula Tests (v2.0 - Momentum-Based)
 * Tests the new forgiving momentum-based strength calculation
 *
 * Coverage:
 * - AC1: Completing a habit increases strength
 * - AC2: Missing a habit decreases strength
 * - AC3: Streak shield reduces decay
 * - AC4: 90 days perfect = ~100%
 * - Edge cases: boundaries, zero strength, full strength
 */

import {
  calculateNewStrength,
  calculateMomentumStrengthSnapshot,
  GROWTH_RATE,
  BASE_DECAY,
  SHIELD_EFFECTIVENESS,
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

      const lowGrowth = calculateNewStrength(lowStrength, completed, completionsLast7Days);
      const highGrowth = calculateNewStrength(highStrength, completed, completionsLast7Days);

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

  describe('Streak Shield Protection (AC3)', () => {
    it('should reduce decay with perfect 7-day streak (70% protection)', () => {
      const currentStrength = 50;
      const completed = false;
      const completionsLast7Days = 7; // Perfect streak

      const newStrength = calculateNewStrength(
        currentStrength,
        completed,
        completionsLast7Days
      );

      // Streak shield = 7/7 = 1.0
      // Protected decay = 0.02 * (1 - 1.0 * 0.7) = 0.02 * 0.3 = 0.006
      // Expected = 50 * (1 - 0.006) = 49.7 (-0.3% drop)
      expect(newStrength).toBeCloseTo(49.7, 1);
    });

    it('should have 70% less decay with 7/7 streak vs 0/7 streak', () => {
      const currentStrength = 50;
      const completed = false;

      const noStreakStrength = calculateNewStrength(currentStrength, completed, 0);
      const fullStreakStrength = calculateNewStrength(currentStrength, completed, 7);

      const noStreakDrop = currentStrength - noStreakStrength;
      const fullStreakDrop = currentStrength - fullStreakStrength;

      // Full streak should have 70% less decay
      expect(fullStreakDrop).toBeCloseTo(noStreakDrop * 0.3, 1);
    });

    it('should scale protection proportionally with streak length', () => {
      const currentStrength = 50;
      const completed = false;

      const strength0 = calculateNewStrength(currentStrength, completed, 0);
      const strength3 = calculateNewStrength(currentStrength, completed, 3);
      const strength7 = calculateNewStrength(currentStrength, completed, 7);

      const drop0 = currentStrength - strength0;
      const drop3 = currentStrength - strength3;
      const drop7 = currentStrength - strength7;

      // 3/7 streak should have less drop than 0/7
      expect(drop3).toBeLessThan(drop0);
      // 7/7 streak should have least drop
      expect(drop7).toBeLessThan(drop3);
    });

    it('should clamp completionsLast7Days to 0-7 range', () => {
      const currentStrength = 50;
      const completed = false;

      const negative = calculateNewStrength(currentStrength, completed, -5);
      const excessive = calculateNewStrength(currentStrength, completed, 20);
      const normal = calculateNewStrength(currentStrength, completed, 7);

      // Negative should be treated as 0 (no protection)
      expect(negative).toBeLessThan(currentStrength);

      // Excessive should be clamped to 7 (full protection)
      expect(excessive).toBeCloseTo(normal, 1);
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
      const progressionPoints: Array<{ day: number; expectedMin: number; expectedMax: number }> = [
        { day: 1, expectedMin: 2.5, expectedMax: 3.5 },    // ~3%
        { day: 7, expectedMin: 18, expectedMax: 21 },       // ~19.2%
        { day: 14, expectedMin: 33, expectedMax: 36 },      // ~34.7%
        { day: 21, expectedMin: 46, expectedMax: 49 },      // ~47.3%
        { day: 30, expectedMin: 58, expectedMax: 62 },      // ~59.9%
        { day: 45, expectedMin: 73, expectedMax: 77 },      // ~74.6%
        { day: 60, expectedMin: 82, expectedMax: 86 },      // ~83.9%
        { day: 66, expectedMin: 85, expectedMax: 89 },      // ~86.6%
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

    it('should match spec example: 50% miss with shield drops to ~49.7%', () => {
      const result = calculateNewStrength(50, false, 7);
      // With 7/7 streak: drop is ~0.3%, so ~49.7%
      // New constants: 70% shield effectiveness with 2% base decay
      expect(result).toBeCloseTo(49.7, 1); // Full protection case
    });
  });

  describe('Recovery Scenarios', () => {
    it('should recover from bad week in ~5 good days', () => {
      let strength = 78;

      // Miss 3 days in a row (after 30-day streak)
      strength = calculateNewStrength(strength, false, 7);
      strength = calculateNewStrength(strength, false, 6);
      strength = calculateNewStrength(strength, false, 5);

      const afterMisses = strength;
      // With BASE_DECAY=0.02 and SHIELD_EFFECTIVENESS=0.7:
      // Miss 1 (7/7): 78 * (1 - 0.006) = 77.532
      // Miss 2 (6/7): 77.532 * (1 - 0.008) = 76.912
      // Miss 3 (5/7): 76.912 * (1 - 0.010) = 76.143
      // Total drop: ~1.9% (forgiving formula)
      expect(afterMisses).toBeCloseTo(76.1, 1);

      // Recovery: 5 good days
      for (let i = 0; i < 5; i++) {
        strength = calculateNewStrength(strength, true, 5 + i);
      }

      const afterRecovery = strength;
      expect(afterRecovery).toBeGreaterThan(afterMisses);
      // Forgiving formula with 3% gap fill recovers but more slowly
      // After 5 good days: recovers from 76.1% to ~78.5% (close to original 78%)
      expect(afterRecovery).toBeGreaterThanOrEqual(76); // Recovered significantly
      expect(afterRecovery).toBeLessThan(80); // But not excessive
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
    expect(SHIELD_EFFECTIVENESS).toBe(0.7);
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

    // Day 1 completion: 0 -> 3.0
    // Day 2 miss (1/7 shield): 3.0 * (1 - 0.018) = 2.946
    // Day 3 miss (1/7 shield): 2.946 * (1 - 0.018) ≈ 2.8929
    expect(snapshot.daysProcessed).toBe(3);
    expect(snapshot.strength100).toBeLessThan(3);
    expect(snapshot.strength100).toBeCloseTo(2.8929, 3);
  });
});
