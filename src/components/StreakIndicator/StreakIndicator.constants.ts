/**
 * Constants for StreakIndicator component
 *
 * Milestone Badges - Unified with MilestoneProgress system:
 * - 3 days: ⚡ Habit Starter
 * - 7 days: ⭐ Week Warrior
 * - 14 days: 🔥 Two Week Titan
 * - 21 days: 🏅 Habit Builder
 * - 30 days: 🏆 Monthly Master
 * - 60 days: 💎 Two Month Diamond
 * - 90 days: 🌟 Quarterly Legend
 * - 100 days: 💯 Century Club
 * - 365 days: 👑 Year Hero
 */

import { colors, milestoneColors } from '../../theme/colors';
import type { Milestone, MilestoneBadge } from './StreakIndicator.types';

export const MILESTONES: readonly Milestone[] = [3, 7, 14, 21, 30, 60, 90, 100, 365];

export const MILESTONE_BADGES: Record<Milestone, MilestoneBadge> = {
  3: { color: milestoneColors.amber, emoji: '⚡', label: 'Habit Starter' },
  7: { color: milestoneColors.amber, emoji: '⭐', label: 'Week Warrior' },
  14: { color: milestoneColors.amber, emoji: '🔥', label: 'Two Week Titan' },
  21: { color: milestoneColors.yellow, emoji: '🏅', label: 'Habit Builder' },
  30: { color: milestoneColors.yellow, emoji: '🏆', label: 'Monthly Master' },
  60: { color: milestoneColors.yellow, emoji: '💎', label: 'Two Month Diamond' },
  90: { color: milestoneColors.violet, emoji: '🌟', label: 'Quarterly Legend' },
  100: { color: milestoneColors.violet, emoji: '💯', label: 'Century Club' },
  365: { color: milestoneColors.violet, emoji: '👑', label: 'Year Hero' },
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
