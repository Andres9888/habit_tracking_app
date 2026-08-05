/**
 * Milestone Definitions
 *
 * Static milestone thresholds, badges, and names for the gamification system.
 */

import type { Milestone } from './milestones.types';

/**
 * Milestone thresholds with their badges and names.
 *
 * | Days | Badge | Name |
 * | 3    | ⚡    | Habit Starter |
 * | 7    | ⭐    | Week Warrior |
 * | 14   | 🔥    | Two Week Titan |
 * | 21   | 🏅    | Habit Builder |
 * | 30   | 🏆    | Monthly Master |
 * | 60   | 💎    | Two Month Diamond |
 * | 90   | 🌟    | Quarterly Legend |
 * | 100  | 💯    | Century Club |
 * | 365  | 👑    | Year Hero |
 */
export const MILESTONES: Milestone[] = [
  { badge: '⚡', days: 3, name: 'Habit Starter' },
  { badge: '⭐', days: 7, name: 'Week Warrior' },
  { badge: '🔥', days: 14, name: 'Two Week Titan' },
  { badge: '🏅', days: 21, name: 'Habit Builder' },
  { badge: '🏆', days: 30, name: 'Monthly Master' },
  { badge: '💎', days: 60, name: 'Two Month Diamond' },
  { badge: '🌟', days: 90, name: 'Quarterly Legend' },
  { badge: '💯', days: 100, name: 'Century Club' },
  { badge: '👑', days: 365, name: 'Year Hero' },
];
