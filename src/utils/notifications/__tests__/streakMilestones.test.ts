import { isMilestone, STREAK_MILESTONES } from '../streakMilestones';

describe('streakMilestones', () => {
  describe('isMilestone', () => {
    it('returns true for all defined milestones', () => {
      for (const m of STREAK_MILESTONES) {
        expect(isMilestone(m)).toBe(true);
      }
    });

    it('returns false for non-milestone values', () => {
      expect(isMilestone(1)).toBe(false);
      expect(isMilestone(5)).toBe(false);
      expect(isMilestone(15)).toBe(false);
      expect(isMilestone(99)).toBe(false);
    });
  });
});
