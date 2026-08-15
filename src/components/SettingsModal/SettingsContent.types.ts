/** SettingsContent prop contract */
import type {
  CompletionSoundType,
  DarkModePreference,
} from '../../../convex/settings/types';

export interface SettingsContentProps {
  bottomInset?: number;
  compactView: boolean;
  onChangeCompactView: (value: boolean) => void | Promise<void>;
  completionSoundEnabled: boolean;
  completionSoundType: CompletionSoundType;
  onChangeCompletionSoundEnabled: (value: boolean) => void | Promise<void>;
  onChangeCompletionSoundType: (
    value: CompletionSoundType
  ) => void | Promise<void>;
  habitSortMode: string;
  darkModePreference: DarkModePreference;
  onChangeDarkModePreference: (
    value: DarkModePreference
  ) => void | Promise<void>;
  archivedHabitsCount?: number;
  onOpenAccount: () => void;
  onOpenArchivedHabits: () => void;
  onOpenCalendarLook: () => void;
  onOpenAnalytics: () => void;
  onChangeHabitSortMode: (
    mode: import('../../features/habits/types').HabitSortMode
  ) => void;
  onExportHabitsData?: () => void | Promise<void>;
  // Streak reminders
  streakRemindersEnabled: boolean;
  streakReminderTime: string;
  isPremium: boolean;
  onToggleStreakReminders: (value: boolean) => void | Promise<void>;
  onChangeStreakReminderTime: (time: string) => void | Promise<void>;
  onPremiumUpsell?: () => void;
}
