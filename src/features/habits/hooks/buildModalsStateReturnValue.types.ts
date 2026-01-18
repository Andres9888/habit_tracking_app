import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';

export interface HandlersReturn {
  closeCreateHabit: () => void;
  closeEditScreen: () => void;
  closeShareCard: () => void;
  closeQuickActions: () => void;
  confirmPause: () => Promise<void>;
  closeVisualizationExercise: () => void;
  onSettingsChange: (u: unknown) => Promise<void>;
  onDeleteHabit: (id: Id<'habits'>) => Promise<void>;
  openEditHabit: (h: Habit | null) => void;
  closeActivationModal: () => void;
  openHabitCalendar: (h: Habit) => void;
  onShareMilestone: (d: unknown) => void;
  openHabitDetail: (h: Habit, t?: 'progress' | 'motivation' | 'manage') => void;
  openActivationModal: (h: Habit) => void;
  openPauseModal: (id: Id<'habits'>) => void;
  openActivationModalById: (id: string) => void;
  openCreateHabitScreen: () => void;
  openQuickActions: (h: Habit) => void;
  openVisualizationExercise: (h: Habit) => void;
}

export interface ExtraState {
  celebrationsEnabled: boolean;
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
