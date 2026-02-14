/**
 * HabitsList State Hook
 * Manages local UI state for the HabitsList component
 *
 * Uses react-native-reanimated shared values for spring-physics animations.
 */

import { useCallback, useState, useRef } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type { Id } from '../../../../../convex/_generated/dataModel';

export function useHabitsListState() {
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isDaySheetOpen, setIsDaySheetOpen] = useState(false);
  const [justCreatedHabitId, setJustCreatedHabitId] =
    useState<Id<'habits'> | null>(null);
  const [isInSuccessCelebration, setIsInSuccessCelebration] = useState(false);
  const [shouldTriggerHabitEntrance, setShouldTriggerHabitEntrance] =
    useState(false);

  const seenHabitIdsRef = useRef<Set<string>>(new Set());

  // Animation shared values (reanimated for spring physics)
  const headerOpacity = useSharedValue(1);
  const headerTranslateY = useSharedValue(0);
  const calendarOpacity = useSharedValue(1);
  const calendarTranslateY = useSharedValue(0);
  const habitRowOpacity = useSharedValue(1);
  const habitRowTranslateY = useSharedValue(0);

  const handleOpenSortSheet = useCallback(() => setIsSortSheetOpen(true), []);
  const handleCloseSortSheet = useCallback(() => setIsSortSheetOpen(false), []);
  const handleDayPress = useCallback((date: Date) => {
    setSelectedDay(date);
    setIsDaySheetOpen(true);
  }, []);
  const handleCloseDaySheet = useCallback(() => {
    setIsDaySheetOpen(false);
    setSelectedDay(null);
  }, []);
  const handleHabitEntranceComplete = useCallback((habitId: Id<'habits'>) => {
    seenHabitIdsRef.current.add(habitId);
  }, []);

  return {
    calendarOpacity,
    calendarTranslateY,
    habitRowOpacity,
    habitRowTranslateY,
    handleCloseDaySheet,
    handleCloseSortSheet,
    handleDayPress,
    handleHabitEntranceComplete,
    handleOpenSortSheet,
    headerOpacity,
    headerTranslateY,
    isDaySheetOpen,
    isInSuccessCelebration,
    isSortSheetOpen,
    justCreatedHabitId,
    seenHabitIdsRef,
    selectedDay,
    setIsInSuccessCelebration,
    setJustCreatedHabitId,
    setShouldTriggerHabitEntrance,
    shouldTriggerHabitEntrance,
  };
}
