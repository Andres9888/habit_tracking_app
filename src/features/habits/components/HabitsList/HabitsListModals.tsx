/**
 * HabitsListModals — overlay layer for the HabitsList screen.
 *
 * Manages modal surfaces:
 * 1. **UpgradePrompt** — full-screen CTA shown when the user hits the free-tier limit.
 * 2. **DayHabitsBottomSheet** — iOS-style sheet for toggling habits on a tapped day.
 */

import type { Id } from '../../../../../convex/_generated/dataModel';
import { DayHabitsBottomSheet } from '../../../../components/DayHabitsBottomSheet';
import type { Habit, HabitStatus } from '../../types';
import { UpgradePrompt } from './UpgradePrompt';

export interface HabitsListModalsProps {
  upgradePromptVisible: boolean;
  onUpgradeDismiss: () => void;
  onUpgradeConfirm: () => void;
  daySheetDate: Date | null;
  onCloseDaySheet: () => void;
  habits: Habit[];
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => Promise<unknown>;
  reduceMotion: boolean;
}

export function HabitsListModals(props: HabitsListModalsProps) {
  return (
    <>
      {props.upgradePromptVisible ? (
        <UpgradePrompt
          onClose={props.onUpgradeDismiss}
          onUpgradePress={props.onUpgradeConfirm}
        />
      ) : null}
      <DayHabitsBottomSheet
        date={props.daySheetDate}
        getHabitStatus={props.getHabitStatus}
        habits={props.habits}
        reduceMotion={props.reduceMotion}
        toggleHabit={props.toggleHabit}
        visible={props.daySheetDate !== null}
        onClose={props.onCloseDaySheet}
      />
    </>
  );
}
