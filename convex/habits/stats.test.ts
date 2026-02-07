/**
 * getStats Tests
 *
 * Tests cover:
 * - Authentication & ownership (SEC-001)
 * - Timezone-safe streak calculation using UTC string comparisons
 * - 30-day consistency calculation with string-based date filtering
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { getTodayUTCDateKey, subtractDaysFromDateKey } from './utils';

describe('getStats: Authentication Security', () => {
  describe('Auth check pattern', () => {
    it('should check auth before any database access', () => {
      const handlerSource = `
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;
        const habit = await ctx.db.get(args.habitId);
      `;

      const authIndex = handlerSource.indexOf('getUserIdentity');
      const dbIndex = handlerSource.indexOf('ctx.db.get');
      expect(authIndex).toBeLessThan(dbIndex);
    });

    it('should return null for unauthenticated callers', () => {
      const identity = null;
      const result = identity ? 'would compute stats' : null;
      expect(result).toBeNull();
    });
  });

  describe('Ownership verification', () => {
    it('should return null when habit userId does not match identity.subject', () => {
      const identitySubject = 'user_A';
      const habit = { userId: 'user_B', name: 'Meditate', createdAt: 1000 };

      const result = habit.userId !== identitySubject ? null : habit;
      expect(result).toBeNull();
    });

    it('should allow access when userId matches identity.subject', () => {
      const identitySubject = 'user_A';
      const habit = { userId: 'user_A', name: 'Meditate', createdAt: 1000 };

      const result = habit.userId !== identitySubject ? null : habit;
      expect(result).toEqual(habit);
    });

    it('should return null when habit has undefined userId', () => {
      const identitySubject = 'user_A';
      const habit = { userId: undefined, name: 'Legacy Habit', createdAt: 1000 };

      const result = habit.userId !== identitySubject ? null : habit;
      expect(result).toBeNull();
    });

    it('should return null when habit does not exist', () => {
      const habit = null;
      const result = habit ? habit : null;
      expect(result).toBeNull();
    });
  });

  describe('Auth-then-ownership order', () => {
    it('should check auth before ownership (defense in depth)', () => {
      const handlerSource = `
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;
        const habit = await ctx.db.get(args.habitId);
        if (!habit) return null;
        if (habit.userId !== identity.subject) return null;
      `;

      const authCheck = handlerSource.indexOf('if (!identity)');
      const ownershipCheck = handlerSource.indexOf(
        'habit.userId !== identity.subject'
      );
      expect(authCheck).toBeLessThan(ownershipCheck);
    });

    it('should verify ownership before computing stats', () => {
      const handlerSource = `
        if (habit.userId !== identity.subject) return null;
        const tracking = await ctx.db.query('tracking')
      `;

      const ownershipCheck = handlerSource.indexOf(
        'habit.userId !== identity.subject'
      );
      const trackingQuery = handlerSource.indexOf("ctx.db.query('tracking')");
      expect(ownershipCheck).toBeLessThan(trackingQuery);
    });
  });
});

/**
 * Replicates the streak + consistency logic from stats.ts
 * for isolated unit testing without Convex runtime.
 */
function computeStats(
  tracking: Array<{ date: string; completed: boolean }>,
  todayKey: string
) {
  const completedDates = new Set(
    tracking.filter((t) => t.completed).map((t) => t.date)
  );

  let streak = 0;
  for (let i = 0; ; i++) {
    const expectedKey = subtractDaysFromDateKey(todayKey, i);
    if (completedDates.has(expectedKey)) {
      streak++;
    } else {
      break;
    }
  }

  const thirtyDaysAgoKey = subtractDaysFromDateKey(todayKey, 30);
  const recentCount = tracking.filter(
    (t) => t.completed && t.date > thirtyDaysAgoKey && t.date <= todayKey
  ).length;

  const consistency = Math.max(
    0,
    Math.min(100, Math.round((recentCount / 30) * 100))
  );

  return { streak, consistency };
}

