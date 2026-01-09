/**
 * Contextual Message Utilities
 * Generates motivational messages based on streak progress
 */

import type { ContextualMessageData, MessageType } from './types';

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
  const milestoneMessages: Record<number, ContextualMessageData> = {
    1: {
      emoji: '🌱',
      message: 'Day 1 complete! Build that momentum!',
      type: 'motivation',
    },
    3: {
      emoji: '💪',
      message: '3 days strong! Habit forming!',
      type: 'celebrate',
    },
    7: {
      emoji: '🔥',
      message: "A full week! You're on fire!",
      type: 'celebrate',
    },
    14: {
      emoji: '⭐',
      message: 'Two weeks! Incredible consistency!',
      type: 'celebrate',
    },
    21: {
      emoji: '👑',
      message: 'Three weeks! Habit is forming!',
      type: 'celebrate',
    },
    30: {
      emoji: '💎',
      message: 'One month! Legendary streak!',
      type: 'celebrate',
    },
  };

  if (milestoneMessages[currentStreak]) {
    return milestoneMessages[currentStreak];
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

export const MESSAGE_STYLES: Record<
  MessageType,
  { bgColor: string; textColor: string }
> = {
  celebrate: {
    bgColor: 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200',
    textColor: 'text-emerald-700',
  },
  motivation: {
    bgColor: 'bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200',
    textColor: 'text-violet-700',
  },
  record: {
    bgColor: 'bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-200',
    textColor: 'text-amber-700',
  },
  start: {
    bgColor: 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200',
    textColor: 'text-orange-700',
  },
};
