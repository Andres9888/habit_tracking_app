/**
 * Constants for StreakIndicator component
 *
 * Milestone Badges:
 * - 7 days: ⭐ (Star) - 1 Week Strong
 * - 30 days: 🏆 (Trophy) - Monthly Champion
 * - 100 days: 💎 (Diamond) - Legendary
 */

import { colors, milestoneColors } from '../../theme/colors';
import type { Milestone, MilestoneBadge } from './StreakIndicator.types';

export const MILESTONES: readonly Milestone[] = [7, 30, 100];

export const MILESTONE_BADGES: Record<Milestone, MilestoneBadge> = {
  7: { color: milestoneColors.amber, emoji: '⭐', label: '1 Week Strong' },
  30: { color: milestoneColors.yellow, emoji: '🏆', label: 'Monthly Champion' },
  100: { color: milestoneColors.violet, emoji: '💎', label: 'Legendary' },
};

export const COLORS = {
  bestStreakBg: milestoneColors.amberLight,

  bestStreakText: milestoneColors.amber800,

  milestoneBadgeBgAchieved: milestoneColors.amberLight,

  milestoneBadgeBgUnachieved: milestoneColors.stone100,

  milestoneBadgeBorder: milestoneColors.amberBorder,

  milestoneLabelAchieved: milestoneColors.amberDark,

  milestoneLabelUnachieved: milestoneColors.stone,

  streakLabel: milestoneColors.stone600,

  streakNumber: milestoneColors.stone900,

  zeroStreakEmoji: milestoneColors.stone,

  zeroStreakText: colors.gray[500],
} as const;
