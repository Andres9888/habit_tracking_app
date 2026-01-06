import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitSettings, HabitSettingsUpdate, HabitSortMode, HabitStatus, HabitTrackingEntry, RewardToastData, ShareCardData } from '../types';
import type { HabitCardEntranceVariant } from '../../../components/HabitCard';

export interface LastUpdatedHabit {
  id: string;
  name: string;
  strength: number;
}

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
  contentPadding: { paddingHorizontal: number; paddingTop: number; paddingBottom: number };
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

export interface HabitsModalsState {
  celebrationsEnabled: boolean;
  habits: Habit[];
  settings: HabitSettings | undefined;
  showSettings: boolean;
  showCreateHabit: boolean;
  showEditScreen: boolean;
  showHabitCalendar: boolean;
  showHabitDetail: boolean;
  habitDetailInitialTab: 'progress' | 'motivation' | 'manage';
  showHapticTest: boolean;
  showShareCard: boolean;
  showPauseModal: boolean;
  showTemplatesScreen: boolean;
  showQuickActions: boolean;
  showVisualizationExercise: boolean;
  showActivationModal: boolean;
  activationModalHabit: Habit | null;
  habitToEdit: Habit | null;
  habitToPause: Habit | null;
  selectedHabit: Habit | null;
  quickActionsHabit: Habit | null;
  shareCardData: ShareCardData | null;
  milestone: any; // Using any to avoid complex type from useMilestoneDetection
  tracking: HabitTrackingEntry[];
  showHabitStrengthPercentage: boolean;
  closeSettings: () => void;
  openSettings: () => void;
  openCreateHabitScreen: () => void;
  onChangeCelebrationsEnabled: (value: boolean) => Promise<void>;
  setShowHabitStrengthPercentage: (value: boolean) => void;
  closeCreateHabit: () => void;
  closeEditScreen: () => void;
  closeHabitCalendar: () => void;
  closeHabitDetail: () => void;
  closeShareCard: () => void;
  closePauseModal: () => void;
  openHapticTest: () => void;
  closeHapticTest: () => void;
  openTemplatesScreen: () => void;
  closeTemplatesScreen: () => void;
  openHabitDetail: (habit: Habit, initialTab?: 'progress' | 'motivation' | 'manage') => void;
  openHabitCalendar: (habit: Habit) => void;
  openPauseModal: (habitId: Id<'habits'>) => void;
  openEditHabit: (habit: Habit | null) => void;
  openQuickActions: (habit: Habit) => void;
  closeQuickActions: () => void;
  openVisualizationExercise: (habit: Habit) => void;
  closeVisualizationExercise: () => void;
  openActivationModal: (habit: Habit) => void;
  openActivationModalById: (habitId: string) => void;
  closeActivationModal: () => void;
  onSettingsChange: (updates: Partial<HabitSettingsUpdate>) => Promise<void>;
  onDeleteHabit: (habitId: Id<'habits'>) => Promise<void>;
  onShareMilestone: (data: ShareCardData) => void;
  clearMilestone: () => void;
  confirmPause: () => Promise<void>;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => Promise<void>;
  getStreak: (habitId: string) => number;
  handleArchive: (habitId: Id<'habits'>) => Promise<void>;
  reduceMotionPreference: boolean;
  /**
   * Current entrance animation variant for habit cards (dev only).
   * @default 'accentSlideDown'
   */
  entranceAnimationVariant: HabitCardEntranceVariant;
  /**
   * Callback to change entrance animation variant (dev only).
   */
  onChangeEntranceAnimationVariant: (value: HabitCardEntranceVariant) => void;
}

export interface UseHabitsAppResult {
  list: HabitsListState;
  modals: HabitsModalsState;
}
