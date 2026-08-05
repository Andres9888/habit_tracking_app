import { useCallback, useRef } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';
import type { HabitStatus } from './types';

interface UseToggleDayHandlerParams {
  weekStatus: HabitStatus[];
  celebrationsEnabled: boolean;
  habitId: Id<'habits'>;
  onToggle: (args: { habitId: Id<'habits'>; date: string }) => void;
  onWeekComplete?: (args: { completedDate: string }) => void;
  triggerSelection: () => void;
  triggerSuccess: () => void;
  setActiveBurst: (dateString: string | null) => void;
}

export const useToggleDayHandler = ({
  weekStatus,
  celebrationsEnabled,
  habitId,
  onToggle,
  onWeekComplete,
  triggerSelection,
  triggerSuccess,
  setActiveBurst,
}: UseToggleDayHandlerParams) => {
  const weekStatusRef = useRef(weekStatus);
  weekStatusRef.current = weekStatus;

  const handleToggleDay = useCallback(
    (
      dateString: string,
      completed: boolean,
      disabled: boolean,
      index: number
    ) => {
      if (disabled) {
        triggerSelection();
        return;
      }

      const isTogglingToComplete = !completed;
      const currentWeekStatus = weekStatusRef.current;
      const willCompleteWeek =
        isTogglingToComplete &&
        currentWeekStatus.every((status, i) =>
          i === index ? true : status === 'done'
        );

      if (completed || !celebrationsEnabled) {
        triggerSelection();
      } else {
        triggerSuccess();
        // Forge spark burst fires on every completion, not just week-complete.
        setActiveBurst(dateString);
      }

      onToggle({ date: dateString, habitId });

      if (willCompleteWeek) {
        onWeekComplete?.({ completedDate: dateString });
      }
    },
    [
      celebrationsEnabled,
      habitId,
      onToggle,
      onWeekComplete,
      triggerSelection,
      triggerSuccess,
      setActiveBurst,
    ]
  );

  return handleToggleDay;
};
