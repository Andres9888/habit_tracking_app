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
  checkbox: { icon: '#38bdf8', bg: '#1e3a5f' },
  circle: { icon: '#a78bfa', bg: '#2e1f5e' },
  gradient: { icon: '#34d399', bg: '#052e2a' },
  sound: { icon: '#fbbf24', bg: '#3d2e06' },
  calendarHeader: { icon: '#22d3ee', bg: '#0f4b55' },
  // Data
  sort: { icon: '#818cf8', bg: '#1e1b4b' },
  export: { icon: '#2dd4bf', bg: '#134e4a' },
  archive: { icon: '#a8a29e', bg: '#292524' },
  // Notifications
  bell: { icon: '#fb923c', bg: '#431407' },
  clock: { icon: '#38bdf8', bg: '#1e3a5f' },
  premiumTime: { icon: '#fbbf24', bg: '#3d2e06' },
  // Account
  user: { icon: '#818cf8', bg: '#1e1b4b' },
  signOut: { icon: '#f87171', bg: '#450a0a' },
  deleteAccount: { icon: '#ef4444', bg: '#450a0a' },
  // Premium
  crown: { icon: '#fbbf24', bg: '#3d2e06' },
  zap: { icon: '#a78bfa', bg: '#2e1f5e' },
  manageSub: { icon: '#818cf8', bg: '#1e1b4b' },
  // App
  star: { icon: '#fbbf24', bg: '#3d2e06' },
  share: { icon: '#34d399', bg: '#052e2a' },
  feedback: { icon: '#a78bfa', bg: '#2e1f5e' },
  whatsNew: { icon: '#c084fc', bg: '#3b0764' },
  // Legal
  legal: { icon: '#a8a29e', bg: '#292524' },
  // About
  info: { icon: '#818cf8', bg: '#1e1b4b' },
};

/** Light mode settings colors - light backgrounds with colored icons */
export const lightSettingsColors: SettingsColors = {
  // Preferences
  checkbox: { icon: '#0284c7', bg: '#bae6fd' },
  circle: { icon: '#8b5cf6', bg: '#ddd6fe' },
  gradient: { icon: '#059669', bg: '#d1fae5' },
  sound: { icon: '#f59e0b', bg: '#fef3c7' },
  calendarHeader: { icon: '#0ea5e9', bg: '#dbeafe' },
  // Data
  sort: { icon: '#6366f1', bg: '#e0e7ff' },
  export: { icon: '#0d9488', bg: '#ccfbf1' },
  archive: { icon: '#78716c', bg: '#e7e5e4' },
  // Notifications
  bell: { icon: '#ea580c', bg: '#fed7aa' },
  clock: { icon: '#0284c7', bg: '#bae6fd' },
  premiumTime: { icon: '#ca8a04', bg: '#fef9c3' },
  // Account
  user: { icon: '#6366f1', bg: '#e0e7ff' },
  signOut: { icon: '#ef4444', bg: '#fecaca' },
  deleteAccount: { icon: '#dc2626', bg: '#fecaca' },
  // Premium
  crown: { icon: '#f59e0b', bg: '#fef3c7' },
  zap: { icon: '#8b5cf6', bg: '#ede9fe' },
  manageSub: { icon: '#6366f1', bg: '#e0e7ff' },
  // App
  star: { icon: '#f59e0b', bg: '#fef3c7' },
  share: { icon: '#10b981', bg: '#d1fae5' },
  feedback: { icon: '#8b5cf6', bg: '#ede9fe' },
  whatsNew: { icon: '#a855f7', bg: '#f3e8ff' },
  // Legal
  legal: { icon: '#78716c', bg: '#e7e5e4' },
  // About
  info: { icon: '#6366f1', bg: '#e0e7ff' },
};

/** Settings color type definition */
export interface SettingsColors {
  // Preferences
  checkbox: IconColor;
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