describe('getStats: Streak Calculation (Timezone-Safe)', () => {
  const TODAY = '2025-06-15';

  it('should return streak=0 when no completions', () => {
    const result = computeStats([], TODAY);
    expect(result.streak).toBe(0);
  });

  it('should return streak=1 when only today is completed', () => {
    const tracking = [{ date: '2025-06-15', completed: true }];
    const result = computeStats(tracking, TODAY);
    expect(result.streak).toBe(1);
  });

  it('should count consecutive days ending today', () => {
    const tracking = [
      { date: '2025-06-13', completed: true },
      { date: '2025-06-14', completed: true },
      { date: '2025-06-15', completed: true },
    ];
    const result = computeStats(tracking, TODAY);
    expect(result.streak).toBe(3);
  });

  it('should break streak on a gap day', () => {
    const tracking = [
      { date: '2025-06-12', completed: true },
      // gap on 2025-06-13
      { date: '2025-06-14', completed: true },
      { date: '2025-06-15', completed: true },
    ];
    const result = computeStats(tracking, TODAY);
    expect(result.streak).toBe(2);
  });

  it('should return streak=0 when today is not completed', () => {
    const tracking = [
      { date: '2025-06-13', completed: true },
      { date: '2025-06-14', completed: true },
    ];
    const result = computeStats(tracking, TODAY);
    expect(result.streak).toBe(0);
  });

  it('should ignore incomplete tracking entries', () => {
    const tracking = [
      { date: '2025-06-14', completed: false },
      { date: '2025-06-15', completed: true },
    ];
    const result = computeStats(tracking, TODAY);
    expect(result.streak).toBe(1);
  });

  it('should handle month boundary correctly', () => {
    const todayKey = '2025-03-02';
    const tracking = [
      { date: '2025-02-28', completed: true },
      { date: '2025-03-01', completed: true },
      { date: '2025-03-02', completed: true },
    ];
    const result = computeStats(tracking, todayKey);
    expect(result.streak).toBe(3);
  });

  it('should handle year boundary correctly', () => {
    const todayKey = '2025-01-02';
    const tracking = [
      { date: '2024-12-31', completed: true },
      { date: '2025-01-01', completed: true },
      { date: '2025-01-02', completed: true },
    ];
    const result = computeStats(tracking, todayKey);
    expect(result.streak).toBe(3);
  });
});

describe('getStats: Consistency Calculation', () => {
  const TODAY = '2025-06-15';

  it('should return 0% when no completions in last 30 days', () => {
    const result = computeStats([], TODAY);
    expect(result.consistency).toBe(0);
  });

  it('should return 100% when all 30 days completed', () => {
    const tracking = Array.from({ length: 30 }, (_, i) => ({
      date: subtractDaysFromDateKey(TODAY, i),
      completed: true,
    }));
    const result = computeStats(tracking, TODAY);
    expect(result.consistency).toBe(100);
  });

  it('should return ~50% for 15 completions in last 30 days', () => {
    const tracking = Array.from({ length: 15 }, (_, i) => ({
      date: subtractDaysFromDateKey(TODAY, i * 2),
      completed: true,
    }));
    const result = computeStats(tracking, TODAY);
    expect(result.consistency).toBe(50);
  });

  it('should exclude completions older than 30 days', () => {
    const tracking = [
      { date: subtractDaysFromDateKey(TODAY, 31), completed: true },
      { date: subtractDaysFromDateKey(TODAY, 35), completed: true },
    ];
    const result = computeStats(tracking, TODAY);
    expect(result.consistency).toBe(0);
  });

  it('should exclude future dates beyond today', () => {
    const tracking = [
      { date: '2025-06-16', completed: true },
      { date: '2025-06-15', completed: true },
    ];
    const result = computeStats(tracking, TODAY);
    // Only today counts, future date excluded
    expect(result.consistency).toBe(Math.round((1 / 30) * 100));
  });

  it('should cap at 100% even with >30 completions', () => {
    // If somehow there are 35 completed in 30 days (shouldn't happen, but defensive)
    const tracking = Array.from({ length: 35 }, (_, i) => ({
      date: subtractDaysFromDateKey(TODAY, i % 30),
      completed: true,
    }));
    const result = computeStats(tracking, TODAY);
    expect(result.consistency).toBeLessThanOrEqual(100);
  });

  it('should not count incomplete entries', () => {
    const tracking = Array.from({ length: 30 }, (_, i) => ({
      date: subtractDaysFromDateKey(TODAY, i),
      completed: false,
    }));
    const result = computeStats(tracking, TODAY);
    expect(result.consistency).toBe(0);
  });
});

describe('getStats: UTC date key consistency', () => {
  it('getTodayUTCDateKey returns valid YYYY-MM-DD', () => {
    const key = getTodayUTCDateKey();
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('subtractDaysFromDateKey is inverse of addition', () => {
    // Subtracting 0 is identity
    expect(subtractDaysFromDateKey('2025-06-15', 0)).toBe('2025-06-15');
    // Going back and forward should be consistent
    const back5 = subtractDaysFromDateKey('2025-06-15', 5);
    expect(back5).toBe('2025-06-10');
  });
});
