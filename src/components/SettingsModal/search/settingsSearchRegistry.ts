export type SettingsGroup =
  | 'Look & Feel'
  | 'Habits'
  | 'Reminders'
  | 'Data & Privacy'
  | 'About & Support'
  | 'Account';

export interface SettingsEntry {
  id: string;
  label: string;
  group: SettingsGroup;
  keywords: string[];
}

export const SETTINGS_SEARCH_ENTRIES: SettingsEntry[] = [
  // Look & Feel
  {
    id: 'theme',
    label: 'Theme',
    group: 'Look & Feel',
    keywords: ['dark mode', 'light', 'appearance', 'color scheme'],
  },
  {
    id: 'dayShape',
    label: 'Day marker shape',
    group: 'Look & Feel',
    keywords: ['circle', 'square', 'calendar marker'],
  },
  {
    id: 'gradientFill',
    label: 'Gradient streak fill',
    group: 'Look & Feel',
    keywords: ['streak fill', 'color', 'gradient'],
  },
  {
    id: 'streakConnections',
    label: 'Streak connections',
    group: 'Look & Feel',
    keywords: ['chain', 'link', 'connect days'],
  },
  {
    id: 'completionIcon',
    label: 'Completion icon',
    group: 'Look & Feel',
    keywords: ['check', 'chain', 'checkbox', 'checkmark'],
  },
  {
    id: 'growthIcons',
    label: 'Default growth icons',
    group: 'Look & Feel',
    keywords: ['emoji', 'plant', 'progress', 'emojis'],
  },
  {
    id: 'compactCards',
    label: 'Compact habit cards',
    group: 'Look & Feel',
    keywords: ['density', 'fit more', 'compact', 'display'],
  },
  // Habits
  {
    id: 'sort',
    label: 'Sort order',
    group: 'Habits',
    keywords: ['order', 'name', 'strength', 'streak', 'custom', 'arrange'],
  },
  {
    id: 'completionSound',
    label: 'Completion sound',
    group: 'Habits',
    keywords: ['audio', 'sound effect', 'play sound', 'chime'],
  },
  {
    id: 'stickyHeader',
    label: 'Sticky month header',
    group: 'Habits',
    keywords: ['sticky month', 'pinned calendar', 'scroll', 'month'],
  },
  // Reminders
  {
    id: 'streakReminders',
    label: 'Streak Reminders',
    group: 'Reminders',
    keywords: ['notification', 'nudge', 'alarm', 'remind', 'push'],
  },
  {
    id: 'reminderTime',
    label: 'Reminder time',
    group: 'Reminders',
    keywords: ['time', 'when', '8pm', 'schedule', 'hour'],
  },
  // Data & Privacy
  {
    id: 'archived',
    label: 'Archived habits',
    group: 'Data & Privacy',
    keywords: ['hidden habits', 'restore', 'archive', 'hidden'],
  },
  {
    id: 'export',
    label: 'Export habits data',
    group: 'Data & Privacy',
    keywords: ['csv', 'json', 'backup', 'download', 'data'],
  },
  {
    id: 'deleteAccount',
    label: 'Delete account',
    group: 'Data & Privacy',
    keywords: ['remove', 'erase', 'close account', 'deactivate'],
  },
  // About & Support
  {
    id: 'rate',
    label: 'Rate Chain Day',
    group: 'About & Support',
    keywords: ['review', 'app store', 'stars', 'rating'],
  },
  {
    id: 'share',
    label: 'Share with Friends',
    group: 'About & Support',
    keywords: ['invite', 'refer friends', 'share app'],
  },
  {
    id: 'feedback',
    label: 'Send Feedback',
    group: 'About & Support',
    keywords: ['contact', 'support', 'bug', 'report', 'help'],
  },
  {
    id: 'whatsNew',
    label: "What's New",
    group: 'About & Support',
    keywords: ['changelog', 'release notes', 'updates', 'new features'],
  },
  {
    id: 'privacy',
    label: 'Privacy Policy',
    group: 'About & Support',
    keywords: ['policy', 'data', 'gdpr', 'personal information'],
  },
  {
    id: 'terms',
    label: 'Terms of Service',
    group: 'About & Support',
    keywords: ['legal', 'tos', 'agreement', 'conditions'],
  },
  {
    id: 'version',
    label: 'Version',
    group: 'About & Support',
    keywords: ['build', 'about', 'app version', 'number'],
  },
  // Account
  {
    id: 'manageSubscription',
    label: 'Manage Subscription',
    group: 'Account',
    keywords: ['billing', 'premium', 'plan', 'subscription', 'payment'],
  },
  {
    id: 'signOut',
    label: 'Sign Out',
    group: 'Account',
    keywords: ['log out', 'logout', 'sign off', 'leave'],
  },
];
