/**
 * useFocusMode - State management for Focus Mode feature
 *
 * Manages the state of which habit is currently in focus mode,
 * and provides handlers to open/close focus mode.
 */

import { useState, useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';

export interface FocusModeState {
  /** Currently focused habit ID */
  focusedHabitId: Id<'habits'> | null;

  /** Habit name */
  habitName: string;

  /** Habit icon */
  habitIcon?: string;

  /** Habit color */
  habitColor?: string;

  /** Whether habit is completed */
  completed?: boolean;
}

export interface UseFocusModeReturn {
  /** Current focus mode state */
  focusMode: FocusModeState | null;

  /** Whether focus mode is active */
  isFocusModeActive: boolean;

  /** Open focus mode for a habit */
  openFocusMode: (habit: {
    id: Id<'habits'>;
    name: string;
    icon?: string;
    color?: string;
    completed?: boolean;
  }) => void;

  /** Close focus mode */
  closeFocusMode: () => void;

  /** Handle habit completion in focus mode */
  handleFocusModeComplete: () => void;
}

export function useFocusMode(): UseFocusModeReturn {
  const [focusMode, setFocusMode] = useState<FocusModeState | null>(null);

  const openFocusMode = useCallback(
    (habit: {
      id: Id<'habits'>;
      name: string;
      icon?: string;
      color?: string;
      completed?: boolean;
    }) => {
      setFocusMode({
        focusedHabitId: habit.id,
        habitName: habit.name,
        habitIcon: habit.icon,
        habitColor: habit.color,
        completed: habit.completed,
      });
    },
    []
  );

  const closeFocusMode = useCallback(() => {
    setFocusMode(null);
  }, []);

  const handleFocusModeComplete = useCallback(() => {
    // Close focus mode after completion
    // The actual completion is handled by the HabitCard/mutation
    setTimeout(() => {
      setFocusMode(null);
    }, 800); // Small delay for celebration animation
  }, []);

  return {
    focusMode,
    isFocusModeActive: focusMode !== null,
    openFocusMode,
    closeFocusMode,
    handleFocusModeComplete,
  };
}
