import type { CompletionSoundType } from '../../../convex/settings/types';

export interface SettingsModalSettingsDocument {
  [key: string]: unknown;
  compactView?: boolean;
  darkMode?: unknown;
  reduceMotion?: boolean;
  highContrastMode?: boolean;
  useDyslexicFont?: boolean;
  showGradientFill?: boolean;
  showStreakConnections?: boolean;
  stickyCalendarHeader?: boolean;
  habitSortMode?: string;
}

export interface SettingsModalProps {
  celebrationsEnabled?: boolean;
  completionSoundEnabled?: boolean;
  completionSoundType?: CompletionSoundType;
  dayShape?: 'circle' | 'square';
  habitCompletionIcon?: 'chain' | 'checkbox';
  onChangeDayShape?: (value: 'circle' | 'square') => void | Promise<void>;
  onChangeShowCharacterScreen?: (value: boolean) => void | Promise<void>;
  onChangeHabitCompletionIcon?: (
    value: 'chain' | 'checkbox'
  ) => void | Promise<void>;
  onChangeCelebrationsEnabled?: (value: boolean) => void | Promise<void>;
  onChangeCompletionSoundEnabled?: (value: boolean) => void | Promise<void>;
  onChangeCompletionSoundType?: (value: CompletionSoundType) => void | Promise<void>;
  onChangeCompact?: (value: boolean) => void | Promise<void>;
  showHabitStrengthPercentage?: boolean;
  onChangeShowHabitStrengthPercentage?: (
    value: boolean
  ) => void | Promise<void>;
  isHighContrastActive?: boolean;
  isCompact?: boolean;
  onOpenHapticTest?: () => void;
  onClose: () => void;
  showCharacterScreen?: boolean;
  visible: boolean;
  // Streak reminders
  streakRemindersEnabled?: boolean;
  streakReminderTime?: string;
  stickyCalendarHeader?: boolean;
  isPremium?: boolean;
  onChangeStickyCalendarHeader?: (value: boolean) => void | Promise<void>;
  onToggleStreakReminders?: (value: boolean) => void | Promise<void>;
  onChangeStreakReminderTime?: (time: string) => void | Promise<void>;
  onPremiumUpsell?: () => void;
  onExportHabitsData?: () => void | Promise<void>;
  isLoading?: boolean;
  archivedHabitsCount?: number;
  settingsDocument?: SettingsModalSettingsDocument;
}

export interface SettingsColors {
  accent: string;
  background: string;
  card: string;
  cardBorder: string;
  headerText: string;
  icon: string;
  mutedText: string;
  versionText: string;
}

export interface SettingsContentProps {
  colors: SettingsColors;
  isHighContrastActive: boolean;
  bottomInset?: number;
  compactView: boolean;
  onChangeCompactView: (value: boolean) => void | Promise<void>;
  completionSoundEnabled: boolean;
  completionSoundType: CompletionSoundType;
  onChangeCompletionSoundEnabled: (value: boolean) => void | Promise<void>;
  onChangeCompletionSoundType: (value: CompletionSoundType) => void | Promise<void>;
  habitCompletionIcon: 'chain' | 'checkbox';
  habitSortMode: string;
  dayShape: 'circle' | 'square';
  onChangeHabitCompletionIcon: (
    value: 'chain' | 'checkbox'
  ) => void | Promise<void>;
  onChangeDayShape: (value: 'circle' | 'square') => void | Promise<void>;
  onChangeShowGradientFill: (value: boolean) => void | Promise<void>;
  showStreakConnections: boolean;
  onChangeShowStreakConnections: (value: boolean) => void | Promise<void>;
  archivedHabitsCount?: number;
  onOpenAccount: () => void;
  onOpenArchivedHabits: () => void;
  onOpenSortPicker: () => void;
  onExportHabitsData?: () => void | Promise<void>;
  showGradientFill: boolean;
  // Streak reminders
  streakRemindersEnabled: boolean;
  stickyCalendarHeader: boolean;
  streakReminderTime: string;
  isPremium: boolean;
  onChangeStickyCalendarHeader: (value: boolean) => void | Promise<void>;
  onToggleStreakReminders: (value: boolean) => void | Promise<void>;
  onChangeStreakReminderTime: (time: string) => void | Promise<void>;
  onPremiumUpsell?: () => void;
}
