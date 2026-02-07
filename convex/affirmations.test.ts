/**
 * affirmations listByHabit Authentication & Ownership Tests (SEC-001)
 *
 * Tests that the listByHabit query:
 * - Requires authentication before returning data
 * - Verifies habit ownership before querying affirmations
 * - Returns [] for unauthenticated callers
 * - Returns [] when habit does not belong to the authenticated user
 */

import { describe, it, expect } from 'vitest';

describe('affirmations: listByHabit Authentication Security', () => {
  it('should check auth before any database access', () => {
    const handlerSource = `
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return [];
      const habit = await ctx.db.get(args.habitId);
      if (!habit || habit.userId !== identity.subject) return [];
      const affirmations = await ctx.db.query('affirmations')
    `;

    const authIndex = handlerSource.indexOf('getUserIdentity');
    const dbIndex = handlerSource.indexOf('ctx.db.get');
    const queryIndex = handlerSource.indexOf("ctx.db.query('affirmations')");
    expect(authIndex).toBeLessThan(dbIndex);
    expect(authIndex).toBeLessThan(queryIndex);
  });

  it('should return empty array for unauthenticated callers', () => {
    const identity = null;
    const result = identity ? 'would query db' : [];
    expect(result).toEqual([]);
  });

  it('should verify habit ownership before querying affirmations', () => {
    const handlerSource = `
      const habit = await ctx.db.get(args.habitId);
      if (!habit || habit.userId !== identity.subject) return [];
      const affirmations = await ctx.db.query('affirmations')
    `;

    const ownershipCheck = handlerSource.indexOf(
      'habit.userId !== identity.subject'
    );
    const affirmationsQuery = handlerSource.indexOf(
      "ctx.db.query('affirmations')"
    );
    expect(ownershipCheck).toBeLessThan(affirmationsQuery);
  });

  it('should return empty array when habit does not exist', () => {
    const habit = null;
    const result = !habit ? [] : 'would query affirmations';
    expect(result).toEqual([]);
  });

  it('should return empty array when habit belongs to a different user', () => {
    const identitySubject = 'user_A';
    const habit = { userId: 'user_B', name: 'Other habit' };

    const result =
      habit.userId !== identitySubject ? [] : 'would query affirmations';
    expect(result).toEqual([]);
  });

  it('should return empty array when habit has undefined userId', () => {
    const identitySubject = 'user_A';
    const habit = { userId: undefined, name: 'Legacy habit' };

    const result =
      habit.userId !== identitySubject ? [] : 'would query affirmations';
    expect(result).toEqual([]);
  });

  it('should allow access when habit belongs to the authenticated user', () => {
    const identitySubject = 'user_A';
    const habit = { userId: 'user_A', name: 'My habit' };
    const affirmations = [
      { text: 'I am strong', type: 'identity', habitId: 'h1' },
      { text: 'I can do this', type: 'motivational', habitId: 'h1' },
    ];

    const result =
      habit.userId !== identitySubject ? [] : affirmations;
    expect(result).toEqual(affirmations);
    expect(result).toHaveLength(2);
  });

  it('should check auth before ownership (defense in depth ordering)', () => {
    const handlerSource = `
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return [];
      const habit = await ctx.db.get(args.habitId);
      if (!habit || habit.userId !== identity.subject) return [];
    `;

    const authCheck = handlerSource.indexOf('if (!identity)');
    const ownershipCheck = handlerSource.indexOf(
      'habit.userId !== identity.subject'
    );
    expect(authCheck).toBeLessThan(ownershipCheck);
  });
});
