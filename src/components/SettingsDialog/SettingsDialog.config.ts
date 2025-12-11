import type { Settings, SettingConfig } from './SettingsDialog.types';

export const DEFAULT_SETTINGS: Settings = {
  catTheme: true,
  darkMode: 'system',
  showCalendarView: true,
  showConsistency: true,
  showEmojis: true,
  showMotivationalMessages: true,
  showStreaks: true,
  showWeekCompletionBar: false,
};

export const SETTINGS_CONFIG: SettingConfig[] = [
  {
    ariaLabel: 'Toggle show streaks',
    key: 'showStreaks',
    label: 'Show Streaks',
  },
  {
    ariaLabel: 'Toggle show consistency',
    key: 'showConsistency',
    label: 'Show Consistency',
  },
  {
    ariaLabel: 'Toggle motivational messages',
    key: 'showMotivationalMessages',
    label: 'Show Motivational Messages',
  },
  { ariaLabel: 'Toggle emojis', key: 'showEmojis', label: 'Show Emojis' },
  {
    ariaLabel: 'Toggle calendar view',
    key: 'showCalendarView',
    label: 'Enable Calendar View',
  },
  {
    ariaLabel: 'Toggle daily progress bar',
    key: 'showWeekCompletionBar',
    label: 'Show Daily Progress',
  },
  { ariaLabel: 'Toggle cat theme', key: 'catTheme', label: 'Cat Theme' },
];
