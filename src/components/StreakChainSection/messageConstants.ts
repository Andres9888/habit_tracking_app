/**
 * Milestone message constants for streak chain section
 */

import type { ContextualMessageData, MessageType } from './types';

export const MILESTONE_MESSAGES: Record<number, ContextualMessageData> = {
  1: {
    emoji: '🌱',
    message: 'Day 1 — the hardest step is done!',
    type: 'motivation',
  },
  3: {
    emoji: '💪',
    message: "3 days strong — your habit is taking shape!",
    type: 'celebrate',
  },
  7: {
    emoji: '🔥',
    message: "A full week! You're officially on fire!",
    type: 'celebrate',
  },
  14: {
    emoji: '⭐',
    message: 'Two weeks of consistency — this is real!',
    type: 'celebrate',
  },
  21: {
    emoji: '👑',
    message: '21 days — science says this is a habit now!',
    type: 'celebrate',
  },
  30: {
    emoji: '💎',
    message: "One month! You're in the top 1% of habit builders.",
    type: 'celebrate',
  },
};

export const MESSAGE_STYLES: Record<
  MessageType,
  { borderColor: string; textColor: string }
> = {
  celebrate: {
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
  },
  motivation: {
    borderColor: 'border-violet-200',
    textColor: 'text-violet-700',
  },
  record: {
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
  },
  start: {
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
  },
};
