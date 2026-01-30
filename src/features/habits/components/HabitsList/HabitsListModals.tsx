/**
 * HabitsListModals - Bottom sheets and prompts for HabitsList
 */

import { SortBottomSheet } from '../SortBottomSheet';
import { DayHabitsBottomSheet } from '../../../../components/DayHabitsBottomSheet';
import { UpgradePrompt } from './UpgradePrompt';
import type { HabitsListProps } from './HabitsList.types';

export interface HabitsListModalsProps {
  list: HabitsListProps['list'];
  state: ReturnType<typeof import('./useHabitsListState').useHabitsListState>;
  handlers: ReturnType<
    typeof import('./useHabitsListHandlers').useHabitsListHandlers
  >;
  upgradePromptVisible: boolean;
  onUpgradeDismiss: () => void;
  onUpgradeConfirm: () => void;
}

export function HabitsListModals(props: HabitsListModalsProps) {
  const {
    list,
    state,
    handlers,
    upgradePromptVisible,
    onUpgradeDismiss,
    onUpgradeConfirm,
  } = props;
  const {
    habitSortMode,
    reduceMotionPreference,
    getHabitStatus,
    habits,
    toggleHabit,
  } = list;

  return (
    <>
      <UpgradePrompt
        visible={upgradePromptVisible}
        onClose={onUpgradeDismiss}
        onUpgradePress={onUpgradeConfirm}
      />
      <SortBottomSheet
        reduceMotion={reduceMotionPreference}
        sortMode={habitSortMode}
        visible={state.isSortSheetOpen}
        onClose={state.handleCloseSortSheet}
        onSelectSortMode={handlers.handleChangeHabitSortMode}
      />
      <DayHabitsBottomSheet
        date={state.selectedDay}
        getHabitStatus={getHabitStatus}
        habits={habits}
        reduceMotion={reduceMotionPreference}
        toggleHabit={toggleHabit}
        visible={state.isDaySheetOpen}
        onClose={state.handleCloseDaySheet}
      />
    </>
  );
}
