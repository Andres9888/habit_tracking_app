import { useCallback, useRef } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';
import type { HabitStatus } from './types';

interface UseToggleDayHandlerParams {
  weekStatus: HabitStatus[];
  celebrationsEnabled: boolean;
  habitId: Id<'habits'>;
  onToggle: (args: { habitId: Id<'habits'>; date: string }) => void;
  onWeekComplete?: (args: { completedDate: string }) => void;
  triggerLightImpact: () => void;
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
  triggerLightImpact,
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

      // Daily check-ins are frequent: keep them to one light haptic and the
      // state transition. Reserve the shadowed particle burst and success
      // notification for the rarer perfect-week milestone.
      if (willCompleteWeek && celebrationsEnabled) {
        triggerSuccess();
        setActiveBurst(dateString);
      } else if (isTogglingToComplete) {
        triggerLightImpact();
      } else {
        triggerSelection();
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
      triggerLightImpact,
      triggerSelection,
      triggerSuccess,
      setActiveBurst,
    ]
  );

  return handleToggleDay;
};
