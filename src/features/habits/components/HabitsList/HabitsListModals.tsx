/**
 * HabitsListModals — overlay layer for the HabitsList screen.
 *
 * Manages two modal surfaces:
 * 1. **UpgradePrompt** — full-screen CTA shown when the user hits the free-tier limit.
 * 2. **DayHabitsBottomSheet** — shows habit completion status for a tapped calendar day.
 *
 * Note: SortBottomSheet was moved to HabitsModals (accessible from Settings).
 */

import { lazy, Suspense } from 'react';
import type { HabitsListProps } from './HabitsList.types';

// Lazy load heavy modal components - only load when modal is opened
const DayHabitsBottomSheet = lazy(() =>
  import('../../../../components/DayHabitsBottomSheet')
);
const UpgradePrompt = lazy(() => import('./UpgradePrompt'));

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
  const { reduceMotionPreference, getHabitStatus, habits, toggleHabit } = list;

  return (
    <>
      {upgradePromptVisible && (
        <Suspense fallback={null}>
          <UpgradePrompt
            visible={upgradePromptVisible}
            onClose={onUpgradeDismiss}
            onUpgradePress={onUpgradeConfirm}
          />
        </Suspense>
      )}
      {state.isDaySheetOpen && (
        <Suspense fallback={null}>
          <DayHabitsBottomSheet
            date={state.selectedDay}
            getHabitStatus={getHabitStatus}
            habits={habits}
            reduceMotion={reduceMotionPreference}
            toggleHabit={toggleHabit}
            visible={state.isDaySheetOpen}
            onClose={state.handleCloseDaySheet}
          />
        </Suspense>
      )}
    </>
  );
}
