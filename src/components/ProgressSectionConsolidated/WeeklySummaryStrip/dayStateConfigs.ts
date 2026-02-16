/**
 * WeeklySummaryStrip Day State Configs
 * Visual configurations for each day cell state
 */

import type { SemanticColors } from '../../../theme/darkColors';
import type {
  DayVisualState,
  DayStateConfig,
} from './WeeklySummaryStrip.types';

/**
 * Visual state configurations for each day state.
 * Accepts theme colors so border colors adapt to dark mode.
 */
export function getDayStateConfigs(
  colors: SemanticColors
): Record<DayVisualState, DayStateConfig> {
  return {
    complete: {
      backgroundColor: colors.primary[500],
      borderColor: colors.borders.successStrong,
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
      backgroundColor: colors.gray[50],
      borderColor: colors.borders.subtle,
      borderStyle: 'solid',
      borderWidth: 1,
      hasPulse: false,
      hasRing: false,
      icon: null,
      iconColor: colors.gray[400],
      ringColor: 'transparent',
      text: null,
      textColor: colors.gray[500],
    },
    missed: {
      backgroundColor: colors.gray[200],
      borderColor: colors.borders.muted,
      borderStyle: 'solid',
      borderWidth: 0,
      hasPulse: false,
      hasRing: false,
      icon: 'close',
      iconColor: colors.gray[400],
      ringColor: 'transparent',
      text: null,
      textColor: colors.gray[500],
    },
    todayComplete: {
      backgroundColor: colors.primary[500],
      borderColor: colors.borders.successStrong,
      borderStyle: 'solid',
      borderWidth: 0,
      hasPulse: false,
      hasRing: true,
      icon: 'checkmark',
      iconColor: '#ffffff',
      ringColor: colors.primary[300],
      text: null,
      textColor: '#ffffff',
    },
    todayIncomplete: {
      backgroundColor: '#fef3c7', // amber-100
      borderColor: colors.borders.warning,
      borderStyle: 'dashed',
      borderWidth: 2,
      hasPulse: true,
      hasRing: false,
      icon: null,
      iconColor: '#d97706', // amber-600
      ringColor: 'transparent',
      text: 'Today',
      textColor: '#d97706', // amber-600
    },
  };
}

/**
 * @deprecated Use getDayStateConfigs(colors) for dark mode support.
 * Kept for backward compatibility — uses light mode defaults.
 */
export const DAY_STATE_CONFIGS: Record<DayVisualState, DayStateConfig> = {
  complete: {
    backgroundColor: '#10b981',
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
    backgroundColor: '#f5f5f4',
    borderColor: '#e7e5e4',
    borderStyle: 'solid',
    borderWidth: 1,
    hasPulse: false,
    hasRing: false,
    icon: null,
    iconColor: '#a8a29e',
    ringColor: 'transparent',
    text: null,
    textColor: '#78716c',
  },
  missed: {
    backgroundColor: '#e7e5e4',
    borderColor: '#d6d3d1',
    borderStyle: 'solid',
    borderWidth: 0,
    hasPulse: false,
    hasRing: false,
    icon: 'close',
    iconColor: '#a8a29e',
    ringColor: 'transparent',
    text: null,
    textColor: '#78716c',
  },
  todayComplete: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
    borderStyle: 'solid',
    borderWidth: 0,
    hasPulse: false,
    hasRing: true,
    icon: 'checkmark',
    iconColor: '#ffffff',
    ringColor: '#6ee7b7',
    text: null,
    textColor: '#ffffff',
  },
  todayIncomplete: {
    backgroundColor: '#fef3c7',
    borderColor: '#fbbf24',
    borderStyle: 'dashed',
    borderWidth: 2,
    hasPulse: true,
    hasRing: false,
    icon: null,
    iconColor: '#d97706',
    ringColor: 'transparent',
    text: 'Today',
    textColor: '#d97706',
  },
};
