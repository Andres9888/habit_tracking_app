import { useCallback, useState } from 'react';
import { format, isSameDay, isBefore } from 'date-fns';

import type { Id } from '../../../convex/_generated/dataModel';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import type { DateInfo, SheetState } from './types';

interface UseDayHabitsSheetOptions {
  date: Date | null;
  onClose: () => void;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => Promise<unknown>;
}

interface UseDayHabitsSheetReturn extends SheetState {
  dateInfo: DateInfo;
  handleBackdropPress: () => void;
  handleDonePress: () => void;
  handleToggleHabit: (habitId: Id<'habits'>) => Promise<void>;
}

/**
 * Custom hook for DayHabitsBottomSheet business logic
 * Handles state, date computations, and event handlers
 */
export function useDayHabitsSheet({
  date,
  onClose,
  toggleHabit,
}: UseDayHabitsSheetOptions): UseDayHabitsSheetReturn {
  const { triggerSelection, triggerLightImpact } = useHapticFeedback({});
  const [togglingHabitId, setTogglingHabitId] = useState<string | null>(null);

  // Compute date info
  const dateInfo: DateInfo = {
    dateString: date ? format(date, 'yyyy-MM-dd') : '',
    displayDate: date ? format(date, 'EEEE, MMM d') : '',
    isPast: date ? isBefore(date, new Date()) : false,
    isToday: date ? isSameDay(date, new Date()) : false,
  };

  const handleBackdropPress = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [triggerLightImpact, onClose]);

  const handleDonePress = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [triggerLightImpact, onClose]);

  const handleToggleHabit = useCallback(
    async (habitId: Id<'habits'>) => {
      if (!date) return;

      const dateString = format(date, 'yyyy-MM-dd');
      setTogglingHabitId(habitId);
      triggerSelection();

      try {
        await toggleHabit({ date: dateString, habitId });
      } finally {
        setTogglingHabitId(null);
      }
    },
    [date, toggleHabit, triggerSelection]
  );

  return {
    dateInfo,
    handleBackdropPress,
    handleDonePress,
    handleToggleHabit,
    setTogglingHabitId,
    togglingHabitId,
  };
}
