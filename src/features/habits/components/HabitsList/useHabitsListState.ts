/**
 * useHabitsListState — local UI state for the HabitsList tree.
 *
 * ### State shape
 * | Group | Fields | Purpose |
 * |-------|--------|---------|
 * | **Bottom sheets** | `isSortSheetOpen` | Track which sheet is visible |
 * | **Habit creation** | `justCreatedHabitId`, `isInSuccessCelebration`, `shouldTriggerHabitEntrance` | Transient flags that drive the create-then-animate flow |
 * | **Seen tracking** | `seenHabitIdsRef` | Mutable ref of habit IDs whose entrance animation already played |
 * | **Animated values** | `header*`, `calendar*`, `habitRow*` (opacity + translateY) | RN `Animated.Value`s for staggered entrance transitions |
 *
 * ### Derived callbacks
 * `handleOpenSortSheet`, etc. are thin wrappers that keep
 * consumers free from knowing which setter to call.
 */

import { useCallback, useState, useRef } from 'react';
import { Animated } from 'react-native';
import type { Id } from '../../../../../convex/_generated/dataModel';

export function useHabitsListState() {
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
  const [justCreatedHabitId, setJustCreatedHabitId] =
    useState<Id<'habits'> | null>(null);
  const [isInSuccessCelebration, setIsInSuccessCelebration] = useState(false);
  const [shouldTriggerHabitEntrance, setShouldTriggerHabitEntrance] =
    useState(false);

  const seenHabitIdsRef = useRef<Set<string>>(new Set());

  // Animation values
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const calendarOpacity = useRef(new Animated.Value(1)).current;
  const calendarTranslateY = useRef(new Animated.Value(0)).current;
  const habitRowOpacity = useRef(new Animated.Value(1)).current;
  const habitRowTranslateY = useRef(new Animated.Value(0)).current;

  // Day-press sheet state
  const [daySheetDate, setDaySheetDate] = useState<Date | null>(null);
  const handleDayPress = useCallback((date: Date) => setDaySheetDate(date), []);
  const closeDaySheet = useCallback(() => setDaySheetDate(null), []);

  const handleOpenSortSheet = useCallback(() => setIsSortSheetOpen(true), []);
  const handleCloseSortSheet = useCallback(() => setIsSortSheetOpen(false), []);
  const handleHabitEntranceComplete = useCallback((habitId: Id<'habits'>) => {
    seenHabitIdsRef.current.add(habitId);
  }, []);

  return {
    calendarOpacity,
    calendarTranslateY,
    closeDaySheet,
    daySheetDate,
    habitRowOpacity,
    habitRowTranslateY,
    handleCloseSortSheet,
    handleDayPress,
    handleHabitEntranceComplete,
    handleOpenSortSheet,
    headerOpacity,
    headerTranslateY,
    isInSuccessCelebration,
    isSortSheetOpen,
    justCreatedHabitId,
    seenHabitIdsRef,
    setIsInSuccessCelebration,
    setJustCreatedHabitId,
    setShouldTriggerHabitEntrance,
    shouldTriggerHabitEntrance,
  };
}
