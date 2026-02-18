/**
 * Settings Icon Colors
 *
 * Semantic color tokens for settings screen icons and backgrounds.
 * These colors are theme-aware and adapt to light/dark mode.
 */

/** Dark mode settings colors - darker backgrounds with light icons */
export const darkSettingsColors = {
  checkbox: { icon: '#38bdf8', bg: '#1e3a5f' },
  circle: { icon: '#a78bfa', bg: '#2e1f5e' },
  gradient: { icon: '#34d399', bg: '#052e2a' },
  sound: { icon: '#fbbf24', bg: '#3d2e06' },
  sort: { icon: '#818cf8', bg: '#1e1b4b' },
  archive: { icon: '#a8a29e', bg: '#292524' },
} as const;

/** Light mode settings colors - light backgrounds with colored icons */
export const lightSettingsColors = {
  checkbox: { icon: '#0284c7', bg: '#bae6fd' },
  circle: { icon: '#8b5cf6', bg: '#ddd6fe' },
  gradient: { icon: '#059669', bg: '#d1fae5' },
  sound: { icon: '#f59e0b', bg: '#fef3c7' },
  sort: { icon: '#6366f1', bg: '#e0e7ff' },
  archive: { icon: '#78716c', bg: '#e7e5e4' },
} as const;

/** Settings color type definition */
export interface SettingsColors {
  checkbox: { icon: string; bg: string };
  circle: { icon: string; bg: string };
  gradient: { icon: string; bg: string };
  sound: { icon: string; bg: string };
  sort: { icon: string; bg: string };
  archive: { icon: string; bg: string };
}
