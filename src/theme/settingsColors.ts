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

/** Dark mode settings colors - darker backgrounds with brighter icons */
export const darkSettingsColors: SettingsColors = {
  // Preferences
  checkbox: { icon: '#fbbf24', bg: '#3b2a10' },
  compact: { icon: '#fb7185', bg: '#4c1d2c' },
  circle: { icon: '#93c5fd', bg: '#1e3a5f' },
  gradient: { icon: '#6ee7b7', bg: '#0f3b31' },
  sound: { icon: '#fbbf24', bg: '#3b2a10' },
  calendarHeader: { icon: '#d6d3d1', bg: '#2c2824' },
  // Data
  sort: { icon: '#c4b5fd', bg: '#31214b' },
  export: { icon: '#6ee7b7', bg: '#0f3b31' },
  archive: { icon: '#d6d3d1', bg: '#2c2824' },
  // Notifications
  bell: { icon: '#fdba74', bg: '#4a2410' },
  clock: { icon: '#93c5fd', bg: '#1e3a5f' },
  premiumTime: { icon: '#fbbf24', bg: '#3b2a10' },
  // Account
  user: { icon: '#6ee7b7', bg: '#0f3b31' },
  signOut: { icon: '#fca5a5', bg: '#4b1f1f' },
  deleteAccount: { icon: '#fca5a5', bg: '#4b1f1f' },
  // Premium
  crown: { icon: '#fbbf24', bg: '#3b2a10' },
  zap: { icon: '#c4b5fd', bg: '#31214b' },
  manageSub: { icon: '#c4b5fd', bg: '#31214b' },
  // App
  star: { icon: '#fbbf24', bg: '#3b2a10' },
  share: { icon: '#6ee7b7', bg: '#0f3b31' },
  feedback: { icon: '#93c5fd', bg: '#1e3a5f' },
  whatsNew: { icon: '#c4b5fd', bg: '#31214b' },
  // Legal
  legal: { icon: '#d6d3d1', bg: '#2c2824' },
  // About
  info: { icon: '#d6d3d1', bg: '#2c2824' },
};

/** Light mode settings colors - light backgrounds with colored icons */
export const lightSettingsColors: SettingsColors = {
  // Preferences
  checkbox: { icon: '#a16207', bg: '#fef3c7' },
  compact: { icon: '#be123c', bg: '#ffe4e6' },
  circle: { icon: '#1d4ed8', bg: '#dbeafe' },
  gradient: { icon: '#047857', bg: '#d1fae5' },
  sound: { icon: '#b45309', bg: '#fef3c7' },
  calendarHeader: { icon: '#57534e', bg: '#f5f5f4' },
  // Data
  sort: { icon: '#6d28d9', bg: '#ede9fe' },
  export: { icon: '#047857', bg: '#d1fae5' },
  archive: { icon: '#78716c', bg: '#e7e5e4' },
  // Notifications
  bell: { icon: '#c2410c', bg: '#ffedd5' },
  clock: { icon: '#1d4ed8', bg: '#dbeafe' },
  premiumTime: { icon: '#a16207', bg: '#fef3c7' },
  // Account
  user: { icon: '#047857', bg: '#d1fae5' },
  signOut: { icon: '#b53030', bg: '#fee2e2' },
  deleteAccount: { icon: '#b53030', bg: '#fee2e2' },
  // Premium
  crown: { icon: '#a16207', bg: '#fef3c7' },
  zap: { icon: '#6d28d9', bg: '#ede9fe' },
  manageSub: { icon: '#6d28d9', bg: '#ede9fe' },
  // App
  star: { icon: '#a16207', bg: '#fef3c7' },
  share: { icon: '#047857', bg: '#d1fae5' },
  feedback: { icon: '#1d4ed8', bg: '#dbeafe' },
  whatsNew: { icon: '#6d28d9', bg: '#ede9fe' },
  // Legal
  legal: { icon: '#78716c', bg: '#e7e5e4' },
  // About
  info: { icon: '#78716c', bg: '#e7e5e4' },
};

/** Settings color type definition */
export interface SettingsColors {
  // Preferences
  checkbox: IconColor;
  compact: IconColor;
  circle: IconColor;
  gradient: IconColor;
  sound: IconColor;
  calendarHeader: IconColor;
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
