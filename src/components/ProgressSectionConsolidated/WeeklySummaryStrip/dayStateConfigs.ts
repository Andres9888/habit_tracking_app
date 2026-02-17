/**
 * WeeklySummaryStrip Day State Configs
 * Visual configurations for each day cell state.
 * Supports light and dark mode via getDayStateConfigs(isDark).
 */

import type {
  DayVisualState,
  DayStateConfig,
} from './WeeklySummaryStrip.types';

/**
 * Light mode visual state configurations
 */
const LIGHT_DAY_STATE_CONFIGS: Record<DayVisualState, DayStateConfig> = {
  complete: {
    backgroundColor: '#10b981', // emerald-500
    borderColor: '#10b981',
    borderStyle: 'solid',
    borderWidth: 0,
    hasPulse: false,
    hasRing: false,
    icon: 'checkmark',
    iconColor: '#ffffff',
    ringColor: 'transparent',
    text: null,
    textColor: '#ffffff',
  },
  future: {
    backgroundColor: '#f5f5f4', // stone-100
    borderColor: '#e7e5e4',     // stone-200
    borderStyle: 'solid',
    borderWidth: 1,
    hasPulse: false,
    hasRing: false,
    icon: null,
    iconColor: '#a8a29e',       // stone-400
    ringColor: 'transparent',
    text: null,
    textColor: '#78716c',       // stone-500
  },
  missed: {
    backgroundColor: '#e7e5e4', // stone-200
    borderColor: '#d6d3d1',     // stone-300
    borderStyle: 'solid',
    borderWidth: 0,
    hasPulse: false,
    hasRing: false,
    icon: 'close',
    iconColor: '#a8a29e',       // stone-400
    ringColor: 'transparent',
    text: null,
    textColor: '#78716c',       // stone-500
  },
  todayComplete: {
    backgroundColor: '#10b981', // emerald-500
    borderColor: '#10b981',
    borderStyle: 'solid',
    borderWidth: 0,
    hasPulse: false,
    hasRing: true,
    icon: 'checkmark',
    iconColor: '#ffffff',
    ringColor: '#6ee7b7',       // emerald-300
    text: null,
    textColor: '#ffffff',
  },
  todayIncomplete: {
    backgroundColor: '#fef3c7', // amber-100
    borderColor: '#fbbf24',     // amber-400
    borderStyle: 'dashed',
    borderWidth: 2,
    hasPulse: true,
    hasRing: false,
    icon: null,
    iconColor: '#d97706',       // amber-600
    ringColor: 'transparent',
    text: 'Today',
    textColor: '#d97706',       // amber-600
  },
};

/**
 * Dark mode visual state configurations
 */
const DARK_DAY_STATE_CONFIGS: Record<DayVisualState, DayStateConfig> = {
  complete: {
    backgroundColor: '#059669', // emerald-600 (slightly deeper for dark bg)
    borderColor: '#059669',
    borderStyle: 'solid',
    borderWidth: 0,
    hasPulse: false,
    hasRing: false,
    icon: 'checkmark',
    iconColor: '#ffffff',
    ringColor: 'transparent',
    text: null,
    textColor: '#ffffff',
  },
  future: {
    backgroundColor: '#374151', // gray-700 (darkColors.border)
    borderColor: '#4B5563',     // gray-600
    borderStyle: 'solid',
    borderWidth: 1,
    hasPulse: false,
    hasRing: false,
    icon: null,
    iconColor: '#6B7280',       // gray-500
    ringColor: 'transparent',
    text: null,
    textColor: '#9CA3AF',       // gray-400
  },
  missed: {
    backgroundColor: '#374151', // gray-700
    borderColor: '#4B5563',     // gray-600
    borderStyle: 'solid',
    borderWidth: 0,
    hasPulse: false,
    hasRing: false,
    icon: 'close',
    iconColor: '#6B7280',       // gray-500
    ringColor: 'transparent',
    text: null,
    textColor: '#9CA3AF',       // gray-400
  },
  todayComplete: {
    backgroundColor: '#059669', // emerald-600
    borderColor: '#059669',
    borderStyle: 'solid',
    borderWidth: 0,
    hasPulse: false,
    hasRing: true,
    icon: 'checkmark',
    iconColor: '#ffffff',
    ringColor: '#34D399',       // emerald-400 (brighter for dark)
    text: null,
    textColor: '#ffffff',
  },
  todayIncomplete: {
    backgroundColor: '#422006', // amber-950 (dark bg for amber)
    borderColor: '#f59e0b',     // amber-500
    borderStyle: 'dashed',
    borderWidth: 2,
    hasPulse: true,
    hasRing: false,
    icon: null,
    iconColor: '#fbbf24',       // amber-400 (lighter for dark bg)
    ringColor: 'transparent',
    text: 'Today',
    textColor: '#fbbf24',       // amber-400
  },
};

/**
 * Get day state configs based on current theme mode.
 * @param isDark - Whether dark mode is active
 */
export function getDayStateConfigs(isDark: boolean): Record<DayVisualState, DayStateConfig> {
  return isDark ? DARK_DAY_STATE_CONFIGS : LIGHT_DAY_STATE_CONFIGS;
}

/**
 * @deprecated Use getDayStateConfigs(isDark) instead.
 * Kept for backward compatibility — returns light mode configs.
 */
export const DAY_STATE_CONFIGS: Record<DayVisualState, DayStateConfig> =
  LIGHT_DAY_STATE_CONFIGS;
