import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, ShareCardData } from '../types';

export interface HandlersReturn {
  closeCreateHabit: () => void;
  closeEditScreen: () => void;
  closeShareCard: () => void;
  closeQuickActions: () => void;
  confirmPause: () => Promise<void>;
  closeVisualizationExercise: () => void;
  onSettingsChange: (u: Record<string, unknown>) => Promise<void>;
  onDeleteHabit: (id: Id<'habits'>) => Promise<void>;
  openEditHabit: (h: Habit | null) => void;
  openHabitCalendar: (h: Habit) => void;
  onShareMilestone: (d: ShareCardData) => void;
  openHabitDetail: (h: Habit, t?: 'progress' | 'motivation' | 'manage') => void;
  openPauseModal: (id: Id<'habits'>) => void;
  openCreateHabitScreen: () => void;
  openQuickActions: (h: Habit) => void;
  openVisualizationExercise: (h: Habit) => void;
}

export interface ExtraState {
  archivedHabitsCount: number;
  celebrationsEnabled: boolean;
  isSettingsModalLoading: boolean;
  habits: Habit[];
  settings: unknown;
  milestone: unknown;
  showHabitStrengthPercentage: boolean;
  tracking: unknown;
  reduceMotionPreference: boolean;
  handleArchive: (id: Id<'habits'>) => Promise<void>;
  onChangeCelebrationsEnabled: (value: boolean) => Promise<void>;
  handleToggleHabit: (args: {
    habitId: Id<'habits'>;
    date: string;
  }) => Promise<void>;
  clearMilestone: () => void;
  getStreak: unknown;
}
