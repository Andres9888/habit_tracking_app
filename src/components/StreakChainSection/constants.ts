/**
 * Streak Tier Configuration
 *
 * Faster progression tiers - early wins matter!
 * Milestones: Day 3, 5, 7, 14, 21, 30+
 */

import type { TierConfig } from './types';

export const TIERS: TierConfig[] = [
  { barColor: 'bg-stone-400', days: 0, icon: '', textColor: 'text-stone-700' },
  {
    barColor: 'bg-orange-500',
    days: 3,
    icon: '💪',
    textColor: 'text-orange-600',
  },
  {
    barColor: 'bg-amber-500',
    days: 5,
    icon: '⚡',
    textColor: 'text-amber-600',
  },
  { barColor: 'bg-red-500', days: 7, icon: '🔥', textColor: 'text-red-600' },
  {
    barColor: 'bg-yellow-500',
    days: 14,
    icon: '⭐',
    textColor: 'text-yellow-600',
  },
  {
    barColor: 'bg-purple-500',
    days: 21,
    icon: '👑',
    textColor: 'text-purple-600',
  },
  { barColor: 'bg-blue-500', days: 30, icon: '💎', textColor: 'text-blue-600' },
  { barColor: 'bg-pink-500', days: 60, icon: '🌟', textColor: 'text-pink-600' },
];

export function getTierInfo(streak: number) {
  let current = TIERS[0];
  let next: TierConfig | null = TIERS[1];

  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (streak >= TIERS[i].days) {
      current = TIERS[i];
      next = TIERS[i + 1] || null;
      break;
    }
  }

  const daysToNext = next ? next.days - streak : 0;
  const progress = next
    ? (streak - current.days) / (next.days - current.days)
    : 1;

  return { current, daysToNext, next, progress };
}
