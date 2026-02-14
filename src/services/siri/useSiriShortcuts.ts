/**
 * useSiriShortcuts - Hook for Siri Shortcuts integration.
 *
 * Handles:
 * - Suggesting shortcuts for all habits on mount
 * - Donating shortcuts on habit completion
 * - Listening for Siri-initiated completions
 */
import { useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import {
  addShortcutListener,
  donateShortcut,
  suggestShortcuts,
  isSiriAvailable,
} from './SiriShortcutService';
import type { HabitId } from '../../features/habits/types';

interface UseSiriShortcutsOptions {
  /** All active habits to suggest as shortcuts */
  habits: Array<{ _id: HabitId; name: string; icon?: string }>;
  /** Callback when Siri triggers a habit completion */
  onSiriComplete?: (habitId: string) => void;
}

/**
 * Hook to integrate Siri Shortcuts with the habit tracking system.
 *
 * Returns a `donateCompletion` function to call whenever a habit is completed,
 * teaching Siri about the user's patterns.
 */
export function useSiriShortcuts({
  habits,
  onSiriComplete,
}: UseSiriShortcutsOptions) {
  // Suggest all habits as shortcuts on mount / habit list change
  useEffect(() => {
    if (!isSiriAvailable() || habits.length === 0) return;
    suggestShortcuts(habits);
  }, [habits]);

  // Listen for Siri-initiated completions
  useEffect(() => {
    if (!isSiriAvailable() || !onSiriComplete) return;
    const cleanup = addShortcutListener(({ habitId }) => {
      onSiriComplete(habitId);
    });
    return cleanup;
  }, [onSiriComplete]);

  /** Call when a habit is completed to donate the interaction to Siri */
  const donateCompletion = useCallback(
    (habitId: string, habitName: string, habitEmoji?: string) => {
      if (Platform.OS !== 'ios') return;
      donateShortcut(habitId, habitName, habitEmoji);
    },
    []
  );

  return { donateCompletion, isSiriAvailable: isSiriAvailable() };
}
