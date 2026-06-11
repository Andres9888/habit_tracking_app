/** HabitsList Handlers Hook - Event handlers and callbacks */
import { useCallback } from 'react';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { useHabitsListEffects } from './useHabitsListEffects';
import type { UseHabitsListHandlersOptions } from './HabitsList.types';

/**
 * Builds memoized HabitsList event handlers and wires supporting effects.
 *
 * Keeps imperative UI concerns (sort changes, drag haptics)
 * isolated from presentation components.
 */
export function useHabitsListHandlers(options: UseHabitsListHandlersOptions) {
  const { list, onSettingsChange, onCreateHabitRequest, state } = options;
  const {
    habitSortMode,
    celebrationsEnabled,
    habits,
    reduceMotionPreference,
  } = list;

  const { triggerSelection } = useHapticFeedback({
    isEnabled: celebrationsEnabled,
    preference: reduceMotionPreference,
  });

  useHabitsListEffects({
    habitsLength: habits.length,
    initialEntranceDoneRef: state.initialEntranceDoneRef,
    justCreatedHabitId: state.justCreatedHabitId,
    setJustCreatedHabitId: state.setJustCreatedHabitId,
    setShouldTriggerHabitEntrance: state.setShouldTriggerHabitEntrance,
    shouldTriggerHabitEntrance: state.shouldTriggerHabitEntrance,
  });

  /** Persists a new sort mode to user settings via the `onSettingsChange` callback. */
  const handleChangeHabitSortMode = useCallback(
    (value: typeof habitSortMode) =>
      void onSettingsChange({ habitSortMode: value }),
    [onSettingsChange]
  );

  /** Opens the full habit-creation screen via the parent callback. */
  const handleAddHabitPress = useCallback(
    () => onCreateHabitRequest(),
    [onCreateHabitRequest]
  );
  /** Fires a selection haptic when the user begins dragging a habit row. */
  const handleDragBegin = useCallback(
    () => triggerSelection(),
    [triggerSelection]
  );
  /** Stable key extractor for the FlatList; falls back to index if `_id` is missing. */
  const keyExtractor = useCallback(
    (habit: (typeof habits)[number], index: number) =>
      habit._id ?? `habit-${index}`,
    []
  );

  return {
    handleAddHabitPress,
    handleChangeHabitSortMode,
    handleDragBegin,
    isReorderingEnabled: habitSortMode === 'manual',
    keyExtractor,
  };
}
