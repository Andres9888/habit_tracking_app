/**
 * Settings type definitions and constants
 */

export const DARK_MODE_OPTIONS = ['system', 'light', 'dark'] as const;
export type DarkModePreference = (typeof DARK_MODE_OPTIONS)[number];

export const HABIT_SORT_MODE_OPTIONS = [
  'manual',
  'name_asc',
  'name_desc',
  'strength_asc',
  'strength_desc',
  'streak_asc',
  'streak_desc',
  'day_phase',
] as const;
export type HabitSortMode = (typeof HABIT_SORT_MODE_OPTIONS)[number];

export const DEFAULT_SETTINGS = {
  appIcon: 'default' as const,
  catTheme: true,
  celebrationsEnabled: true,
  darkMode: 'light' as DarkModePreference,
  dayShape: 'square' as const,
  habitCompletionIcon: 'chain' as const,
  habitSortMode: 'manual' as HabitSortMode,
  hasPremium: false,
  // Forced to light - dark mode not yet implemented
  highContrastMode: false,
  reduceMotion: false,
  showCalendarView: true,
  showCharacterScreen: true,
  showConsistency: true,
  showEmojis: true,
  showMotivationalMessages: true,
  showNotesStats: true,
  showStreaks: true,
  showWeekCompletionBar: false,
  useDyslexicFont: false,
};
