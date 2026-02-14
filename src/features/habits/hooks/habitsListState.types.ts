/**
 * HabitsListState Types
 * State interface for the habits list view
 *
 * @see docs/offline-habit-sync.md T011
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type { ToggleMutationResult } from '../../../lib/optimistic';
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
  handlePause: (habitId: Id<'habits'>, pausedUntil?: number) => Promise<void>;
  handleResume: (habitId: Id<'habits'>) => Promise<void>;
  handleNextWeek: () => void;
  handlePreviousWeek: () => void;
  openCreateHabitScreen: () => void;
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  getStreak: (habitId: string) => number;
  notifyWeekCompletion: (args: { habit: Habit; completedDate: string }) => void;
  reduceMotionPreference: boolean;
  rewardToast: RewardToastData | null;
  /** Toggle habit completion with offline queue support (T011) */
  toggleHabit: (args: {
    habitId: Id<'habits'>;
    date: string;
  }) => Promise<ToggleMutationResult>;
  isPremiumUser: boolean;
}
