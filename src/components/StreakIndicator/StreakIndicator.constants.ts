/**
 * Constants for StreakIndicator component
 *
 * Milestone Badges:
 * - 7 days: ⭐ (Star) - 1 Week Strong
 * - 30 days: 🏆 (Trophy) - Monthly Champion
 * - 100 days: 💎 (Diamond) - Legendary
 */

import type { Milestone, MilestoneBadge } from './StreakIndicator.types';

export const MILESTONES: readonly Milestone[] = [7, 30, 100];

export const MILESTONE_BADGES: Record<Milestone, MilestoneBadge> = {
  7: { color: '#f59e0b', emoji: '⭐', label: '1 Week Strong' }, // amber-500
  30: { color: '#eab308', emoji: '🏆', label: 'Monthly Champion' }, // yellow-500
  100: { color: '#8b5cf6', emoji: '💎', label: 'Legendary' }, // violet-500
};

export const COLORS = {
  // stone-600
  bestStreakBg: '#fef3c7',

  // amber-100
  bestStreakText: '#92400e',

  // amber-800
  milestoneBadgeBgAchieved: '#fef3c7',

  // amber-100
  milestoneBadgeBgUnachieved: '#f5f5f4',

  // stone-100
  milestoneBadgeBorder: '#fcd34d',

  // amber-300
  milestoneLabelAchieved: '#78350f',

  // amber-900
  milestoneLabelUnachieved: '#a8a29e',

  // stone-500
  streakNumber: '#1c1917',

  // stone-900
  streakLabel: '#57534e',

  zeroStreakEmoji: '#a8a29e',

  // stone-400
  zeroStreakText: '#78716c', // stone-400
} as const;
