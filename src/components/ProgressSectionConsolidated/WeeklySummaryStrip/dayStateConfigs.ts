/**
 * WeeklySummaryStrip Day State Configs
 * Visual configurations for each day cell state
 */

import { Check, X } from 'lucide-react-native';

import type {
  DayVisualState,
  DayStateConfig,
} from './WeeklySummaryStrip.types';

/**
 * Build visual state configurations for each day state.
 * Accepts optional status colors for theme-aware rendering.
 */
export function getDayStateConfigs(
  statusColors?: { success: string; successText: string }
): Record<DayVisualState, DayStateConfig> {
  const success = statusColors?.success ?? '#10b981';
  const successText = statusColors?.successText ?? '#6ee7b7';

  return {
    complete: {
      backgroundColor: success,
      borderColor: success,
      borderStyle: 'solid',
      borderWidth: 0,
      hasPulse: false,
      hasRing: false,
      icon: Check,
      iconColor: '#ffffff',
      ringColor: 'transparent',
      text: null,
      textColor: '#ffffff',
    },
    future: {
      backgroundColor: '#f5f5f4', // stone-100
      borderColor: '#e7e5e4', // stone-200
      borderStyle: 'solid',
      borderWidth: 1,
      hasPulse: false,
      hasRing: false,
      icon: null,
      iconColor: '#a8a29e', // stone-400
      ringColor: 'transparent',
      text: null,
      textColor: '#78716c', // stone-500
    },
    missed: {
      backgroundColor: '#e7e5e4', // stone-200
      borderColor: '#d6d3d1', // stone-300
      borderStyle: 'solid',
      borderWidth: 0,
      hasPulse: false,
      hasRing: false,
      icon: X,
      iconColor: '#a8a29e', // stone-400
      ringColor: 'transparent',
      text: null,
      textColor: '#78716c', // stone-500
    },
    todayComplete: {
      backgroundColor: success,
      borderColor: success,
      borderStyle: 'solid',
      borderWidth: 0,
      hasPulse: false,
      hasRing: true,
      icon: Check,
      iconColor: '#ffffff',
      ringColor: successText,
      text: null,
      textColor: '#ffffff',
    },
    todayIncomplete: {
      backgroundColor: '#fef3c7', // amber-100
      borderColor: '#fbbf24', // amber-400
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
