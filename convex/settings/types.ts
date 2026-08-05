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
] as const;
export type HabitSortMode = (typeof HABIT_SORT_MODE_OPTIONS)[number];

// Completion sound options
export const COMPLETION_SOUND_OPTIONS = ['chime', 'pop', 'success'] as const;
export type CompletionSoundType = (typeof COMPLETION_SOUND_OPTIONS)[number];

// Calendar connector style — replaces the old showStreakConnections boolean.
export const CONNECTOR_STYLE_OPTIONS = ['none', 'small', 'full'] as const;
export type ConnectorStyle = (typeof CONNECTOR_STYLE_OPTIONS)[number];

export const DEFAULT_SETTINGS = {
  appIcon: 'default' as const,
  appLock: false,
  catTheme: true,
  celebrationsEnabled: true,
  compactView: false,
  completionSoundEnabled: false,
  completionSoundType: 'chime' as CompletionSoundType,
  darkMode: 'light' as DarkModePreference,
  dayShape: 'circle' as const,
  habitCompletionIcon: 'chain' as const,
  habitSortMode: 'manual' as HabitSortMode,
  hasPremium: false,
  reduceMotion: false,
  showCalendarView: true,
  showCharacterScreen: true,
  showConsistency: true,
  showEmojis: true,
  showGradientFill: true,
  connectorStyle: 'full' as ConnectorStyle,
  showMotivationalMessages: true,
  showStreaks: true,
  stickyCalendarHeader: false,
  showWeekCompletionBar: false,
  streakRemindersEnabled: false,
  streakReminderTime: '20:00',
  useDyslexicFont: false,
};
