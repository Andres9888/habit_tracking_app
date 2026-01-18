/**
 * HabitsList Types
 */

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
}
