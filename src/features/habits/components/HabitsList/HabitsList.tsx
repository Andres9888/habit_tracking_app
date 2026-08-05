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

import { useHabitRenderItem } from '../../hooks/useHabitRenderItem';
import { useHabitsListState } from './useHabitsListState';
import { useHabitsListHandlers } from './useHabitsListHandlers';
import { HabitsListContent } from './HabitsListContent';
import { ENTRANCE_STAGGER_DELAY } from './constants';
import type { HabitsListProps } from './HabitsList.types';

export function HabitsList(props: HabitsListProps) {
  const { list, modals, onCreateHabitRequest } = props;

  const state = useHabitsListState();

  const handlers = useHabitsListHandlers({
    list,
    onCreateHabitRequest,
    onSettingsChange: modals.onSettingsChange,
    state: {
      initialEntranceDoneRef: state.initialEntranceDoneRef,
      justCreatedHabitId: state.justCreatedHabitId,
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
      handlers={handlers}
      props={props}
      renderItem={renderItem}
      state={state}
    />
  );
}

export default HabitsList;
