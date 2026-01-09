/**
 * HabitsList Component - Main orchestration
 * Displays the draggable list of habits with header, footer, and modals
 */

import { useHabitRenderItem } from '../../hooks/useHabitRenderItem';
import { useHabitsListState } from './useHabitsListState';
import { useHabitsListAnimations } from './useHabitsListAnimations';
import { useHabitsListHandlers } from './useHabitsListHandlers';
import { HabitsListContent } from './HabitsListContent';
import { ENTRANCE_STAGGER_DELAY } from './constants';
import type { HabitsListProps } from './HabitsList.types';

export function HabitsList(props: HabitsListProps) {
  const { list, modals, onCreateHabitRequest } = props;

  const state = useHabitsListState();
  const { handleSuccessTransitionComplete } = useHabitsListAnimations({
    ...state,
    setIsInSuccessCelebration: state.setIsInSuccessCelebration,
    setShouldTriggerHabitEntrance: state.setShouldTriggerHabitEntrance,
  });

  const handlers = useHabitsListHandlers({
    list,
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

  return (
    <HabitsListContent
      handlers={handlers}
      handleSuccessTransitionComplete={handleSuccessTransitionComplete}
      props={props}
      renderItem={renderItem}
      state={state}
    />
  );
}

export default HabitsList;
