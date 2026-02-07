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

  bestStreakText: '#92400e', // amber-800 (no theme token)

  milestoneBadgeBgAchieved: milestoneColors.amberLight,

  milestoneBadgeBgUnachieved: '#f5f5f4', // stone-100 (no exact theme token)

  milestoneBadgeBorder: milestoneColors.amberBorder,

  milestoneLabelAchieved: milestoneColors.amberDark,

  milestoneLabelUnachieved: milestoneColors.stone,

  streakLabel: '#57534e', // stone-600 (no theme token)

  streakNumber: '#1c1917', // stone-900 (no theme token)

  zeroStreakEmoji: milestoneColors.stone,

  zeroStreakText: colors.gray[500],
} as const;
