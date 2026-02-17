/**
 * Challenge Definitions
 * All available challenges with metadata and reward tiers.
 */

import type { Challenge } from './types';

export const CHALLENGES: Challenge[] = [
  {
    id: 'complete_before_noon',
    title: 'Early Bird',
    description: 'Complete all habits before noon today',
    emoji: '🌅',
    xpReward: 50,
    tier: 'free',
    durationDays: 1,
  },
  {
    id: 'perfect_5_day_week',
    title: 'Perfect Week',
    description: 'Complete every habit for 5 days straight',
    emoji: '🏆',
    xpReward: 200,
    tier: 'free',
    durationDays: 5,
  },
  {
    id: 'try_new_template',
    title: 'Explorer',
    description: 'Try a new habit from the templates library',
    emoji: '🧭',
    xpReward: 30,
    tier: 'free',
    durationDays: 1,
  },
  {
    id: 'morning_routine_3',
    title: 'Morning Ritual',
    description: 'Complete 3 habits before 9 AM',
    emoji: '☀️',
    xpReward: 75,
    tier: 'premium',
    durationDays: 1,
  },
  {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Don\'t break your streaks on Saturday & Sunday',
    emoji: '⚔️',
    xpReward: 100,
    tier: 'premium',
    durationDays: 2,
  },
  {
    id: 'consistency_king',
    title: 'Consistency Crown',
    description: 'Maintain 100% completion for 7 consecutive days',
    emoji: '👑',
    xpReward: 300,
    tier: 'premium',
    durationDays: 7,
  },
];

export const FREE_CHALLENGES = CHALLENGES.filter((c) => c.tier === 'free');
export const PREMIUM_CHALLENGES = CHALLENGES.filter((c) => c.tier === 'premium');

/**
 * Select a daily challenge for the user.
 * Free users get free challenges; premium users get from the full pool.
 */
export function selectDailyChallenge(
  isPremium: boolean,
  completedIds: string[],
): Challenge {
  const pool = isPremium ? CHALLENGES : FREE_CHALLENGES;

  // Prefer challenges not recently completed
  const unfinished = pool.filter((c) => !completedIds.includes(c.id));
  const candidates = unfinished.length > 0 ? unfinished : pool;

  // Deterministic-ish daily rotation based on date
  const today = new Date();
  const dayIndex =
    today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate();
  return candidates[dayIndex % candidates.length];
}
