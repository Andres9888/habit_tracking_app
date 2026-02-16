/**
 * Celebration Tiers - Proportional celebration intensity by milestone level
 *
 * Ensures celebrations ESCALATE as users achieve higher milestones.
 * A 7-day streak should feel smaller than a 100-day streak.
 *
 * Design Principle: Emotional proportionality — bigger achievement = bigger reward.
 */

import type { StrengthLevel } from '../HabitStrengthIndicator';

export interface CelebrationTier {
  /** Number of confetti particles */
  confettiCount: number;
  /** Confetti explosion speed (higher = faster) */
  explosionSpeed: number;
  /** Confetti fall speed in ms (lower = faster fall) */
  fallSpeed: number;
  /** Haptic intensity: 'light' | 'medium' | 'heavy' */
  hapticIntensity: 'light' | 'medium' | 'heavy';
  /** Whether to play celebration sound */
  playSound: boolean;
  /** Sound type to use */
  soundType: 'chime' | 'pop' | 'success';
  /** Celebration emoji */
  emoji: string;
  /** Celebration message */
  message: string;
}

/**
 * Maps strength levels to proportional celebration intensities.
 *
 * starting (0-19%): Not a milestone, no celebration
 * building (20-39%): Small celebration — you're getting started
 * developing (40-59%): Medium celebration — real progress
 * strong (60-79%): Large celebration — impressive commitment
 * automatic (80-100%): Maximum celebration — habit is locked in!
 */
export const CELEBRATION_TIERS: Record<StrengthLevel, CelebrationTier> = {
  starting: {
    confettiCount: 0,
    explosionSpeed: 0,
    fallSpeed: 3000,
    hapticIntensity: 'light',
    playSound: false,
    soundType: 'chime',
    emoji: '🌱',
    message: 'Getting started!',
  },
  building: {
    confettiCount: 40,
    explosionSpeed: 250,
    fallSpeed: 3000,
    hapticIntensity: 'light',
    playSound: true,
    soundType: 'chime',
    emoji: '🌿',
    message: 'Building momentum!',
  },
  developing: {
    confettiCount: 80,
    explosionSpeed: 300,
    fallSpeed: 2800,
    hapticIntensity: 'medium',
    playSound: true,
    soundType: 'pop',
    emoji: '🌳',
    message: 'Real progress!',
  },
  strong: {
    confettiCount: 150,
    explosionSpeed: 350,
    fallSpeed: 2500,
    hapticIntensity: 'heavy',
    playSound: true,
    soundType: 'success',
    emoji: '💪',
    message: 'Incredible commitment!',
  },
  automatic: {
    confettiCount: 250,
    explosionSpeed: 400,
    fallSpeed: 2200,
    hapticIntensity: 'heavy',
    playSound: true,
    soundType: 'success',
    emoji: '🏆',
    message: "It's automatic!",
  },
};

/**
 * Streak milestone tiers for streak-based celebrations.
 * Used by CelebrationScreen when isStreakMilestone is true.
 */
export interface StreakCelebrationTier {
  confettiCount: number;
  hapticIntensity: 'light' | 'medium' | 'heavy';
  soundType: 'chime' | 'pop' | 'success';
  emoji: string;
  message: string;
}

export const STREAK_MILESTONES: Array<{
  days: number;
  tier: StreakCelebrationTier;
}> = [
  {
    days: 3,
    tier: {
      confettiCount: 30,
      hapticIntensity: 'light',
      soundType: 'chime',
      emoji: '🔥',
      message: '3 days strong!',
    },
  },
  {
    days: 7,
    tier: {
      confettiCount: 60,
      hapticIntensity: 'medium',
      soundType: 'pop',
      emoji: '⭐',
      message: 'One week streak!',
    },
  },
  {
    days: 14,
    tier: {
      confettiCount: 90,
      hapticIntensity: 'medium',
      soundType: 'pop',
      emoji: '🌟',
      message: 'Two weeks strong!',
    },
  },
  {
    days: 21,
    tier: {
      confettiCount: 120,
      hapticIntensity: 'medium',
      soundType: 'success',
      emoji: '💫',
      message: '21 days — habit forming!',
    },
  },
  {
    days: 30,
    tier: {
      confettiCount: 150,
      hapticIntensity: 'heavy',
      soundType: 'success',
      emoji: '🎯',
      message: 'One month milestone!',
    },
  },
  {
    days: 60,
    tier: {
      confettiCount: 200,
      hapticIntensity: 'heavy',
      soundType: 'success',
      emoji: '💎',
      message: '60 days — unstoppable!',
    },
  },
  {
    days: 100,
    tier: {
      confettiCount: 300,
      hapticIntensity: 'heavy',
      soundType: 'success',
      emoji: '👑',
      message: '100 DAYS! Legendary!',
    },
  },
  {
    days: 365,
    tier: {
      confettiCount: 500,
      hapticIntensity: 'heavy',
      soundType: 'success',
      emoji: '🏆',
      message: 'ONE YEAR! Incredible!',
    },
  },
];

/**
 * Get the celebration tier for a given streak day count.
 * Returns the highest matching tier.
 */
export function getStreakCelebrationTier(
  days: number
): StreakCelebrationTier | null {
  // Find highest matching milestone
  for (let i = STREAK_MILESTONES.length - 1; i >= 0; i--) {
    if (days >= STREAK_MILESTONES[i].days) {
      return STREAK_MILESTONES[i].tier;
    }
  }
  return null;
}

/**
 * Special celebration types beyond regular milestones.
 */
export const SPECIAL_CELEBRATIONS = {
  /** First-ever habit completion — make it memorable */
  firstEverCompletion: {
    confettiCount: 80,
    hapticIntensity: 'medium' as const,
    soundType: 'success' as const,
    emoji: '🎉',
    message: 'Your first step! Every journey starts here.',
  },
  /** Perfect week — all habits completed every day for 7 days */
  perfectWeek: {
    confettiCount: 200,
    hapticIntensity: 'heavy' as const,
    soundType: 'success' as const,
    emoji: '🌟',
    message: 'Perfect week! Every habit, every day!',
  },
} as const;
