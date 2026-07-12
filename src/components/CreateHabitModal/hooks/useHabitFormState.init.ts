/** Initial-value helpers for useHabitFormState. */
import type { HabitDoc } from '../types';
import {
  SPROUT_PROGRESS_EMOJIS,
  type ProgressEmojiSet,
} from '../../../utils/progressEmojis';

export function initialStrengthAlgorithm(
  habitToEdit?: HabitDoc | null
): 'forgiving' | 'balanced' | 'strict' {
  const mode = habitToEdit?.strengthAlgorithm;
  return mode === 'forgiving' || mode === 'balanced' || mode === 'strict'
    ? mode
    : 'balanced';
}

/** New habits default to Sprout; edit mode keeps stored set (or undefined). */
export function initialProgressEmojis(
  habitToEdit?: HabitDoc | null
): ProgressEmojiSet | undefined {
  const stored = habitToEdit?.progressEmojis as ProgressEmojiSet | undefined;
  if (stored) return stored;
  return habitToEdit ? undefined : { ...SPROUT_PROGRESS_EMOJIS };
}
