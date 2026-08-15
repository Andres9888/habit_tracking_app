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
import type { FlatList } from 'react-native-gesture-handler';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { Habit } from '../../types';

export function useHabitsListState() {
  const [justCreatedHabitId, setJustCreatedHabitId] =
    useState<Id<'habits'> | null>(null);
  const [shouldTriggerHabitEntrance, setShouldTriggerHabitEntrance] =
    useState(false);

  const seenHabitIdsRef = useRef<Set<string>>(new Set());
  const initialEntranceDoneRef = useRef(false);
  // Imperative handle on the scroller, used to bring a specific habit into
  // view (see useHabitFocusScroll). Nothing else drives the list imperatively.
  const listRef = useRef<FlatList<Habit> | null>(null);

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
    listRef,
    seenHabitIdsRef,
    setJustCreatedHabitId,
    setShouldTriggerHabitEntrance,
    shouldTriggerHabitEntrance,
  };
}
