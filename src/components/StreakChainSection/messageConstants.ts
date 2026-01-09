/**
 * Milestone message constants for streak chain section
 */

import type { ContextualMessageData, MessageType } from './types';

export const MILESTONE_MESSAGES: Record<number, ContextualMessageData> = {
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
