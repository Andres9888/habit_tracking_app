import {
  STREAK_MILESTONES,
  getMilestoneForStreak,
  checkStreakMilestoneCrossed,
} from '../constants';

describe('Enhanced Streak Milestones', () => {
  it('includes all milestone days: 7, 14, 30, 60, 90, 100, 365', () => {
    const days = STREAK_MILESTONES.map((m) => m.days);
    expect(days).toEqual([7, 14, 30, 60, 90, 100, 365]);
  });

  it('returns correct milestone for exact day match', () => {
    expect(getMilestoneForStreak(14)?.title).toContain('Two Weeks');
    expect(getMilestoneForStreak(60)?.title).toContain('Fire');
    expect(getMilestoneForStreak(90)?.title).toContain('Quarter Year');
    expect(getMilestoneForStreak(365)?.title).toContain('Legendary');
  });

  it('returns null for non-milestone days', () => {
    expect(getMilestoneForStreak(15)).toBeNull();
    expect(getMilestoneForStreak(50)).toBeNull();
  });

  it('detects milestone crossing for new milestones', () => {
    expect(checkStreakMilestoneCrossed(13, 14)?.days).toBe(14);
    expect(checkStreakMilestoneCrossed(59, 60)?.days).toBe(60);
    expect(checkStreakMilestoneCrossed(89, 90)?.days).toBe(90);
    expect(checkStreakMilestoneCrossed(364, 365)?.days).toBe(365);
  });

  it('does not trigger on downward movement', () => {
    expect(checkStreakMilestoneCrossed(15, 14)).toBeNull();
  });
});
