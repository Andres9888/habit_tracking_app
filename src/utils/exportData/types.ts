/**
 * Types for data export functionality
 *
 * Supports both legacy analytics export and full GDPR-compliant export.
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

/** Full GDPR-compliant export with all user data */
export interface FullExportData {
  exportDate: string;
  exportType: 'full';
  version: string;
  account: {
    email?: string;
    name?: string;
    createdAt?: string;
  };
  settings: Record<string, unknown> | null;
  habits: Array<{
    id: string;
    name: string;
    icon?: string;
    notes?: string;
    why?: string;
    identity?: string;
    frequency?: string;
    strength: number;
    currentStreak: number;
    bestStreak: number;
    totalCompletions: number;
    createdAt: string;
    paused: boolean;
    archived: boolean;
    tags?: string[];
  }>;
  tracking: Array<{
    habitId: string;
    date: string;
    completed: boolean;
  }>;
  notes: Array<{
    date: string;
    body: string;
    habitId?: string;
    createdAt: string;
  }>;
  reflections: Array<{
    date: string;
    emoji: string;
    note?: string;
    habitId: string;
    createdAt: string;
  }>;
  affirmations: Array<{
    text: string;
    type?: string;
    habitId: string;
    createdAt: string;
  }>;
  letters: Array<{
    title?: string;
    content: string;
    habitId: string;
    unlockAt: string;
    isRead: boolean;
    createdAt: string;
  }>;
  visionBoardItems: Array<{
    title: string;
    body?: string;
    habitId: string;
    createdAt: string;
  }>;
  voiceNotes: Array<{
    label?: string;
    duration: number;
    habitId: string;
    isDay1?: boolean;
    createdAt: string;
  }>;
}

export interface ToastResult {
  duration: number;
  message: string;
  type: 'success' | 'error';
}
