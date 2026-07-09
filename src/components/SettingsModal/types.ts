import type { CompletionSoundType } from '../../../convex/settings/types';

export interface SettingsModalSettingsDocument {
  [key: string]: unknown;
  compactView?: boolean;
  darkMode?: unknown;
  reduceMotion?: boolean;
  useDyslexicFont?: boolean;
  showGradientFill?: boolean;
  connectorStyle?: 'none' | 'small' | 'full';
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
  onChangeCompletionSoundType?: (
    value: CompletionSoundType
  ) => void | Promise<void>;
  onChangeCompact?: (value: boolean) => void | Promise<void>;
  showHabitStrengthPercentage?: boolean;
  onChangeShowHabitStrengthPercentage?: (
    value: boolean
  ) => void | Promise<void>;
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

export type { SettingsContentProps } from './SettingsContent.types';
