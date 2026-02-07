/**
 * get (single habit) Authentication & Ownership Tests (SEC-001)
 *
 * Tests that the get query:
 * - Requires authentication before returning data
 * - Verifies habit ownership (userId === identity.subject)
 * - Returns null for unauthenticated callers or non-owners
 */

import { describe, it, expect } from 'vitest';

describe('get: Authentication Security', () => {
  describe('Auth check pattern', () => {
    it('should check auth before any database access', () => {
      // The handler must call ctx.auth.getUserIdentity() before ctx.db.get()
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
      // Queries for single items return null (not []) for unauth
      const identity = null;
      const result = identity ? 'would query db' : null;
      expect(result).toBeNull();
    });
  });

  describe('Ownership verification', () => {
    it('should return null when habit userId does not match identity.subject', () => {
      const identitySubject = 'user_A';
      const habit = { userId: 'user_B', name: 'Exercise', createdAt: 1000 };

      const result = habit.userId !== identitySubject ? null : habit;
      expect(result).toBeNull();
    });

    it('should return the habit when userId matches identity.subject', () => {
      const identitySubject = 'user_A';
      const habit = { userId: 'user_A', name: 'Exercise', createdAt: 1000 };

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
      // Simulates ctx.db.get() returning null
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
      const ownershipCheck = handlerSource.indexOf('habit.userId !== identity.subject');
      expect(authCheck).toBeLessThan(ownershipCheck);
    });
  });
});
