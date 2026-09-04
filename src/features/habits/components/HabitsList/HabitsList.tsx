/**
 * HabitsList — top-level orchestrator for the habits screen.
 *
 * This component does **no rendering itself**; it wires together local UI state
 * (`useHabitsListState`), event handlers (`useHabitsListHandlers`),
 * and a per-row render function
 * (`useHabitRenderItem`) then delegates all visual output to
 * {@link HabitsListContent}, which wraps a `DraggableFlatList`.
 *
 * ### Render-prop pattern
 * `useHabitRenderItem` returns a **render function** that is passed into the
 * FlatList via `HabitsListContent`.  Each row is further wrapped by
 * `renderHabitRow` to apply entrance animations on newly-created habits.
 *
 * ### Data flow
 * ```
 * HabitsList (props)
 *   ├─ useHabitsListState        → local UI state (sheets, animations, highlights)
 *   ├─ useHabitsListHandlers     → sort, drag callbacks
 *   ├─ useHabitRenderItem        → per-row render function
 *   └─ HabitsListContent         → DraggableFlatList + modals
 * ```
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type { FlatList } from 'react-native-gesture-handler';
import { useHabitRenderItem } from '../../hooks/useHabitRenderItem';
import { useHabitsListState } from './useHabitsListState';
import { useHabitsListHandlers } from './useHabitsListHandlers';
import { HabitsListContent } from './HabitsListContent';
import { useFocusHabitRequest } from './useFocusHabitRequest';
import { shouldHoldFocusHighlight } from './focusHighlight';
import { isFocusNeighborhoodLaidOut } from './focusNeighborhood';
import { ENTRANCE_STAGGER_DELAY } from './constants';
import type { Habit } from '../../types';
import type { HabitsListProps } from './HabitsList.types';

const DEFAULT_COMPACT_ROW_LENGTH = 132;
const DEFAULT_REGULAR_ROW_LENGTH = 184;

export function HabitsList(props: HabitsListProps) {
  const { list, modals, onCreateHabitRequest } = props;

  const state = useHabitsListState();
  const listRef = useRef<FlatList<Habit>>(null);
  const fallbackAtRef = useRef(0);
  const handleScrollFallback = useCallback(() => {
    fallbackAtRef.current = Date.now();
  }, []);
  // Current contentOffset.y, written by the list's animated scroll handler;
  // the focus flow reads it to undo a negative resting offset.
  const scrollY = useSharedValue(0);
  const getScrollOffset = useCallback(() => scrollY.value, [scrollY]);

  // The focus flow remounts the list; rows that never finished an entrance
  // would replay it, staggered by index, and sit at opacity 0 meanwhile —
  // that is the "blank card next to the target" symptom. Mark everything
  // currently in the list as seen before the remount happens.
  const { seenHabitIdsRef } = state;
  const { pendingFocusHabitId } = modals;
  const [focusContentReadyId, setFocusContentReadyId] = useState<string | null>(
    null
  );
  useEffect(() => {
    if (!pendingFocusHabitId) return;
    const frame = requestAnimationFrame(() =>
      setFocusContentReadyId(pendingFocusHabitId)
    );
    return () => cancelAnimationFrame(frame);
  }, [pendingFocusHabitId]);
  const deferHeavyFocusContent = Boolean(
    pendingFocusHabitId && focusContentReadyId !== pendingFocusHabitId
  );
  // A prepared (not yet committed) focus request keeps the target's ring
  // armed while the library still covers the list.
  const holdJustCreatedHighlight = shouldHoldFocusHighlight({
    autoClose: modals.focusRequestAutoClose,
    focusReady: modals.focusReady,
    pendingFocusHabitId: modals.pendingFocusHabitId,
  });
  const focusLayoutRef = useRef<{
    focusId: string | null;
    laidOutIds: Set<string>;
  }>({ focusId: null, laidOutIds: new Set() });
  const measuredRowHeightsRef = useRef(new Map<string, number>());
  // Reset synchronously with the focus-keyed list remount. Old row layouts
  // must never make a newly mounted target region look ready.
  if (focusLayoutRef.current.focusId !== pendingFocusHabitId) {
    focusLayoutRef.current = {
      focusId: pendingFocusHabitId,
      laidOutIds: new Set(),
    };
  }
  const measuredHeights = [...measuredRowHeightsRef.current.values()];
  const focusEstimatedRowLength =
    measuredHeights.length > 0
      ? measuredHeights.reduce((sum, height) => sum + height, 0) /
        measuredHeights.length
      : list.compactView
        ? DEFAULT_COMPACT_ROW_LENGTH
        : DEFAULT_REGULAR_ROW_LENGTH;
  const handleHabitRowLayout = useCallback(
    (habitId: string, height: number) => {
      if (height > 0) measuredRowHeightsRef.current.set(habitId, height);
      if (focusLayoutRef.current.focusId) {
        focusLayoutRef.current.laidOutIds.add(habitId);
      }
    },
    []
  );
  const isFocusNeighborhoodReady = useCallback(
    (targetIndex: number) => {
      return isFocusNeighborhoodLaidOut(
        list.habits,
        targetIndex,
        focusLayoutRef.current.laidOutIds
      );
    },
    [list.habits]
  );
  if (pendingFocusHabitId) {
    for (const habit of list.habits) seenHabitIdsRef.current.add(habit._id);
  }

  useFocusHabitRequest({
    autoClose: modals.focusRequestAutoClose,
    clearPendingFocusHabit: modals.clearPendingFocusHabit,
    closeLibrary: modals.closeTemplatesScreen,
    fallbackAtRef,
    getScrollOffset,
    habits: list.habits,
    focusReady: modals.focusReady,
    isFocusNeighborhoodReady,
    isLibraryOpen: modals.showTemplatesScreen,
    listRef,
    pendingFocusHabitId: modals.pendingFocusHabitId,
    onFocusReady: modals.markFocusHabitReady,
    reduceMotion: list.reduceMotionPreference,
    setJustCreatedHabitId: state.setJustCreatedHabitId,
  });

  const handlers = useHabitsListHandlers({
    list,
    onCreateHabitRequest,
    onSettingsChange: modals.onSettingsChange,
    state: {
      initialEntranceDoneRef: state.initialEntranceDoneRef,
      holdJustCreatedHighlight,
      justCreatedHabitId: state.justCreatedHabitId,
      seenHabitIdsRef,
      setJustCreatedHabitId: state.setJustCreatedHabitId,
      setShouldTriggerHabitEntrance: state.setShouldTriggerHabitEntrance,
      shouldTriggerHabitEntrance: state.shouldTriggerHabitEntrance,
    },
  });

  const renderItem = useHabitRenderItem({
    celebrationsEnabled: list.celebrationsEnabled,
    compactView: list.compactView,
    completionIcon: list.habitCompletionIcon,
    dayShape: list.dayShape,
    deferHeavyContent: deferHeavyFocusContent,
    entranceStaggerDelay: ENTRANCE_STAGGER_DELAY,
    getHabitStatus: list.getHabitStatus,
    getStreak: list.getStreak,
    handleArchive: list.handleArchive,
    handleDelete: list.handleDelete,
    handleHabitPress: list.handleHabitPress,
    isSelectionMode: props.isSelectionMode,
    selectedIds: props.selectedIds,
    onToggleSelection: props.onToggleSelection,
    highlightHabitId: state.justCreatedHabitId,
    holdHighlight: holdJustCreatedHighlight,
    isReorderingEnabled: handlers.isReorderingEnabled,
    notifyWeekCompletion: list.notifyWeekCompletion,
    onHabitEntranceComplete: state.handleHabitEntranceComplete,
    reduceMotionPreference: list.reduceMotionPreference,
    seenHabitIds: state.seenHabitIdsRef.current,
    shouldTriggerEntrance: state.shouldTriggerHabitEntrance,
    showHabitStrengthPercentage: list.showHabitStrengthPercentage,
    showGradientFill: list.showGradientFill,
    toggleHabit: list.toggleHabit,
    userProgressEmojis: list.userProgressEmojis,
    weekDateStrings: list.weekDateStrings,
  });

  return (
    <HabitsListContent
      deferHeavyFocusContent={deferHeavyFocusContent}
      focusEstimatedRowLength={focusEstimatedRowLength}
      handlers={handlers}
      listRef={listRef}
      onHabitRowLayout={handleHabitRowLayout}
      onScrollToIndexFallback={handleScrollFallback}
      scrollY={scrollY}
      props={props}
      renderItem={renderItem}
      state={state}
    />
  );
}

export default HabitsList;
