/**
 * Use Completion Sound Hook
 *
 * Hook to play completion sounds when habits are completed.
 *
 * Created by Opus.
 */

import { useEffect, useRef } from 'react';
import { playCompletionSound } from '../../utils/sounds';
import type { HabitSettings } from '../types';

interface UseCompletionSoundOptions {
  settings: HabitSettings | undefined;
  toggleHabit: (args: { habitId: string; date: string }) => Promise<void>;
  getHabitStatus: (habitId: string, date: string) => string | undefined;
}

/**
 * Hook that plays a sound when a habit is completed.
 * Wraps the toggleHabit function to play sound after successful completion.
 */
export function useCompletionSound({
  settings,
  toggleHabit,
  getHabitStatus,
}: UseCompletionSoundOptions) {
  const previousStatusRef = useRef<Map<string, string>>(new Map());

  // Get completion sound settings
  const soundEnabled = settings?.completionSoundEnabled ?? false;
  const soundSelected = settings?.completionSoundSelected ?? 'chime';

  // Watch for habit completions and play sound
  const handleToggleWithSound = async (args: {
    habitId: string;
    date: string;
  }) => {
    const { habitId, date } = args;

    // Get the status before toggling
    const previousStatus = getHabitStatus(habitId, date);
    previousStatusRef.current.set(`${habitId}-${date}`, previousStatus ?? 'none');

    // Perform the toggle
    await toggleHabit(args);

    // Check if this was a completion (was not done, now will be done)
    // We need to wait for the state to update, so we use a small delay
    setTimeout(() => {
      const prevStatus = previousStatusRef.current.get(`${habitId}-${date}`);

      // Play sound if:
      // 1. Sound is enabled
      // 2. The habit was not previously completed
      // 3. We have a valid sound to play
      if (
        soundEnabled &&
        prevStatus !== 'done' &&
        soundSelected
      ) {
        playCompletionSound(soundSelected);
      }

      // Clean up
      previousStatusRef.current.delete(`${habitId}-${date}`);
    }, 100);
  };

  return {
    toggleHabit: handleToggleWithSound,
  };
}
