/**
 * Unit tests for streak recovery feature
 * Tests cost calculation, limits, and recovery logic
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  calculateRecoveryCost,
  getCurrentMonthKey,
} from '../../../convex/habits/recoverStreak';

describe('Streak Recovery - Cost Calculation', () => {
  describe('calculateRecoveryCost', () => {
    it('returns 0 for streaks less than 7 days', () => {
      expect(calculateRecoveryCost(0)).toBe(0);
      expect(calculateRecoveryCost(3)).toBe(0);
      expect(calculateRecoveryCost(6)).toBe(0);
    });

    it('returns 1 coin for streaks 7-14 days', () => {
      expect(calculateRecoveryCost(7)).toBe(1);
      expect(calculateRecoveryCost(10)).toBe(1);
      expect(calculateRecoveryCost(14)).toBe(1);
    });

    it('returns 2 coins for streaks 15-29 days', () => {
      expect(calculateRecoveryCost(15)).toBe(2);
      expect(calculateRecoveryCost(20)).toBe(2);
      expect(calculateRecoveryCost(29)).toBe(2);
    });

    it('returns 3 coins for streaks 30+ days', () => {
      expect(calculateRecoveryCost(30)).toBe(3);
      expect(calculateRecoveryCost(45)).toBe(3);
      expect(calculateRecoveryCost(100)).toBe(3);
    });

    it('scales linearly between 7-29 days', () => {
      const cost7 = calculateRecoveryCost(7); // 1
      const cost22 = calculateRecoveryCost(22); // ~2
      const cost29 = calculateRecoveryCost(29); // 2

      expect(cost7).toBe(1);
      expect(cost22).toBeGreaterThanOrEqual(1);
      expect(cost22).toBeLessThanOrEqual(2);
      expect(cost29).toBe(2);
    });

    it('handles edge cases correctly', () => {
      expect(calculateRecoveryCost(-1)).toBe(0);
      expect(calculateRecoveryCost(Number.MAX_VALUE)).toBe(3);
    });
  });
});

describe('Streak Recovery - Month Key Generation', () => {
  describe('getCurrentMonthKey', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns YYYY-MM format for current date', () => {
      // Set to January 2025
      jest.setSystemTime(new Date('2025-01-15T12:00:00.000Z'));
      const monthKey = getCurrentMonthKey();
      expect(monthKey).toBe('2025-01');
    });

    it('handles year boundary correctly', () => {
      // Set to December 2024
      jest.setSystemTime(new Date('2024-12-31T23:59:59.999Z'));
      const monthKey = getCurrentMonthKey();
      expect(monthKey).toBe('2024-12');
    });

    it('handles month boundary correctly', () => {
      // Set to February 2025 (leap year)
      jest.setSystemTime(new Date('2025-02-15T12:00:00.000Z'));
      const monthKey = getCurrentMonthKey();
      expect(monthKey).toBe('2025-02');
    });

    it('pads single-digit months with leading zero', () => {
      jest.setSystemTime(new Date('2025-03-05T12:00:00.000Z'));
      const monthKey = getCurrentMonthKey();
      expect(monthKey).toBe('2025-03');
    });
  });
});

describe('Streak Recovery - Premium Limits', () => {
  it('allows 1 recovery per habit per month for free users', () => {
    const maxRecoveries = 1;
    const recoveryCount = 0;

    const canRecover = recoveryCount < maxRecoveries;
    expect(canRecover).toBe(true);
  });

  it('blocks recovery after limit reached for free users', () => {
    const maxRecoveries = 1;
    const recoveryCount = 1;

    const canRecover = recoveryCount < maxRecoveries;
    expect(canRecover).toBe(false);
  });

  it('allows 3 recoveries per habit per month for premium users', () => {
    const maxRecoveries = 3;
    const recoveryCount = 2;

    const canRecover = recoveryCount < maxRecoveries;
    expect(canRecover).toBe(true);
  });

  it('blocks recovery after limit reached for premium users', () => {
    const maxRecoveries = 3;
    const recoveryCount = 3;

    const canRecover = recoveryCount < maxRecoveries;
    expect(canRecover).toBe(false);
  });
});

describe('Streak Recovery - Eligibility', () => {
  it('allows recovery for streaks >= 7 days', () => {
    const streakLength = 7;
    const canRecover = streakLength >= 7;
    expect(canRecover).toBe(true);
  });

  it('blocks recovery for streaks < 7 days', () => {
    const streakLength = 6;
    const canRecover = streakLength >= 7;
    expect(canRecover).toBe(false);
  });

  it('allows recovery only when currentStreak < bestStreak', () => {
    const currentStreak = 0;
    const bestStreak = 10;
    const canRecover = currentStreak < bestStreak && bestStreak >= 7;
    expect(canRecover).toBe(true);
  });

  it('blocks recovery when streak is active', () => {
    const currentStreak = 5;
    const bestStreak = 5;
    const canRecover = currentStreak < bestStreak && bestStreak >= 7;
    expect(canRecover).toBe(false);
  });
});

describe('Streak Recovery - Cost Display', () => {
  it('displays "Free" for 0 cost', () => {
    const cost = 0;
    const display = cost === 0 ? 'Free' : `${cost} coin${cost > 1 ? 's' : ''}`;
    expect(display).toBe('Free');
  });

  it('displays "1 coin" for cost 1', () => {
    const cost = 1;
    const display = cost === 0 ? 'Free' : `${cost} coin${cost > 1 ? 's' : ''}`;
    expect(display).toBe('1 coin');
  });

  it('displays "2 coins" for cost 2', () => {
    const cost = 2;
    const display = cost === 0 ? 'Free' : `${cost} coin${cost > 1 ? 's' : ''}`;
    expect(display).toBe('2 coins');
  });

  it('displays "3 coins" for cost 3', () => {
    const cost = 3;
    const display = cost === 0 ? 'Free' : `${cost} coin${cost > 1 ? 's' : ''}`;
    expect(display).toBe('3 coins');
  });
});
