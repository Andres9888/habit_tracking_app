/**
 * HabitsList — top-level orchestrator for the habits screen.
 *
 * This component does **no rendering itself**; it wires together local UI state
 * (`useHabitsListState`), animation logic (`useHabitsListAnimations`), event
 * handlers (`useHabitsListHandlers`), and a per-row render function
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
 *   ├─ useHabitsListAnimations   → success-transition choreography
 *   ├─ useHabitsListHandlers     → quick-create, sort, drag callbacks
 *   ├─ useHabitRenderItem        → per-row render function
 *   └─ HabitsListContent         → DraggableFlatList + modals
 * ```
 */

import { useHabitRenderItem } from '../../hooks/useHabitRenderItem';
import { useHabitsListState } from './useHabitsListState';
import { useHabitsListAnimations } from './useHabitsListAnimations';
import { useHabitsListHandlers } from './useHabitsListHandlers';
import { useFilteredHabits } from './useFilteredHabits';
import { HabitsListContent } from './HabitsListContent';
import { ENTRANCE_STAGGER_DELAY } from './constants';
import type { HabitsListProps } from './HabitsList.types';

export function HabitsList(props: HabitsListProps) {
  const { list, modals, onCreateHabitRequest } = props;

  const state = useHabitsListState();
  const filteredHabits = useFilteredHabits(list.habits, state.searchQuery);
  
  // Create a modified list object with filtered habits
  const listWithFilteredHabits = { ...list, habits: filteredHabits };
  
  const { handleSuccessTransitionComplete } = useHabitsListAnimations({
    ...state,
    setIsInSuccessCelebration: state.setIsInSuccessCelebration,
    setShouldTriggerHabitEntrance: state.setShouldTriggerHabitEntrance,
  });

  const handlers = useHabitsListHandlers({
    list: listWithFilteredHabits,
    onCreateHabitRequest,
    onSettingsChange: modals.onSettingsChange,
    state: {
      isInSuccessCelebration: state.isInSuccessCelebration,
      justCreatedHabitId: state.justCreatedHabitId,
      setIsInSuccessCelebration: state.setIsInSuccessCelebration,
      setJustCreatedHabitId: state.setJustCreatedHabitId,
      setShouldTriggerHabitEntrance: state.setShouldTriggerHabitEntrance,
      shouldTriggerHabitEntrance: state.shouldTriggerHabitEntrance,
    },
  });

  const renderItem = useHabitRenderItem({
    celebrationsEnabled: list.celebrationsEnabled,
    completionIcon: list.habitCompletionIcon,
    dayShape: list.dayShape,
    entranceStaggerDelay: ENTRANCE_STAGGER_DELAY,
    getHabitStatus: list.getHabitStatus,
    getStreak: list.getStreak,
    handleArchive: list.handleArchive,
    handleHabitPress: list.handleHabitPress,
    highlightHabitId: state.justCreatedHabitId,
    isReorderingEnabled: handlers.isReorderingEnabled,
    notifyWeekCompletion: list.notifyWeekCompletion,
    onHabitEntranceComplete: state.handleHabitEntranceComplete,
    reduceMotionPreference: list.reduceMotionPreference,
    seenHabitIds: state.seenHabitIdsRef.current,
    shouldTriggerEntrance: state.shouldTriggerHabitEntrance,
    showHabitStrengthPercentage: list.showHabitStrengthPercentage,
    toggleHabit: list.toggleHabit,
    weekDateStrings: list.weekDateStrings,
  });

  // Pass modified props with filtered habits
  const propsWithFilteredHabits = { ...props, list: listWithFilteredHabits };

  return (
    <HabitsListContent
      handlers={handlers}
      handleSuccessTransitionComplete={handleSuccessTransitionComplete}
      props={propsWithFilteredHabits}
      renderItem={renderItem}
      state={state}
    />
  );
}

export default HabitsList;
