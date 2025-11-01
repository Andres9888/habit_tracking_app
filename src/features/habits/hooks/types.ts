import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitSettings, HabitSettingsUpdate, HabitStatus, HabitTrackingEntry, ShareCardData } from '../types';

export interface LastUpdatedHabit {
  id: string;
  name: string;
  strength: number;
}

export interface HabitsListState {
  habits: Habit[];
  isHabitsLoading: boolean;
  weekDates: Date[];
  weekDateStrings: string[];
  canNavigateForward: boolean;
  showHabitStrengthPercentage: boolean;
  contentPadding: { paddingHorizontal: number; paddingTop: number; paddingBottom: number };
  handleDragEnd: (event: { data: Habit[] }) => Promise<void>;
  handleArchive: (habitId: Id<'habits'>) => Promise<void>;
  handleHabitPress: (habit: Habit) => void;
  handleNextWeek: () => void;
  handlePreviousWeek: () => void;
  openCreateHabitScreen: () => void;
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  getStreak: (habitId: string) => number;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => Promise<void>;
}

export interface HabitsModalsState {
  habits: Habit[];
  settings: HabitSettings | undefined;
  showSettings: boolean;
  showCreateHabit: boolean;
  showHabitCalendar: boolean;
  showHabitDetail: boolean;
  showHapticTest: boolean;
  showShareCard: boolean;
  showPauseModal: boolean;
  showTemplatesScreen: boolean;
  habitToEdit: Habit | null;
  habitToPause: Habit | null;
  selectedHabit: Habit | null;
  shareCardData: ShareCardData | null;
  milestone: any; // Using any to avoid complex type from useMilestoneDetection
  tracking: HabitTrackingEntry[];
  showHabitStrengthPercentage: boolean;
  closeSettings: () => void;
  openSettings: () => void;
  openCreateHabitScreen: () => void;
  setShowHabitStrengthPercentage: (value: boolean) => void;
  closeCreateHabit: () => void;
  closeHabitCalendar: () => void;
  closeHabitDetail: () => void;
  closeShareCard: () => void;
  closePauseModal: () => void;
  openHapticTest: () => void;
  closeHapticTest: () => void;
  openTemplatesScreen: () => void;
  closeTemplatesScreen: () => void;
  openHabitDetail: (habit: Habit) => void;
  openHabitCalendar: (habit: Habit) => void;
  openPauseModal: (habitId: Id<'habits'>) => void;
  openEditHabit: (habit: Habit | null) => void;
  onSettingsChange: (updates: Partial<HabitSettingsUpdate>) => Promise<void>;
  onDeleteHabit: (habitId: Id<'habits'>) => Promise<void>;
  onShareMilestone: (data: ShareCardData) => void;
  clearMilestone: () => void;
  confirmPause: () => Promise<void>;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => Promise<void>;
  getStreak: (habitId: string) => number;
  handleArchive: (habitId: Id<'habits'>) => Promise<void>;
}

export interface UseHabitsAppResult {
  list: HabitsListState;
  modals: HabitsModalsState;
}
