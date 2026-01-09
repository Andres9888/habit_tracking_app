/**
 * Contextual Message Utilities
 * Generates motivational messages based on streak progress
 */

import type { ContextualMessageData } from './types';
import { MILESTONE_MESSAGES } from './messageConstants';

// Re-export MESSAGE_STYLES for backward compatibility
export { MESSAGE_STYLES } from './messageConstants';

export function getContextualMessage(
  currentStreak: number,
  bestStreak: number,
  todayCompleted: boolean
): ContextualMessageData {
  // New record achieved
  if (currentStreak > 0 && currentStreak > bestStreak) {
    return { emoji: '🎉', message: 'New personal record!', type: 'record' };
  }

  // Just tied the record
  if (currentStreak > 0 && currentStreak === bestStreak && bestStreak > 1) {
    return {
      emoji: '🏆',
      message: 'You matched your best! Keep going!',
      type: 'celebrate',
    };
  }

  // Zero streak - encourage starting
  if (currentStreak === 0) {
    if (todayCompleted) {
      return {
        emoji: '🚀',
        message: 'Great start! Day 1 begins!',
        type: 'start',
      };
    }
    return { emoji: '⚡', message: 'Start a new streak today!', type: 'start' };
  }

  // Has a record to beat - show progress
  const daysToRecord = bestStreak - currentStreak;
  if (daysToRecord > 0 && daysToRecord <= 3) {
    return {
      emoji: '🔥',
      message: `${daysToRecord} more ${daysToRecord === 1 ? 'day' : 'days'} to beat your record!`,
      type: 'motivation',
    };
  }

  if (daysToRecord > 3 && daysToRecord <= 7) {
    return {
      emoji: '💪',
      message: `Keep going! ${daysToRecord} days to your best!`,
      type: 'motivation',
    };
  }

  // General motivation based on streak milestones
  return getMilestoneMessage(currentStreak, daysToRecord);
}

function getMilestoneMessage(
  currentStreak: number,
  daysToRecord: number
): ContextualMessageData {
  if (MILESTONE_MESSAGES[currentStreak]) {
    return MILESTONE_MESSAGES[currentStreak];
  }

  if (daysToRecord > 7) {
    return {
      emoji: '🔗',
      message: 'Keep the chain going!',
      type: 'motivation',
    };
  }

  return {
    emoji: '✨',
    message: 'Great progress! Keep it up!',
    type: 'motivation',
  };
}
