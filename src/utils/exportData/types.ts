/**
 * Types for data export functionality
 */

export interface HabitData {
  id: string;
  name: string;
  icon?: string;
  strength: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
  completions: Array<{
    date: string;
    completed: boolean;
  }>;
}

export interface ExportData {
  exportDate: string;
  version: string;
  user: {
    totalHabits: number;
    averageStrength: number;
  };
  habits: HabitData[];
}

export interface ToastResult {
  duration: number;
  message: string;
  type: 'success' | 'error';
}
