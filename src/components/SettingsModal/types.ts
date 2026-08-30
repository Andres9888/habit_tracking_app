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
 * Props SettingsModal actually consumes.
 *
 * `celebrationsEnabled`, `showCharacterScreen`, `showHabitStrengthPercentage`,
 * `onOpenHapticTest`, `isCompact` and `onChangeCompact` used to be declared
 * here and passed by the host — and forwarded to nothing. They were the tail of
 * removed features, and they made this contract advertise settings the screen
 * has not offered in months.
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
  onExportHabitsData?: () => void | Promise<void>;
  isLoading?: boolean;
  archivedHabitsCount?: number;
  settingsDocument?: SettingsModalSettingsDocument;
}

export type { SettingsContentProps } from './SettingsContent.types';
