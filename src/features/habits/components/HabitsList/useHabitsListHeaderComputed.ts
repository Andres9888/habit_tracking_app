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

  return {
    isOffline,
    shouldShowTimeline: totalHabits > 0 || justCreatedHabitId !== null,
  };
}
