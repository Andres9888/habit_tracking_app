/**
 * Settings Icon Colors
 *
 * Semantic color tokens for settings screen icons and backgrounds.
 * These colors are theme-aware and adapt to light/dark mode.
 *
 * Organized by settings section:
 * - Preferences: checkbox, circle, gradient, sound
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
  archive: { bg: '#292524', icon: '#a8a29e' },

  // Notifications
  bell: { bg: '#431407', icon: '#fb923c' },

  // Preferences
  checkbox: { bg: '#1e3a5f', icon: '#38bdf8' },

  circle: { bg: '#2e1f5e', icon: '#a78bfa' },

  clock: { bg: '#1e3a5f', icon: '#38bdf8' },

  // Premium
  crown: { bg: '#3d2e06', icon: '#fbbf24' },

  deleteAccount: { bg: '#450a0a', icon: '#ef4444' },

  gradient: { bg: '#052e2a', icon: '#34d399' },

  feedback: { bg: '#2e1f5e', icon: '#a78bfa' },

  manageSub: { bg: '#1e1b4b', icon: '#818cf8' },

  // Legal
  legal: { bg: '#292524', icon: '#a8a29e' },

  // Data
  sort: { bg: '#1e1b4b', icon: '#818cf8' },

  // About
  info: { bg: '#1e1b4b', icon: '#818cf8' },

  sound: { icon: '#fbbf24', bg: '#3d2e06' },

  premiumTime: { bg: '#3d2e06', icon: '#fbbf24' },

  share: { bg: '#052e2a', icon: '#34d399' },

  signOut: { bg: '#450a0a', icon: '#f87171' },

  // App
  star: { bg: '#3d2e06', icon: '#fbbf24' },

  // Account
  user: { bg: '#1e1b4b', icon: '#818cf8' },

  whatsNew: { bg: '#3b0764', icon: '#c084fc' },

  zap: { bg: '#2e1f5e', icon: '#a78bfa' },
};

/** Light mode settings colors - light backgrounds with colored icons */
export const lightSettingsColors: SettingsColors = {
  archive: { bg: '#e7e5e4', icon: '#78716c' },

  // Notifications
  bell: { bg: '#fed7aa', icon: '#ea580c' },

  // Preferences
  checkbox: { bg: '#bae6fd', icon: '#0284c7' },

  circle: { bg: '#ddd6fe', icon: '#8b5cf6' },

  clock: { bg: '#bae6fd', icon: '#0284c7' },

  // Premium
  crown: { bg: '#fef3c7', icon: '#f59e0b' },

  deleteAccount: { bg: '#fecaca', icon: '#dc2626' },

  gradient: { bg: '#d1fae5', icon: '#059669' },

  feedback: { bg: '#ede9fe', icon: '#8b5cf6' },

  manageSub: { bg: '#e0e7ff', icon: '#6366f1' },

  // Legal
  legal: { bg: '#e7e5e4', icon: '#78716c' },

  // Data
  sort: { bg: '#e0e7ff', icon: '#6366f1' },

  // About
  info: { bg: '#e0e7ff', icon: '#6366f1' },

  sound: { icon: '#f59e0b', bg: '#fef3c7' },

  premiumTime: { bg: '#fef9c3', icon: '#ca8a04' },

  share: { bg: '#d1fae5', icon: '#10b981' },

  signOut: { bg: '#fecaca', icon: '#ef4444' },

  // App
  star: { bg: '#fef3c7', icon: '#f59e0b' },

  // Account
  user: { bg: '#e0e7ff', icon: '#6366f1' },

  whatsNew: { bg: '#f3e8ff', icon: '#a855f7' },

  zap: { bg: '#ede9fe', icon: '#8b5cf6' },
};

/** Settings color type definition */
export interface SettingsColors {
  // Preferences
  checkbox: IconColor;
  circle: IconColor;
  gradient: IconColor;
  sound: IconColor;
  // Data
  sort: IconColor;
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
