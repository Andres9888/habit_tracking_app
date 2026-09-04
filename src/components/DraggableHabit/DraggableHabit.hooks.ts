/**
 * @module DraggableHabit.hooks
 *
 * Habit display logic: emoji extraction, deterministic accent color picking,
 * and the {@link useDraggableHabitLogic} hook that combines them.
 */

/**
 * Extract a leading emoji from a habit name, e.g. "💪 Push-ups" → { emoji: "💪", name: "Push-ups" }.
 * Returns empty emoji if the name doesn't start with one.
 */
export const getEmojiAndName = (
  fullName: string
): { emoji: string; name: string } => {
  const emojiRegex = /(?![0-9#*])\p{Emoji}/u;
  const match = fullName.match(emojiRegex);

  if (match && match.index === 0) {
    const emoji = match[0];
    const name = fullName.slice(emoji.length).trim();
    return { emoji, name };
  }

  return { emoji: '', name: fullName };
};

import type { Habit } from './types';
import { pickUsableAccent } from '@/theme/iconTokens/usableAccent';

/** Premium accent color palette — deterministically assigned per habit name. */
const ACCENT_COLORS = [
  '#2563eb', // blue-600 - 20% deeper (was #3b82f6)
  '#ea580c', // orange-600 - richer (was #f97316)
  '#059669', // emerald-600 - deeper (was #10b981)
  '#7c3aed', // violet-600 - richer (was #8b5cf6)
  '#0891b2', // cyan-600 - deeper (was #06b6d4)
  '#db2777', // pink-600 - sophisticated (was #ec4899)
  '#ca8a04', // yellow-600 - golden (was #eab308)
];

/** Pick an accent color deterministically from a string (sum of char codes mod palette length). */
export const pickAccentColor = (input: string): string => {
  if (!input) {
    return ACCENT_COLORS[0];
  }

  const codeSum = [...input].reduce(
    (sum, char) => sum + (char.codePointAt(0) ?? 0),
    0
  );

  return ACCENT_COLORS[codeSum % ACCENT_COLORS.length];
};

/**
 * Derives display properties for a habit: resolved emoji, cleaned name, and accent color.
 * Color priority: explicit `habit.color` > legacy `iconColor` > deterministic from name.
 * Near-white hexes (e.g. a template's `#FFFFFF`) are skipped so the accent bar and
 * check-in cells never render invisible.
 */
export const useDraggableHabitLogic = (habit: Habit) => {
  const { emoji: extractedEmoji, name } = getEmojiAndName(habit.name);
  const emoji = habit.icon || extractedEmoji;
  const accentColor =
    pickUsableAccent(habit.color, habit.iconColor) ??
    pickAccentColor(name || habit.name);

  return {
    accentColor,
    emoji,
    name,
  };
};
