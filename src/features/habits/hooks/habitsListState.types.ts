/**
 * HabitsListState Types
 * State interface for the habits list view
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type {
  Habit,
  HabitSettings,
  HabitSortMode,
  HabitStatus,
  RewardToastData,
} from '../types';

export interface HabitsListState {
  celebrationsEnabled: boolean;
  dayShape: HabitSettings['dayShape'];
  freeHabitLimit: number;
  habits: Habit[];
  habitSortMode: HabitSortMode;
  habitCompletionIcon: HabitSettings['habitCompletionIcon'];
  isHabitsLoading: boolean;
  hasReachedHabitLimit: boolean;
  weekDates: Date[];
  weekDateStrings: string[];
  canNavigateForward: boolean;
  showHabitStrengthPercentage: boolean;
  showWeekCompletionBar: boolean;
  contentPadding: {
    paddingHorizontal: number;
    paddingTop: number;
    paddingBottom: number;
  };
  dismissRewardToast: () => void;
  habitSlotsUsed: number;
  handleDragEnd: (event: { data: Habit[] }) => Promise<void>;
  handleArchive: (habitId: Id<'habits'>) => Promise<void>;
  handleArchiveUndo: () => Promise<void>;
  dismissArchiveUndo: () => void;
  archiveUndoVisible: boolean;
  archiveUndoHabitName: string;
  handleHabitPress: (habit: Habit) => void;
  handleNextWeek: () => void;
  handlePreviousWeek: () => void;
  openCreateHabitScreen: () => void;
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  getStreak: (habitId: string) => number;
  notifyWeekCompletion: (args: { habit: Habit; completedDate: string }) => void;
  reduceMotionPreference: boolean;
  rewardToast: RewardToastData | null;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => Promise<void>;
  isPremiumUser: boolean;
}
