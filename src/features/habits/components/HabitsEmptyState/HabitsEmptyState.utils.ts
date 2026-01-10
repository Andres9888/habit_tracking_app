import {
  MORNING_HABITS,
  AFTERNOON_HABITS,
  EVENING_HABITS,
} from './HabitsEmptyState.constants';
import type { TimeContext } from './HabitsEmptyState.types';

/**
 * Returns habit suggestions based on the current time of day.
 * Morning: 5am-12pm, Afternoon: 12pm-5pm, Evening: 5pm-5am
 */
export function getTimeBasedHabits(): TimeContext {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return {
      greeting: 'Good morning',
      habits: MORNING_HABITS,
      period: 'morning',
    };
  }

  if (hour >= 12 && hour < 17) {
    return {
      greeting: 'Good afternoon',
      habits: AFTERNOON_HABITS,
      period: 'afternoon',
    };
  }

  return {
    greeting: 'Good evening',
    habits: EVENING_HABITS,
    period: 'evening',
  };
}

/**
 * Returns the emoji for a given time period.
 */
export function getPeriodEmoji(period: string): string {
  if (period === 'morning') return '🌅';
  if (period === 'afternoon') return '☀️';
  return '🌙';
}

/**
 * Returns floating particle emojis for a given time period.
 */
export function getParticlesForPeriod(period: string): string[] {
  if (period === 'morning') return ['✨', '🌟', '💫'];
  if (period === 'afternoon') return ['⚡', '💪', '🎯'];
  return ['🌙', '⭐', '💤'];
}

/**
 * Returns the label for a given time period.
 */
export function getPeriodLabel(period: string): string {
  if (period === 'morning') return '🌅 Morning picks';
  if (period === 'afternoon') return '☀️ Afternoon picks';
  return '🌙 Evening picks';
}
