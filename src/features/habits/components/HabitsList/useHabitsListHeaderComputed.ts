/**
 * useHabitsListHeaderComputed Hook
 *
 * Extracts lightweight header values that are not already computed by the
 * habits list state.
 */

import { useIsOnline } from '../../../../contexts/NetworkStatusContext';

export interface UseHabitsListHeaderComputedProps {
  justCreatedHabitId: string | null;
  totalHabits: number;
}

export interface UseHabitsListHeaderComputedResult {
  shouldShowTimeline: boolean;
  isOffline: boolean;
}

export function useHabitsListHeaderComputed({
  justCreatedHabitId,
  totalHabits,
}: UseHabitsListHeaderComputedProps): UseHabitsListHeaderComputedResult {
  const isOnline = useIsOnline();
  const isOffline = !isOnline;
  const shouldShowTimeline = totalHabits > 0 || justCreatedHabitId !== null;

  return {
    isOffline,
    shouldShowTimeline,
  };
}
