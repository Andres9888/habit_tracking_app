export interface SettingsModalProps {
  celebrationsEnabled?: boolean;
  completionSoundEnabled?: boolean;
  dayShape?: 'circle' | 'square';
  habitCompletionIcon?: 'chain' | 'checkbox';
  onChangeDayShape?: (value: 'circle' | 'square') => void | Promise<void>;
  onChangeShowCharacterScreen?: (value: boolean) => void | Promise<void>;
  onChangeHabitCompletionIcon?: (
    value: 'chain' | 'checkbox'
  ) => void | Promise<void>;
  onChangeCelebrationsEnabled?: (value: boolean) => void | Promise<void>;
  onChangeCompletionSoundEnabled?: (value: boolean) => void | Promise<void>;
  onChangeCompact?: (value: boolean) => void | Promise<void>;
  showHabitStrengthPercentage?: boolean;
  onChangeShowHabitStrengthPercentage?: (
    value: boolean
  ) => void | Promise<void>;
  showNotesStats?: boolean;
  onChangeShowNotesStats?: (value: boolean) => void | Promise<void>;
  isHighContrastActive?: boolean;
  isCompact?: boolean;
  onOpenHapticTest?: () => void;
  onOpenSortSheet?: () => void;
  onClose: () => void;
  showCharacterScreen?: boolean;
  visible: boolean;
  // Streak reminders
  streakRemindersEnabled?: boolean;
  streakReminderTime?: string;
  isPremium?: boolean;
  onToggleStreakReminders?: (value: boolean) => void | Promise<void>;
  onChangeStreakReminderTime?: (time: string) => void | Promise<void>;
  onPremiumUpsell?: () => void;
  isLoading?: boolean;
  // Completion sounds (premium feature)
  completionSoundEnabled?: boolean;
  completionSoundSelected?: 'chime' | 'pop' | 'success';
  onToggleCompletionSound?: (value: boolean) => void | Promise<void>;
  onChangeCompletionSound?: (value: 'chime' | 'pop' | 'success') => void | Promise<void>;
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
  completionSoundEnabled: boolean;
  onChangeCompletionSoundEnabled: (value: boolean) => void | Promise<void>;
  habitCompletionIcon: 'chain' | 'checkbox';
  habitSortMode: string;
  dayShape: 'circle' | 'square';
  onChangeHabitCompletionIcon: (
    value: 'chain' | 'checkbox'
  ) => void | Promise<void>;
  onChangeDayShape: (value: 'circle' | 'square') => void | Promise<void>;
  onChangeShowGradientFill: (value: boolean) => void | Promise<void>;
  archivedHabitsCount?: number;
  onOpenArchivedHabits: () => void;
  onOpenSortPicker: () => void;
  showGradientFill: boolean;
  // Streak reminders
  streakRemindersEnabled: boolean;
  streakReminderTime: string;
  isPremium: boolean;
  onToggleStreakReminders: (value: boolean) => void | Promise<void>;
  onChangeStreakReminderTime: (time: string) => void | Promise<void>;
  onPremiumUpsell?: () => void;
  // Completion sounds (premium feature)
  completionSoundEnabled: boolean;
  completionSoundSelected: 'chime' | 'pop' | 'success';
  onToggleCompletionSound: (value: boolean) => void | Promise<void>;
  onChangeCompletionSound: (value: 'chime' | 'pop' | 'success') => void | Promise<void>;
}
