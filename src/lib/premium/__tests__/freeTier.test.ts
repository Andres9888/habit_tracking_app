/**
 * Free-tier boundary contract.
 *
 * These assertions exist because the cap previously disagreed with itself
 * across surfaces: creation enforced nothing, unarchive enforced three, and the
 * archived-habits modal hardcoded "limit not reached". The counting rules below
 * are the shared definition all three now read from.
 */

import {
  FREE_HABIT_LIMIT,
  canAddHabit,
  countActiveHabits,
  isPremiumRequiredError,
} from '../freeTier';

const active = { archived: false, paused: false };

describe('countActiveHabits', () => {
  it('counts habits with no archived field, which never-archived habits lack', () => {
    expect(countActiveHabits([{}, {}])).toBe(2);
  });

  it('excludes archived habits — archiving is how a user frees a slot', () => {
    expect(countActiveHabits([active, { archived: true }])).toBe(1);
  });

  it('excludes paused habits, matching the unarchive check on the server', () => {
    expect(countActiveHabits([active, { paused: true }])).toBe(1);
  });
});

describe('canAddHabit', () => {
  it('allows a free user below the cap', () => {
    const habits = Array.from({ length: FREE_HABIT_LIMIT - 1 }, () => active);
    expect(canAddHabit(false, habits)).toBe(true);
  });

  it('blocks a free user at the cap', () => {
    const habits = Array.from({ length: FREE_HABIT_LIMIT }, () => active);
    expect(canAddHabit(false, habits)).toBe(false);
  });

  it('never blocks a premium user', () => {
    const habits = Array.from({ length: FREE_HABIT_LIMIT + 5 }, () => active);
    expect(canAddHabit(true, habits)).toBe(true);
  });

  it('ignores archived habits when deciding, so archiving really does free a slot', () => {
    const habits = [
      ...Array.from({ length: FREE_HABIT_LIMIT }, () => active),
      { archived: true },
    ];
    expect(canAddHabit(false, habits)).toBe(false);
    expect(
      canAddHabit(false, [
        ...Array.from({ length: FREE_HABIT_LIMIT - 1 }, () => active),
        { archived: true },
      ])
    ).toBe(true);
  });
});

describe('isPremiumRequiredError', () => {
  it('recognises the server entitlement error', () => {
    expect(
      isPremiumRequiredError(new Error('PREMIUM_REQUIRED: Free plan covers 3'))
    ).toBe(true);
  });

  it('treats ordinary failures as retryable, not as paywall moments', () => {
    expect(isPremiumRequiredError(new Error('Network request failed'))).toBe(
      false
    );
    expect(isPremiumRequiredError(undefined)).toBe(false);
  });

  it('matches Convex string errors, which arrive without an Error wrapper', () => {
    expect(isPremiumRequiredError('PREMIUM_REQUIRED: cap reached')).toBe(true);
  });
});
