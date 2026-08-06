/**
 * StreakIndicator Token Migration Tests (Phase 2)
 * Verifies that StreakIndicator.constants uses theme milestone tokens
 * instead of hardcoded hex values.
 */

import { colors, milestoneColors } from '@/theme/colors';
import {
  COLORS,
  MILESTONE_BADGES,
} from '@/components/StreakIndicator/StreakIndicator.constants';

describe('StreakIndicator Token Migration - Phase 2', () => {
  describe('MILESTONE_BADGES use milestoneColors tokens', () => {
    it('7-day badge uses milestoneColors.amber', () => {
      expect(MILESTONE_BADGES[7].color).toBe(milestoneColors.amber);
      expect(MILESTONE_BADGES[7].color).toBe('#F59E0B');
    });

    it('30-day badge uses milestoneColors.yellow', () => {
      expect(MILESTONE_BADGES[30].color).toBe(milestoneColors.yellow);
      expect(MILESTONE_BADGES[30].color).toBe('#EAB308');
    });

    it('100-day badge uses milestoneColors.violet', () => {
      expect(MILESTONE_BADGES[100].color).toBe(milestoneColors.violet);
      expect(MILESTONE_BADGES[100].color).toBe('#8B5CF6');
    });
  });

  describe('COLORS use milestone and theme tokens', () => {
    it('bestStreakBg uses milestoneColors.amberLight', () => {
      expect(COLORS.bestStreakBg).toBe(milestoneColors.amberLight);
    });

    it('milestoneBadgeBgAchieved uses milestoneColors.amberLight', () => {
      expect(COLORS.milestoneBadgeBgAchieved).toBe(milestoneColors.amberLight);
    });

    it('milestoneBadgeBorder uses milestoneColors.amberBorder', () => {
      expect(COLORS.milestoneBadgeBorder).toBe(milestoneColors.amberBorder);
      expect(COLORS.milestoneBadgeBorder).toBe('#FCD34D');
    });

    it('milestoneLabelAchieved uses milestoneColors.amberDark', () => {
      expect(COLORS.milestoneLabelAchieved).toBe(milestoneColors.amberDark);
      expect(COLORS.milestoneLabelAchieved).toBe('#78350F');
    });

    it('milestoneLabelUnachieved uses milestoneColors.stone', () => {
      expect(COLORS.milestoneLabelUnachieved).toBe(milestoneColors.stone);
      expect(COLORS.milestoneLabelUnachieved).toBe('#A8A29E');
    });

    it('zeroStreakEmoji uses milestoneColors.stone', () => {
      expect(COLORS.zeroStreakEmoji).toBe(milestoneColors.stone);
    });

    it('zeroStreakText uses colors.gray[500]', () => {
      expect(COLORS.zeroStreakText).toBe(colors.gray[500]);
      expect(COLORS.zeroStreakText).toBe('#78716c');
    });
  });
});
