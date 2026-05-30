/**
 * Settings Icon Colors
 *
 * Semantic color tokens for settings screen icons and backgrounds.
 * These colors are theme-aware and adapt to light/dark mode.
 *
 * Organized by settings section:
 * - Preferences: checkbox, circle, gradient, sound, calendarHeader
 * - Data: sort, archive
 * - Notifications: bell, clock, premiumTime
 * - Account: user, signOut, deleteAccount
 * - Premium: crown, zap, manageSub
 * - App: star, share, feedback, whatsNew
 * - Legal: legal
 * - About: info
 */

interface IconColor {
  icon: string;
  bg: string;
}

/**
 * Calm brand-tint palette: one soft forest-green tile (green glyph on a pale
 * green surface) for all rows. Warm and unmistakably on-brand without the old
 * rainbow of saturated hues — color stays cohesive and premium. Reserved for
 * STATE (switches, the account hero) plus DESTRUCTIVE actions, which stay
 * red-tinted so they remain instantly distinguishable.
 */
const lightTint: IconColor = { icon: '#047857', bg: '#E2F1EA' };
const lightDestructive: IconColor = { icon: '#B53030', bg: '#FEE2E2' };
const darkTint: IconColor = { icon: '#34D399', bg: 'rgba(52,211,153,0.14)' };
const darkDestructive: IconColor = { icon: '#FCA5A5', bg: '#4B1F1F' };

const buildSettingsColors = (
  base: IconColor,
  destructive: IconColor
): SettingsColors => ({
  // Preferences
  checkbox: base,
  compact: base,
  circle: base,
  gradient: base,
  sound: base,
  calendarHeader: base,
  strength: base,
  // Data
  sort: base,
  export: base,
  archive: base,
  // Notifications
  bell: base,
  clock: base,
  premiumTime: base,
  // Account
  user: base,
  signOut: destructive,
  deleteAccount: destructive,
  // Premium
  crown: base,
  zap: base,
  manageSub: base,
  // App
  star: base,
  share: base,
  feedback: base,
  whatsNew: base,
  // Legal
  legal: base,
  // About
  info: base,
});

/** Dark mode settings colors — soft brand-green tiles, destructive stays red */
export const darkSettingsColors: SettingsColors = buildSettingsColors(
  darkTint,
  darkDestructive
);

/** Light mode settings colors — soft brand-green tiles, destructive stays red */
export const lightSettingsColors: SettingsColors = buildSettingsColors(
  lightTint,
  lightDestructive
);

/** Settings color type definition */
export interface SettingsColors {
  // Preferences
  checkbox: IconColor;
  compact: IconColor;
  circle: IconColor;
  gradient: IconColor;
  sound: IconColor;
  calendarHeader: IconColor;
  strength: IconColor;
  // Data
  sort: IconColor;
  export: IconColor;
  archive: IconColor;
  // Notifications
  bell: IconColor;
  clock: IconColor;
  premiumTime: IconColor;
  // Account
  user: IconColor;
  signOut: IconColor;
  deleteAccount: IconColor;
  // Premium
  crown: IconColor;
  zap: IconColor;
  manageSub: IconColor;
  // App
  star: IconColor;
  share: IconColor;
  feedback: IconColor;
  whatsNew: IconColor;
  // Legal
  legal: IconColor;
  // About
  info: IconColor;
}
