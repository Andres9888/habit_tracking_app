/**
 * HabitsList Types — shared interfaces for the HabitsList component tree.
 *
 * `HabitsListProps` is the top-level contract; `HabitsListContentProps` and
 * `UseHabitsListHandlersOptions` are internal wiring interfaces that reference
 * return types of the co-located hooks via `ReturnType<typeof …>` to stay in sync
 * automatically.
 */

import type { SharedValue } from 'react-native-reanimated';
import type { MutableRefObject } from 'react';
import type { FlatList } from 'react-native-gesture-handler';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { Habit } from '../../types';
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
  /**
   * True while focus-remounted rows render as light shells. Must reach mounted
   * cells via the list's `extraData` when it flips off one frame later.
   */
  deferHeavyFocusContent: boolean;
  /** Measured average used only to seed a far focus target's initial region. */
  focusEstimatedRowLength: number;
  /** Attached to the DraggableFlatList so focus requests can scroll it. */
  listRef: React.RefObject<FlatList<Habit> | null>;
  /** Records native layout for the focused row and its surrounding cards. */
  onHabitRowLayout?: (habitId: string, height: number) => void;
  /** Fired when scrollToIndex fell back to the estimate→retry path. */
  onScrollToIndexFallback?: () => void;
  /** Shared list scroll offset; the focus flow reads it after aligning. */
  scrollY?: SharedValue<number>;
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
    holdJustCreatedHighlight: boolean;
    justCreatedHabitId: Id<'habits'> | null;
    setJustCreatedHabitId: (id: Id<'habits'> | null) => void;
    shouldTriggerHabitEntrance: boolean;
    setShouldTriggerHabitEntrance: (value: boolean) => void;
    initialEntranceDoneRef: MutableRefObject<boolean>;
    seenHabitIdsRef: MutableRefObject<Set<string>>;
  };
}
