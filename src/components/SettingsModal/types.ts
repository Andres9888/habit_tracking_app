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

/**
 * NOTE: celebrationsEnabled, showHabitStrengthPercentage, showCharacterScreen
 * and onOpenHapticTest used to live here. No row ever rendered them, and
 * `setShowHabitStrengthPercentage` was a `() => {}` stub, so the props were
 * inert. The underlying features still read their Convex values on the habit
 * list — only the dead Settings plumbing was removed.
 */
export interface SettingsModalProps {
  completionSoundEnabled?: boolean;
  completionSoundType?: CompletionSoundType;
  dayShape?: 'circle' | 'square';
  habitCompletionIcon?: 'chain' | 'checkbox';
  onChangeDayShape?: (value: 'circle' | 'square') => void | Promise<void>;
  onChangeHabitCompletionIcon?: (
    value: 'chain' | 'checkbox'
  ) => void | Promise<void>;
  onChangeCompletionSoundEnabled?: (value: boolean) => void | Promise<void>;
  onChangeCompletionSoundType?: (
    value: CompletionSoundType
  ) => void | Promise<void>;
  onChangeCompact?: (value: boolean) => void | Promise<void>;
  isCompact?: boolean;
  onClose: () => void;
  visible: boolean;
  warmMount?: boolean;
  // Streak reminders
  streakRemindersEnabled?: boolean;
  streakReminderTime?: string;
  stickyCalendarHeader?: boolean;
  isPremium?: boolean;
  onChangeStickyCalendarHeader?: (value: boolean) => void | Promise<void>;
  onToggleStreakReminders?: (value: boolean) => void | Promise<void>;
  onChangeStreakReminderTime?: (time: string) => void | Promise<void>;
  onPremiumUpsell?: () => void;
  onExportHabitsData?: (format: 'csv' | 'json') => void | Promise<void>;
  isLoading?: boolean;
  archivedHabitsCount?: number;
  settingsDocument?: SettingsModalSettingsDocument;
}

export type { SettingsContentProps } from './SettingsContent.types';
