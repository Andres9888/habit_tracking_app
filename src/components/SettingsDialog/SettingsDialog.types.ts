export interface Settings {
  showStreaks: boolean;
  showConsistency: boolean;
  showMotivationalMessages: boolean;
  showEmojis: boolean;
  showCalendarView: boolean;
  catTheme: boolean;
  darkMode: boolean;
  useDyslexicFont: boolean;
}

export interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SettingConfig {
  key: keyof Settings;
  label: string;
  ariaLabel: string;
}
