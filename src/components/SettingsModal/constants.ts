/**
 * Settings Constants
 *
 * Section definitions, grid options, and configuration values.
 */

export const SETTINGS_SECTIONS = {
  account: {
    icon: '👤',
    id: 'account',
    title: 'Account',
  },
  app: {
    icon: '📱',
    id: 'app',
    title: 'App',
  },
  appearance: {
    icon: '🎨',
    id: 'appearance',
    title: 'Appearance',
  },
  danger: {
    icon: '⚠️',
    id: 'danger',
    title: 'Danger Zone',
    variant: 'danger' as const,
  },
  data: {
    icon: '💾',
    id: 'data',
    title: 'Data',
  },
  legal: {
    icon: '📋',
    id: 'legal',
    title: 'Legal',
  },
  notifications: {
    icon: '🔔',
    id: 'notifications',
    title: 'Notifications',
  },
} as const;

export const THEME_OPTIONS = [
  { emoji: '☀️', id: 'light', label: 'Light' },
  { emoji: '🌙', id: 'dark', label: 'Dark' },
  { emoji: '📱', id: 'system', label: 'System' },
];

export const COMPLETION_ICON_OPTIONS = [
  { emoji: '✓', id: 'check', label: 'Check' },
  { emoji: '🔗', id: 'chain', label: 'Chain' },
  { emoji: '⭐', id: 'star', label: 'Star' },
];

export const DAY_SHAPE_OPTIONS = [
  { emoji: '⬜', id: 'square', label: 'Square' },
  { emoji: '⚫', id: 'circle', label: 'Circle' },
  { emoji: '🔷', id: 'diamond', label: 'Diamond' },
];

export const LEGAL_LINKS = {
  privacy: 'https://andres9888.github.io/chainday-landing/privacy.html',
  terms: 'https://andres9888.github.io/chainday-landing/terms.html',
};

export const APP_STORE_URL = 'https://apps.apple.com/app/chain-day';
export const SUPPORT_EMAIL = 'support@chainday.app';
