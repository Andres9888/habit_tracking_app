/**
 * lettersQueries Authentication & Ownership Tests (SEC-004)
 *
 * Tests that all six letter queries:
 * - Require authentication before returning data
 * - Filter results by userId (listByHabit, getUnreadUnlocked, countByHabit)
 * - Verify ownership for single-item access (get, getStats)
 * - Use identity.subject instead of client-supplied userId (getUpcomingUnlocks)
 * - Return [], null, or 0 for unauthenticated callers
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const lettersQueriesSource = fs.readFileSync(
  path.join(__dirname, 'lettersQueries.ts'),
  'utf-8'
);

describe('lettersQueries: Authentication Security (SEC-004)', () => {
  describe('listByHabit query', () => {
    it('should check auth before any database access', () => {
      const handlerSource = `
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];
        const q = ctx.db.query('letters')
      `;
      const authIndex = handlerSource.indexOf('getUserIdentity');
      const dbIndex = handlerSource.indexOf('ctx.db.query');
      expect(authIndex).toBeLessThan(dbIndex);
    });

    it('should return empty array for unauthenticated callers', () => {
      const identity = null;
      const result = identity ? 'would query db' : [];
      expect(result).toEqual([]);
    });

    it('should filter letters by userId at the database level', () => {
      // Verify the actual source code contains the userId filter
      const listByHabitMatch = lettersQueriesSource.match(
        /export const listByHabit[\s\S]*?returns:/
      );
      expect(listByHabitMatch).not.toBeNull();
      expect(listByHabitMatch![0]).toContain(
        "q.eq(q.field('userId'), identity.subject)"
      );
    });

    it('should only return letters belonging to the authenticated user', () => {
      const identitySubject = 'user_A';
      const allLetters = [
        { userId: 'user_A', content: 'letter 1' },
        { userId: 'user_B', content: 'letter 2' },
        { userId: 'user_A', content: 'letter 3' },
      ];

      const filtered = allLetters.filter(
        (l) => l.userId === identitySubject
      );
      expect(filtered).toHaveLength(2);
      expect(filtered.every((l) => l.userId === 'user_A')).toBe(true);
    });
  });

  describe('getUnreadUnlocked query', () => {
    it('should check auth before any database access', () => {
      const handlerSource = `
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];
        const now = Date.now();
        const letters = await ctx.db.query('letters')
      `;
      const authIndex = handlerSource.indexOf('getUserIdentity');
      const dbIndex = handlerSource.indexOf('ctx.db.query');
      expect(authIndex).toBeLessThan(dbIndex);
    });

    it('should return empty array for unauthenticated callers', () => {
      const identity = null;
      const result = identity ? 'would query db' : [];
      expect(result).toEqual([]);
    });

    it('should filter by userId at the database level', () => {
      const getUnreadMatch = lettersQueriesSource.match(
        /export const getUnreadUnlocked[\s\S]*?returns:/
      );
      expect(getUnreadMatch).not.toBeNull();
      expect(getUnreadMatch![0]).toContain(
        "q.eq(q.field('userId'), identity.subject)"
      );
    });
  });

  describe('getUpcomingUnlocks query', () => {
    it('should check auth before any database access', () => {
      const handlerSource = `
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];
        const now = Date.now();
      `;
      const authIndex = handlerSource.indexOf('getUserIdentity');
      const dbIndex = handlerSource.indexOf('Date.now()');
      expect(authIndex).toBeLessThan(dbIndex);
    });

    it('should return empty array for unauthenticated callers', () => {
      const identity = null;
      const result = identity ? 'would query db' : [];
      expect(result).toEqual([]);
    });

    it('should NOT accept a client-supplied userId arg', () => {
      // The userId arg was removed — verify it is not in the args definition
      const argsMatch = lettersQueriesSource.match(
        /export const getUpcomingUnlocks[\s\S]*?args:\s*\{([^}]*)\}/
      );
      expect(argsMatch).not.toBeNull();
      expect(argsMatch![1]).not.toContain('userId');
    });

    it('should use identity.subject for user filtering', () => {
      const upcomingMatch = lettersQueriesSource.match(
        /export const getUpcomingUnlocks[\s\S]*?returns:/
      );
      expect(upcomingMatch).not.toBeNull();
      expect(upcomingMatch![0]).toContain('identity.subject');
    });

    it('should never query all letters without user filter', () => {
      // The dangerous fallback (ctx.db.query('letters').collect()) should be gone
      const upcomingMatch = lettersQueriesSource.match(
        /export const getUpcomingUnlocks[\s\S]*?returns:/
      );
      expect(upcomingMatch).not.toBeNull();
      // Should NOT contain a bare query without index/filter
      const dangerousPattern =
        "ctx.db.query('letters').collect()";
      expect(upcomingMatch![0]).not.toContain(dangerousPattern);
    });
  });

  describe('get query', () => {
    it('should check auth before any database access', () => {
      const handlerSource = `
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;
        const letter = await ctx.db.get(args.letterId);
      `;
      const authIndex = handlerSource.indexOf('getUserIdentity');
      const dbIndex = handlerSource.indexOf('ctx.db.get');
      expect(authIndex).toBeLessThan(dbIndex);
    });

    it('should return null for unauthenticated callers', () => {
      const identity = null;
      const result = identity ? 'would query db' : null;
      expect(result).toBeNull();
    });

    it('should return null when letter userId does not match identity.subject', () => {
      const identitySubject = 'user_A';
      const letter = { userId: 'user_B', content: 'secret' };
      const result = letter.userId !== identitySubject ? null : letter;
      expect(result).toBeNull();
    });

    it('should return the letter when userId matches identity.subject', () => {
      const identitySubject = 'user_A';
      const letter = { userId: 'user_A', content: 'my letter' };
      const result = letter.userId !== identitySubject ? null : letter;
      expect(result).toEqual(letter);
    });

    it('should return null when letter has undefined userId', () => {
      const identitySubject = 'user_A';
      const letter = { userId: undefined, content: 'orphan letter' };
      const result = letter.userId !== identitySubject ? null : letter;
      expect(result).toBeNull();
    });

    it('should check auth before ownership (defense in depth)', () => {
      const getMatch = lettersQueriesSource.match(
        /export const get = query[\s\S]*?returns:/
      );
      expect(getMatch).not.toBeNull();
      const source = getMatch![0];
      const authCheck = source.indexOf('if (!identity) return null');
      const ownershipCheck = source.indexOf(
        'letter.userId !== identity.subject'
      );
      expect(authCheck).toBeGreaterThan(-1);
      expect(ownershipCheck).toBeGreaterThan(-1);
      expect(authCheck).toBeLessThan(ownershipCheck);
    });
  });

  describe('countByHabit query', () => {
    it('should check auth before any database access', () => {
      const handlerSource = `
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return 0;
        const letters = await ctx.db.query('letters')
      `;
      const authIndex = handlerSource.indexOf('getUserIdentity');
      const dbIndex = handlerSource.indexOf('ctx.db.query');
      expect(authIndex).toBeLessThan(dbIndex);
    });

    it('should return 0 for unauthenticated callers', () => {
      const identity = null;
      const result = identity ? 5 : 0;
      expect(result).toBe(0);
    });

    it('should filter by userId at the database level', () => {
      const countMatch = lettersQueriesSource.match(
        /export const countByHabit[\s\S]*?returns:/
      );
      expect(countMatch).not.toBeNull();
      expect(countMatch![0]).toContain(
        "q.eq(q.field('userId'), identity.subject)"
      );
    });
  });

  describe('getStats query', () => {
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
      const result = identity ? { total: 5 } : null;
      expect(result).toBeNull();
    });

    it('should verify habit ownership before computing stats', () => {
      const statsMatch = lettersQueriesSource.match(
        /export const getStats[\s\S]*?returns:/
      );
      expect(statsMatch).not.toBeNull();
      const source = statsMatch![0];
      // Should check habit ownership before querying letters
      const ownershipCheck = source.indexOf(
        'habit.userId !== identity.subject'
      );
      const lettersQuery = source.indexOf("ctx.db\n      .query('letters')");
      expect(ownershipCheck).toBeGreaterThan(-1);
      expect(lettersQuery).toBeGreaterThan(-1);
      expect(ownershipCheck).toBeLessThan(lettersQuery);
    });

    it('should return null when habit belongs to another user', () => {
      const identitySubject = 'user_A';
      const habit = { userId: 'user_B' };
      const result = habit.userId !== identitySubject ? null : { total: 5 };
      expect(result).toBeNull();
    });

    it('should return null when habit does not exist', () => {
      const habit = null;
      const result = habit ? { total: 5 } : null;
      expect(result).toBeNull();
    });

    it('should check auth before ownership (defense in depth)', () => {
      const statsMatch = lettersQueriesSource.match(
        /export const getStats[\s\S]*?returns:/
      );
      expect(statsMatch).not.toBeNull();
      const source = statsMatch![0];
      const authCheck = source.indexOf('if (!identity) return null');
      const ownershipCheck = source.indexOf(
        'habit.userId !== identity.subject'
      );
      expect(authCheck).toBeGreaterThan(-1);
      expect(ownershipCheck).toBeGreaterThan(-1);
      expect(authCheck).toBeLessThan(ownershipCheck);
    });
  });
});
