/**
 * TodaysFocusCard Milestones
 *
 * Milestone thresholds and celebration configurations
 */

import type { MilestoneCelebrationConfig } from './TodaysFocusCard.types';

/**
 * Milestone thresholds for goal calculation
 */
export const MILESTONE_THRESHOLDS = [
  3, 7, 14, 21, 30, 60, 90, 100, 365,
] as const;

/**
 * Celebration milestone configurations
 */
export const CELEBRATION_MILESTONES: MilestoneCelebrationConfig[] = [
  {
    badge: '⚡',
    days: 3,
    message: '🎉 You hit 3 days!',
    name: 'Habit Starter',
    subtext: "You're building real momentum!",
  },
  {
    badge: '⭐',
    days: 7,
    message: '🎉 You hit 7 days!',
    name: 'Week Warrior',
    subtext: 'A whole week strong!',
  },
  {
    badge: '🔥',
    days: 14,
    message: '🎉 You hit 14 days!',
    name: 'Two Week Titan',
    subtext: 'Two weeks of consistency!',
  },
  {
    badge: '🏅',
    days: 21,
    message: '🎉 You hit 21 days!',
    name: 'Habit Builder',
    subtext: "You're building a real habit!",
  },
  {
    badge: '🏆',
    days: 30,
    message: '🎉 You hit 30 days!',
    name: 'Monthly Master',
    subtext: 'A full month — incredible!',
  },
  {
    badge: '💎',
    days: 60,
    message: '🎉 You hit 60 days!',
    name: 'Two Month Diamond',
    subtext: 'Diamond-level dedication!',
  },
  {
    badge: '🌟',
    days: 90,
    message: '🎉 You hit 90 days!',
    name: 'Quarterly Legend',
    subtext: 'A quarter year of excellence!',
  },
  {
    badge: '💯',
    days: 100,
    message: '🎉 You hit 100 days!',
    name: 'Century Club',
    subtext: 'Welcome to the Century Club!',
  },
  {
    badge: '👑',
    days: 365,
    message: '🎉 You hit 365 days!',
    name: 'Year Hero',
    subtext: "A whole year — you're legendary!",
  },
];

/**
 * Gets the celebration milestone config for a given streak
 */
export function getCelebrationMilestone(
  currentStreak: number
): MilestoneCelebrationConfig | null {
  return CELEBRATION_MILESTONES.find((m) => m.days === currentStreak) ?? null;
}

/**
 * Gets the next milestone after the current streak
 */
export function getNextCelebrationMilestone(
  currentStreak: number
): MilestoneCelebrationConfig | null {
  return CELEBRATION_MILESTONES.find((m) => m.days > currentStreak) ?? null;
}
