import type { Doc, Id } from '../../../convex/_generated/dataModel';
import type { MilestoneAchievement } from '../../hooks/useMilestoneDetection';

export type Habit = Doc<'habits'>;
export type HabitId = Id<'habits'>;
export type HabitTrackingEntry = Doc<'tracking'>;

export type HabitStatus = 'done' | 'missed' | 'planned';

export type ShareCardData = {
  habitName: string;
  milestoneLevel: MilestoneAchievement['level'];
  strengthPercentage: number;
  userName?: string;
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
  darkMode: 'system' | 'light' | 'dark';
  highContrastMode: boolean;
  reduceMotion: boolean;
  showCalendarView: boolean;
  showCharacterScreen: boolean;
  showConsistency: boolean;
  showEmojis: boolean;
  showMotivationalMessages: boolean;
  showNotesStats: boolean;
  showStreaks: boolean;
  useDyslexicFont: boolean;
}

export type HabitSettingsUpdate = HabitSettings;
