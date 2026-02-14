import type { Doc, Id } from '../../../convex/_generated/dataModel';
import type { MilestoneAchievement } from '../../hooks/useMilestoneDetection';

export type Habit = Doc<'habits'>;
export type HabitId = Id<'habits'>;
export type HabitTrackingEntry = Doc<'tracking'>;

export type HabitStatus = 'done' | 'missed' | 'planned';

export type HabitSortMode =
  | 'manual'
  | 'day_phase'
  | 'name_asc'
  | 'name_desc'
  | 'strength_asc'
  | 'strength_desc'
  | 'streak_asc'
  | 'streak_desc';

export type ShareCardData = {
  habitName: string;
  userName?: string;
  // Streak milestone sharing (new)
  streakCount?: number;
  milestoneDays?: 7 | 30 | 100;
  motivationalMessage?: string;
  // Legacy strength-level sharing (backward compatibility)
  milestoneLevel?: MilestoneAchievement['level'];
  strengthPercentage?: number;
};

export interface RewardToastData {
  habitId: HabitId;
  habitName: string;
  message: string;
  streak: number;
}

export interface HabitSettings {
  appIcon: string;
  catTheme: boolean;
  dayShape: 'circle' | 'square';
  hasPremium: boolean;
  habitCompletionIcon: 'chain' | 'checkbox';
  darkMode: 'system' | 'light' | 'dark';
  habitSortMode: HabitSortMode;
  highContrastMode: boolean;
  reduceMotion: boolean;
  showCalendarView: boolean;
  showCharacterScreen: boolean;
  showConsistency: boolean;
  showEmojis: boolean;
  showMotivationalMessages: boolean;
  showWeekCompletionBar: boolean;
  showNotesStats: boolean;
  showStreaks: boolean;
  useDyslexicFont: boolean;
}

export type HabitSettingsUpdate = HabitSettings;
export type SettingsDocument = HabitSettings;
