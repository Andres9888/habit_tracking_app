/**
 * HabitsListState Types
 * State interface for the habits list view
 *
 * @see docs/offline-habit-sync.md T011
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type { CompletionSoundType } from '../../../../convex/settings/types';
import type { ToggleMutationResult } from '../../../lib/optimistic';
import type { DayCompletionStatus } from '../../../components/CalendarTimeline';
import type { PartialProgressEmojiSet } from '../../../utils/progressEmojis';
import type {
  Habit,
  HabitSettings,
  HabitSortMode,
  HabitStatus,
  HabitTrackingEntry,
  RewardToastData,
} from '../types';

export interface HabitsListState {
  averageStrengthPercent: number;
  celebrationsEnabled: boolean;
  compactView: boolean;
  completedToday: number;
  completionByDay: Record<string, DayCompletionStatus>;
  completionSoundEnabled: boolean;
  completionSoundType: CompletionSoundType;
  dayShape: HabitSettings['dayShape'];
  habits: Habit[];
  settings: HabitSettings | undefined;
  tracking: HabitTrackingEntry[];
  habitSortMode: HabitSortMode;
  habitCompletionIcon: HabitSettings['habitCompletionIcon'];
  isHabitsLoading: boolean;
  /** False until settings.get resolves — never paint appearance with defaults. */
  isSettingsReady: boolean;
  weekDates: Date[];
  weekDateStrings: string[];
  canNavigateForward: boolean;
  currentStreak: number;
  showGradientFill: boolean;
  showHabitStrengthPercentage: boolean;
  showWeekCompletionBar: boolean;
  userProgressEmojis?: PartialProgressEmojiSet;
  contentPadding: {
    paddingHorizontal: number;
    paddingTop: number;
    paddingBottom: number;
  };
  dismissRewardToast: () => void;
  handleDragEnd: (event: { data: Habit[] }) => Promise<void>;
  handleArchive: (habitId: Id<'habits'>) => Promise<void>;
  handleDelete: (habitId: Id<'habits'>) => void;
  handleHabitPress: (habit: Habit) => void;
  handleJumpToToday: () => void;
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
