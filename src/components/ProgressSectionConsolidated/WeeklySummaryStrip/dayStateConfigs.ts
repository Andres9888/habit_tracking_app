/**
 * WeeklySummaryStrip Day State Configs
 * Visual configurations for each day state (theme-aware)
 */

import type {
  DayVisualState,
  DayStateConfig,
} from './WeeklySummaryStrip.types';
import type { SemanticColors } from '../../../theme/darkColors';

/**
 * Create visual state configurations for each day state with theme colors
 */
export function createDayStateConfigs(tc: SemanticColors): Record<DayVisualState, DayStateConfig> {
  return {
    complete: {
      backgroundColor: tc.dayCompletedBg, // emerald-500
      borderColor: tc.dayCompletedBorder,
      borderStyle: 'solid' as const,
      borderWidth: 0,
      hasPulse: false,
      hasRing: false,
      icon: 'checkmark',
      iconColor: tc.text.inverse,
      ringColor: 'transparent',
      text: null,
      textColor: tc.text.inverse,
    },
    future: {
      backgroundColor: tc.dayFutureBg, // stone-100
      borderColor: tc.dayFutureBorder, // stone-200
      borderStyle: 'solid' as const,
      borderWidth: 1,
      hasPulse: false,
      hasRing: false,
      icon: null,
      iconColor: tc.text.tertiary, // stone-400
      ringColor: 'transparent',
      text: null,
      textColor: tc.text.secondary, // stone-500
    },
    missed: {
      backgroundColor: tc.dayMissedBg, // stone-200
      borderColor: tc.dayMissedBorder, // stone-300
      borderStyle: 'solid' as const,
      borderWidth: 0,
      hasPulse: false,
      hasRing: false,
      icon: 'close',
      iconColor: tc.text.tertiary, // stone-400
      ringColor: 'transparent',
      text: null,
      textColor: tc.text.secondary, // stone-500
    },
    todayComplete: {
      backgroundColor: tc.dayCompletedBg, // emerald-500
      borderColor: tc.dayCompletedBorder,
      borderStyle: 'solid' as const,
      borderWidth: 0,
      hasPulse: false,
      hasRing: true,
      icon: 'checkmark',
      iconColor: tc.text.inverse,
      ringColor: tc.primary[300], // emerald-300
      text: null,
      textColor: tc.text.inverse,
    },
    todayIncomplete: {
      backgroundColor: tc.dayPartialBg, // amber-100
      borderColor: tc.dayPartialBorder, // amber-400
      borderStyle: 'dashed' as const,
      borderWidth: 2,
      hasPulse: true,
      hasRing: false,
      icon: null,
      iconColor: tc.warning, // amber-600
      ringColor: 'transparent',
      text: 'Today',
      textColor: tc.warning, // amber-600
    },
  };
}

/** @deprecated Light mode defaults - use createDayStateConfigs(themeColors) */
export const DAY_STATE_CONFIGS = createDayStateConfigs({
  dayCompletedBg: '#10b981',
  dayCompletedBorder: '#10b981',
  dayFutureBg: '#f5f5f4',
  dayFutureBorder: '#e7e5e4',
  dayMissedBg: '#e7e5e4',
  dayMissedBorder: '#d6d3d1',
  dayPartialBg: '#fef3c7',
  dayPartialBorder: '#fbbf24',
  text: {
    inverse: '#ffffff',
    secondary: '#78716c',
    tertiary: '#a8a29e',
    primary: '#1c1917',
  } as any,
  primary: { 300: '#6ee7b7' },
  warning: '#d97706',
} as any);
