
import { useMemo, useState } from 'react';

import { parse, format } from 'date-fns';

import type { HabitStatus } from './types';
import type { Id } from '../../../convex/_generated/dataModel';
import { useHabitChainVisualizerLogic } from './HabitChainVisualizer.hooks';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useToggleDayHandler } from './useToggleDayHandler';

interface UseChainVisualizerStateParams {
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
  celebrationsEnabled: boolean;
  reduceMotionPreference: boolean;
  habitId: Id<'habits'>;
  onToggle: (args: { habitId: Id<'habits'>; date: string }) => void;
  onWeekComplete?: (args: { completedDate: string }) => void;
}

export const useChainVisualizerState = ({
  weekDateStrings,
  weekStatus,
  celebrationsEnabled,
  reduceMotionPreference,
  habitId,
  onToggle,
  onWeekComplete,
}: UseChainVisualizerStateParams) => {
  const { isCompleted, isFutureDate, isToday } = useHabitChainVisualizerLogic(
    weekDateStrings,
    weekStatus
  );
  const [activeBurst, setActiveBurst] = useState<string | null>(null);

  const { triggerSelection, triggerSuccess } = useHapticFeedback({
    isEnabled: celebrationsEnabled,
    preference: reduceMotionPreference,
  });

  const shouldReduceMotion = useMemo(
    () => reduceMotionPreference || !celebrationsEnabled,
    [celebrationsEnabled, reduceMotionPreference]
  );

  const todayLabel = format(new Date(), 'MMM d, EEE').toUpperCase();

  const dateLabels = useMemo(
    () =>
      weekDateStrings.map((dateString) => {
        const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
        return format(parsedDate, 'MMM d, EEE').toUpperCase();
      }),
    [weekDateStrings]
  );

  const handleToggleDay = useToggleDayHandler({
    celebrationsEnabled,
    habitId,
    onToggle,
    onWeekComplete,
    setActiveBurst,
    triggerSelection,
    triggerSuccess,
    weekStatus,
  });

  return {
    activeBurst,
    dateLabels,
    handleToggleDay,
    isCompleted,
    isFutureDate,
    isToday,
    setActiveBurst,
    shouldReduceMotion,
    todayLabel,
  };
};
