/** HabitsList Handlers Hook - Event handlers and callbacks */
import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { showCreateError } from '../../../../utils/errorAlerts';
import { useHabitsListEffects } from './useHabitsListEffects';
import type { UseHabitsListHandlersOptions } from './HabitsList.types';

/**
 * Builds memoized HabitsList event handlers and wires supporting effects.
 *
 * Keeps imperative UI concerns (quick-create, sort changes, drag haptics)
 * isolated from presentation components.
 */
export function useHabitsListHandlers(options: UseHabitsListHandlersOptions) {
  const { list, onSettingsChange, onCreateHabitRequest, state } = options;
  const {
    habitSortMode,
    isPremiumUser,
    hasReachedHabitLimit,
    celebrationsEnabled,
    habits,
    reduceMotionPreference,
  } = list;

  const createHabit = useMutation(api.habits.create);
  const { triggerSelection } = useHapticFeedback({
    isEnabled: celebrationsEnabled,
    preference: reduceMotionPreference,
  });

  useHabitsListEffects({
    habitsLength: habits.length,
    isInSuccessCelebration: state.isInSuccessCelebration,
    justCreatedHabitId: state.justCreatedHabitId,
    setJustCreatedHabitId: state.setJustCreatedHabitId,
    setShouldTriggerHabitEntrance: state.setShouldTriggerHabitEntrance,
    shouldTriggerHabitEntrance: state.shouldTriggerHabitEntrance,
  });

  const handleChangeHabitSortMode = useCallback(
    (value: typeof habitSortMode) =>
      void onSettingsChange({ habitSortMode: value }),
    [onSettingsChange]
  );

  const handleQuickCreateHabit = useCallback(
    async (habitName: string) => {
      if (!isPremiumUser && hasReachedHabitLimit) {
        onCreateHabitRequest();
        return;
      }
      try {
        const newHabitId = (await createHabit({
          name: habitName,
          notes: '',
          remindersEnabled: false,
        })) as Id<'habits'>;
        if (newHabitId) {
          state.setJustCreatedHabitId(newHabitId);
          state.setIsInSuccessCelebration(true);
        }
      } catch (error) {
        if (__DEV__) console.error('Failed to create habit:', error);
        showCreateError();
      }
    },
    [
      createHabit,
      hasReachedHabitLimit,
      isPremiumUser,
      onCreateHabitRequest,
      state,
    ]
  );

  const handleAddHabitPress = useCallback(
    () => onCreateHabitRequest(),
    [onCreateHabitRequest]
  );
  const handleDragBegin = useCallback(
    () => triggerSelection(),
    [triggerSelection]
  );
  const keyExtractor = useCallback(
    (habit: (typeof habits)[number], index: number) =>
      habit._id ?? `habit-${index}`,
    []
  );

  return {
    handleAddHabitPress,
    handleChangeHabitSortMode,
    handleDragBegin,
    handleQuickCreateHabit,
    isReorderingEnabled: habitSortMode === 'manual',
    keyExtractor,
  };
}
