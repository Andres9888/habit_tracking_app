/**
 * HabitsModalsState Types
 * State interface for the habits modal management
 *
 * @see docs/offline-habit-sync.md T011
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type { ToggleMutationResult } from '../../../lib/optimistic';
import type {
  Habit,
  HabitSettings,
  HabitSettingsUpdate,
  HabitTrackingEntry,
  ShareCardData,
} from '../types';

export interface HabitsModalsState {
  archivedHabitsCount: number;
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
  habitToEdit: Habit | null;
  habitToPause: Habit | null;
  selectedHabit: Habit | null;
  quickActionsHabit: Habit | null;
  shareCardData: ShareCardData | null;
  milestone: unknown;
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
  openHabitDetail: (
    habit: Habit,
    initialTab?: 'progress' | 'motivation' | 'manage'
  ) => void;
  openHabitCalendar: (habit: Habit) => void;
  openPauseModal: (habitId: Id<'habits'>) => void;
  openEditHabit: (habit: Habit | null) => void;
  openQuickActions: (habit: Habit) => void;
  closeQuickActions: () => void;
  openVisualizationExercise: (habit: Habit) => void;
  closeVisualizationExercise: () => void;
  onSettingsChange: (updates: Partial<HabitSettingsUpdate>) => Promise<void>;
  onDeleteHabit: (habitId: Id<'habits'>) => Promise<void>;
  onShareMilestone: (data: ShareCardData) => void;
  clearMilestone: () => void;
  confirmPause: () => Promise<void>;
  /** Toggle habit completion with offline queue support (T011) */
  toggleHabit: (args: {
    habitId: Id<'habits'>;
    date: string;
  }) => Promise<ToggleMutationResult>;
  getStreak: (habitId: string) => number;
  handleArchive: (habitId: Id<'habits'>) => Promise<void>;
  reduceMotionPreference: boolean;
}
