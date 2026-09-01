/**
 * useHabitAdvancedState - the four "More to customize" fields.
 *
 * Split out of useHabitFormState so that file stays under the 100-line limit;
 * these four move together because they are all edited in the same panel.
 */

import { useState } from 'react';
import type { HabitDoc } from '../types';
import type { ProgressEmojiSet } from '../../../utils/progressEmojis';

export function useHabitAdvancedState(habitToEdit?: HabitDoc | null) {
  const [strengthAlgorithm, setStrengthAlgorithm] = useState<
    'forgiving' | 'balanced' | 'strict'
  >(() => {
    const mode = habitToEdit?.strengthAlgorithm;
    return mode === 'forgiving' || mode === 'balanced' || mode === 'strict'
      ? mode
      : 'balanced';
  });
  const [progressEmojis, setProgressEmojis] = useState<
    ProgressEmojiSet | undefined
  >(habitToEdit?.progressEmojis as ProgressEmojiSet | undefined);
  const [streakGoal, setStreakGoal] = useState<number>(
    habitToEdit?.goalDuration ?? 0
  );
  const [why, setWhy] = useState('');

  return {
    progressEmojis,
    setProgressEmojis,
    setStreakGoal,
    setStrengthAlgorithm,
    setWhy,
    streakGoal,
    strengthAlgorithm,
    why,
  };
}
