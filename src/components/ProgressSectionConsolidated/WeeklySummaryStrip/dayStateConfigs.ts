/**
 * WeeklySummaryStrip Day State Configs
 * Visual configurations for each day cell state
 */

import { Check, X } from 'lucide-react-native';

import { colors as themeTokens } from '@/theme/colors';
import type {
  DayVisualState,
  DayStateConfig,
} from './WeeklySummaryStrip.types';

/**
 * Build visual state configurations for each day state.
 * Accepts optional status colors for theme-aware rendering.
 */
export function getDayStateConfigs(statusColors?: {
  success: string;
  successText: string;
}): Record<DayVisualState, DayStateConfig> {
  // Default matches lightColors.status.success (#059669); callers normally
  // pass theme-aware statusColors from useThemeColors().
  const success = statusColors?.success ?? '#059669';
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
      iconColor: themeTokens.text.inverse,
      ringColor: 'transparent',
      text: null,
      textColor: themeTokens.text.inverse,
    },
    future: {
      backgroundColor: themeTokens.gray[100], // #F5F1ED warm background
      borderColor: themeTokens.gray[200], // #DDD8D2 warm border
      borderStyle: 'solid',
      borderWidth: 1,
      hasPulse: false,
      hasRing: false,
      icon: null,
      iconColor: themeTokens.gray[300], // #C4BFB7 warm neutral
      ringColor: 'transparent',
      text: null,
      textColor: themeTokens.gray[500], // #6B6560 secondary text
    },
    missed: {
      backgroundColor: themeTokens.light.card, // #EDEAE5 warm surface
      borderColor: themeTokens.gray[200], // #DDD8D2 warm border
      borderStyle: 'solid',
      borderWidth: 0,
      hasPulse: false,
      hasRing: false,
      icon: X,
      iconColor: themeTokens.gray[300], // #C4BFB7 warm neutral
      ringColor: 'transparent',
      text: null,
      textColor: themeTokens.gray[500], // #6B6560 secondary text
    },
    todayComplete: {
      backgroundColor: success,
      borderColor: success,
      borderStyle: 'solid',
      borderWidth: 0,
      hasPulse: false,
      hasRing: true,
      icon: Check,
      iconColor: themeTokens.text.inverse,
      ringColor: successText,
      text: null,
      textColor: themeTokens.text.inverse,
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
