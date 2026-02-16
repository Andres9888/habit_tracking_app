/**
 * Streak Milestone Constants
 * Defines milestone thresholds and their celebration configs
 */

import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

/**
 * Streak milestones per spec
 * Trigger celebration when user reaches these streak days
 */
export const STREAK_MILESTONES = [
  { color: '#10b981', days: 7, emoji: '🎊', title: 'First Week — Amazing!' },
  { color: '#f59e0b', days: 30, emoji: '🏆', title: 'One Month Strong!' },
  { color: '#8b5cf6', days: 100, emoji: '👑', title: 'Welcome to the Century Club!' },
] as const;

export type StreakMilestone = (typeof STREAK_MILESTONES)[number];

/**
 * Get milestone config for a given streak count
 * Returns null if streak doesn't match any milestone
 */
export function getMilestoneForStreak(
  streakDays: number
): StreakMilestone | null {
  return (
    STREAK_MILESTONES.find((milestone) => milestone.days === streakDays) ?? null
  );
}

/**
 * Check if a streak crosses a milestone threshold
 * @param previousStreak - Streak count before completion
 * @param currentStreak - Streak count after completion
 * @returns The milestone crossed, or null if none
 */
export function checkStreakMilestoneCrossed(
  previousStreak: number,
  currentStreak: number
): StreakMilestone | null {
  // Only trigger on upward movement
  if (currentStreak <= previousStreak) {
    return null;
  }

  // Check if any milestone was crossed
  for (const milestone of STREAK_MILESTONES) {
    if (previousStreak < milestone.days && currentStreak >= milestone.days) {
      return milestone;
    }
  }

  return null;
}

/**
 * Confetti colors derived from milestone colors + brand greens
 */
export const CONFETTI_COLORS = [
  '#10b981', // Emerald-500 (7-day)
  '#34d399', // Emerald-400
  '#f59e0b', // Amber-500 (30-day)
  '#fcd34d', // Amber-300
  '#8b5cf6', // Violet-500 (100-day)
  '#a78bfa', // Violet-400
  '#fef3c7', // Amber-100 (sparkle)
];

/** Animation timing constants */
export const ANIMATION_TIMING = {
  BADGE_BOUNCE_DAMPING: 18,
  BADGE_BOUNCE_STIFFNESS: 180,
  BADGE_SETTLE_DELAY: 200,
  BUTTON_STAGGER: 60,
  CONFETTI_DELAY: 150,
  CONTENT_FADE_DURATION: 280,
  EMOJI_BOUNCE_DELAY: 100,
  HAPTIC_DELAY: 50,
  TITLE_DELAY: 200,
} as const;
