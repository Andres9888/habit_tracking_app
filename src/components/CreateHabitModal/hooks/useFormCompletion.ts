import { useMemo } from 'react';

/**
 * Form completion state interface
 * Tracks which sections of the habit creation form are complete
 */
export interface FormCompletionState {
  /** True if Basic Info section is complete (habitName non-empty) */
  basicInfoComplete: boolean;
  /** True if Appearance section is complete (emoji and color selected) */
  appearanceComplete: boolean;
  /** True if Schedule section is complete (at least one day selected) */
  scheduleComplete: boolean;
  /** Number of sections completed (0-3) */
  completedCount: number;
  /** Total number of sections (always 3) */
  totalCount: number;
  /** True if required sections are complete (Basic Info + Schedule) */
  isFormComplete: boolean;
}

/**
 * Hook to track completion state of all form sections
 *
 * @param habitName - The habit name input value
 * @param selectedEmoji - The selected emoji (null if none selected)
 * @param selectedColor - The selected color hex string
 * @param selectedDays - Boolean array of selected days [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
 * @returns FormCompletionState object with completion status for each section
 *
 * @example
 * ```tsx
 * const completion = useFormCompletion(
 *   'Read daily',
 *   '📖',
 *   '#10B981',
 *   [true, true, true, true, true, true, true]
 * );
 * // completion.completedCount === 3
 * // completion.isFormComplete === true
 * ```
 */
export function useFormCompletion(
  habitName: string,
  selectedEmoji: string | null,
  selectedColor: string,
  selectedDays: boolean[]
): FormCompletionState {
  // Basic Info is complete when habit name is non-empty (after trimming whitespace)
  const basicInfoComplete = useMemo(
    () => habitName.trim().length > 0,
    [habitName]
  );

  // Appearance is complete when both emoji and color are selected
  const appearanceComplete = useMemo(
    () => selectedEmoji !== null && selectedColor.length > 0,
    [selectedEmoji, selectedColor]
  );

  // Schedule is complete when at least one day is selected
  const scheduleComplete = useMemo(
    () => selectedDays.some((day) => day),
    [selectedDays]
  );

  // Calculate total completed sections count
  const completedCount = useMemo(() => {
    let count = 0;
    if (basicInfoComplete) count++;
    if (appearanceComplete) count++;
    if (scheduleComplete) count++;
    return count;
  }, [basicInfoComplete, appearanceComplete, scheduleComplete]);

  // Form is complete when required sections are done
  // Note: Appearance is optional, so form can be complete with just Basic Info + Schedule
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
