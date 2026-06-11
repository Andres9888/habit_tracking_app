/** SettingsContent prop contract */
import type {
  CompletionSoundType,
  DarkModePreference,
} from '../../../convex/settings/types';
import type { SettingsColors } from './types';

export interface SettingsContentProps {
  colors: SettingsColors;
  isHighContrastActive: boolean;
  bottomInset?: number;
  compactView: boolean;
  onChangeCompactView: (value: boolean) => void | Promise<void>;
  completionSoundEnabled: boolean;
  completionSoundType: CompletionSoundType;
  onChangeCompletionSoundEnabled: (value: boolean) => void | Promise<void>;
  onChangeCompletionSoundType: (
    value: CompletionSoundType
  ) => void | Promise<void>;
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
  darkModePreference: DarkModePreference;
  onChangeDarkModePreference: (
    value: DarkModePreference
  ) => void | Promise<void>;
  /** Optimistic high-contrast setting value (drives the switch position) */
  highContrastEnabled: boolean;
  onChangeHighContrast: (value: boolean) => void | Promise<void>;
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
