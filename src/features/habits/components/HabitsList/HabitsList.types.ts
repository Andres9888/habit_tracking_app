/**
 * HabitsList Types — shared interfaces for the HabitsList component tree.
 *
 * `HabitsListProps` is the top-level contract; `HabitsListContentProps` and
 * `UseHabitsListHandlersOptions` are internal wiring interfaces that reference
 * return types of the co-located hooks via `ReturnType<typeof …>` to stay in sync
 * automatically.
 */

import type { MutableRefObject } from 'react';
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
  onJumpToToday: () => void;
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  /** Selection mode props */
  isSelectionMode?: boolean;
  selectedIds?: Set<Id<'habits'>>;
  selectedCount?: number;
  isAllSelected?: boolean;
  onToggleSelection?: (id: Id<'habits'>) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
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
}

export interface UseHabitsListHandlersOptions {
  list: HabitsListProps['list'];
  onSettingsChange: HabitsListProps['modals']['onSettingsChange'];
  onCreateHabitRequest: HabitsListProps['onCreateHabitRequest'];
  state: {
    justCreatedHabitId: Id<'habits'> | null;
    setJustCreatedHabitId: (id: Id<'habits'> | null) => void;
    shouldTriggerHabitEntrance: boolean;
    setShouldTriggerHabitEntrance: (value: boolean) => void;
    initialEntranceDoneRef: MutableRefObject<boolean>;
  };
}
