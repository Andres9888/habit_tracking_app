export type DarkModePreference = 'system' | 'light' | 'dark';

export interface Settings {
  catTheme: boolean;
  darkMode: DarkModePreference;
  showCalendarView: boolean;
  showConsistency: boolean;
  showEmojis: boolean;
  showMotivationalMessages: boolean;
  showStreaks: boolean;
  showWeekCompletionBar: boolean;
}

export interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export type ToggleableSettingKey = Exclude<keyof Settings, 'darkMode'>;

export interface SettingConfig {
  key: ToggleableSettingKey;
  label: string;
  ariaLabel: string;
}
