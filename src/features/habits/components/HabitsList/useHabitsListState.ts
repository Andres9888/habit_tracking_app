/**
 * useHabitsListState — local UI state for the HabitsList tree.
 *
 * ### State shape
 * | Group | Fields | Purpose |
 * |-------|--------|---------|
 * | **Habit creation** | `justCreatedHabitId`, `shouldTriggerHabitEntrance` | Transient flags that drive the create-then-animate flow |
 * | **Seen tracking** | `seenHabitIdsRef` | Mutable ref of habit IDs whose entrance animation already played |
 * | **Animated values** | `header*`, `calendar*`, `habitRow*` (opacity + translateY) | RN `Animated.Value`s for staggered entrance transitions |
 *
 * ### Derived callbacks
 * Thin wrappers that keep consumers free from knowing which setter to call.
 */

import { useCallback, useState, useRef } from 'react';
import { Animated } from 'react-native';
import type { Id } from '../../../../../convex/_generated/dataModel';

export function useHabitsListState() {
  const [justCreatedHabitId, setJustCreatedHabitId] =
    useState<Id<'habits'> | null>(null);
  const [shouldTriggerHabitEntrance, setShouldTriggerHabitEntrance] =
    useState(false);

  const seenHabitIdsRef = useRef<Set<string>>(new Set());
  const initialEntranceDoneRef = useRef(false);

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
    handleDayPress,
    handleHabitEntranceComplete,
    headerOpacity,
    headerTranslateY,
    initialEntranceDoneRef,
    justCreatedHabitId,
    seenHabitIdsRef,
    setJustCreatedHabitId,
    setShouldTriggerHabitEntrance,
    shouldTriggerHabitEntrance,
  };
}
