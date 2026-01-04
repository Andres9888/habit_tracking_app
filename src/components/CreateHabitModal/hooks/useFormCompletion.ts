import { useMemo } from 'react';

/**
 * Form completion state for the Create Habit Modal - Cards V1
 * Tracks completion status of all form sections to enable progress tracking
 */
export interface FormCompletionState {
  basicInfoComplete: boolean;
  appearanceComplete: boolean;
  scheduleComplete: boolean;
  completedCount: number;
  totalCount: number;
  isFormComplete: boolean;
}

/**
 * Custom hook to track completion state of all form sections in the Create Habit Modal
 *
 * This hook provides real-time completion tracking for the card-based modal interface,
 * enabling:
 * - Progress indicator updates
 * - Section-level completion checkmarks
 * - Form validation (Create button enable/disable)
 *
 * @param habitName - The habit name entered by the user
 * @param selectedEmoji - The emoji selected for the habit (null if none)
 * @param selectedColor - The color selected for the habit
 * @param selectedDays - Array of 7 booleans representing selected days (Sun-Sat)
 * @returns FormCompletionState with completion status for all sections
 *
 * @example
 * ```tsx
 * const completion = useFormCompletion(
 *   'Read daily',
 *   '📖',
 *   '#10B981',
 *   [true, true, true, true, true, true, true]
 * );
 *
 * console.log(completion.completedCount); // 3
 * console.log(completion.isFormComplete); // true
 * ```
 */
export function useFormCompletion(
  habitName: string,
  selectedEmoji: string | null,
  selectedColor: string,
  selectedDays: boolean[]
): FormCompletionState {
  // Basic Info section is complete when habitName has non-empty content
  const basicInfoComplete = useMemo(
    () => habitName.trim().length > 0,
    [habitName]
  );

  // Appearance section is complete when both emoji and color are selected
  const appearanceComplete = useMemo(
    () => selectedEmoji !== null && selectedColor.length > 0,
    [selectedEmoji, selectedColor]
  );

  // Schedule section is complete when at least one day is selected
  const scheduleComplete = useMemo(
    () => selectedDays.some(day => day),
    [selectedDays]
  );

  // Count how many sections are complete (0-3)
  const completedCount = useMemo(() => {
    let count = 0;
    if (basicInfoComplete) count++;
    if (appearanceComplete) count++;
    if (scheduleComplete) count++;
    return count;
  }, [basicInfoComplete, appearanceComplete, scheduleComplete]);

  // Form is complete when required sections are done
  // Note: Appearance is optional, so form can be complete without it
  const isFormComplete = useMemo(
    () => basicInfoComplete && scheduleComplete,
    [basicInfoComplete, scheduleComplete]
  );

  return {
    basicInfoComplete,
    appearanceComplete,
    scheduleComplete,
    completedCount,
    totalCount: 3,
    isFormComplete,
  };
}
