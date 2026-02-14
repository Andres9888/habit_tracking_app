/**
 * HabitsList Types
 */

import type { Id } from '../../../../../convex/_generated/dataModel';
import type { HabitsListState } from '../../hooks/useHabitsApp';
import type { HabitsModalsState } from '../../hooks/types';

export interface HabitsListProps {
  list: HabitsListState;
  modals: HabitsModalsState;
  canNavigateForward: boolean;
  onCreateHabitRequest: () => void;
  onUpgradeConfirm: () => void;
  onUpgradeDismiss: () => void;
  onUpgradeIntent: () => void;
  upgradePromptVisible: boolean;
  weekDates: Date[];
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  /** Current perfect day streak count */
  perfectDayStreak?: number;
}

export interface HabitsListContentProps {
  props: HabitsListProps;
  state: ReturnType<typeof import('./useHabitsListState').useHabitsListState>;
  handlers: ReturnType<
    typeof import('./useHabitsListHandlers').useHabitsListHandlers
  >;
  renderItem: ReturnType<
    typeof import('../../hooks/useHabitRenderItem').useHabitRenderItem
  >;
  handleSuccessTransitionComplete: () => void;
}

export interface UseHabitsListHandlersOptions {
  list: HabitsListProps['list'];
  onSettingsChange: HabitsListProps['modals']['onSettingsChange'];
  onCreateHabitRequest: HabitsListProps['onCreateHabitRequest'];
  state: {
    justCreatedHabitId: Id<'habits'> | null;
    setJustCreatedHabitId: (id: Id<'habits'> | null) => void;
    setIsInSuccessCelebration: (value: boolean) => void;
    shouldTriggerHabitEntrance: boolean;
    isInSuccessCelebration: boolean;
    setShouldTriggerHabitEntrance: (value: boolean) => void;
  };
}
