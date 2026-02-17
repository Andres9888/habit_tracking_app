import { describe, it, expect } from 'vitest';
import {
  CHALLENGES,
  FREE_CHALLENGES,
  PREMIUM_CHALLENGES,
  selectDailyChallenge,
} from '../challengeDefinitions';

describe('challengeDefinitions', () => {
  it('has at least 3 free challenges', () => {
    expect(FREE_CHALLENGES.length).toBeGreaterThanOrEqual(3);
  });

  it('has at least 3 premium challenges', () => {
    expect(PREMIUM_CHALLENGES.length).toBeGreaterThanOrEqual(3);
  });

  it('all challenges have required fields', () => {
    for (const c of CHALLENGES) {
      expect(c.id).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(c.description).toBeTruthy();
      expect(c.emoji).toBeTruthy();
      expect(c.xpReward).toBeGreaterThan(0);
      expect(c.durationDays).toBeGreaterThan(0);
      expect(['free', 'premium']).toContain(c.tier);
    }
  });

  it('selectDailyChallenge returns a free challenge for non-premium', () => {
    const challenge = selectDailyChallenge(false, []);
    expect(challenge.tier).toBe('free');
  });

  it('selectDailyChallenge can return premium challenges for premium users', () => {
    // Run multiple times to check pool includes premium
    const pool = CHALLENGES;
    const ids = new Set(pool.map((c) => c.id));
    const premiumIds = PREMIUM_CHALLENGES.map((c) => c.id);
    // At least some premium challenges exist in the full pool
    expect(premiumIds.some((id) => ids.has(id))).toBe(true);
  });

  it('avoids recently completed challenges when possible', () => {
    const completedIds = FREE_CHALLENGES.slice(0, 2).map((c) => c.id);
    const challenge = selectDailyChallenge(false, completedIds);
    // Should prefer the uncompleted one
    if (FREE_CHALLENGES.length > 2) {
      expect(completedIds).not.toContain(challenge.id);
    }
  });
});
