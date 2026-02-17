/**
 * StatCardGenerator — barrel export
 *
 * Shareable stat cards for social media:
 *   - 30-Day Streak 🔥
 *   - Monthly Recap 📊
 *   - Year in Review 🌟
 *
 * Usage:
 *   import { StatCardGenerator } from '@/components/StatCardGenerator';
 *   import type { StreakCardData, MonthlyRecapCardData, YearInReviewCardData } from '@/components/StatCardGenerator';
 */

export { StatCardGenerator } from './StatCardGenerator';
export { default } from './StatCardGenerator';
export type {
  StatCardType,
  StatCardVariant,
  StatCardData,
  StreakCardData,
  MonthlyRecapCardData,
  YearInReviewCardData,
  StatCardGeneratorProps,
} from './StatCardGenerator.types';
