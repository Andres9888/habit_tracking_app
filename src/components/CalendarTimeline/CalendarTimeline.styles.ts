import type {
  CalendarColors,
  CompletionStatus,
} from './CalendarTimeline.types';
import { shadows } from '../../theme/spacing';
import type { SemanticColors } from '../../theme/darkColors';

export const DEFAULT_COLORS: CalendarColors = {
  currentDayBackground: '#1c1917', // stone-900 for strong today indicator
  currentDayText: '#ffffff',
  dayBackground: '#ffffff',
  dayBorder: 'transparent',
  dayText: '#57534e', // stone-600 - slightly softer for past dates
  icon: '#78716c', // stone-500 - softer icons
  primaryText: '#1c1917', // stone-900
  secondaryText: '#a8a29e', // stone-400 - warmer
};

export const HIGH_CONTRAST_COLORS: CalendarColors = {
  currentDayBackground: '#facc15',
  currentDayText: '#000000',
  dayBackground: '#000000',
  dayBorder: '#facc15',
  dayText: '#ffffff',
  icon: '#facc15',
  primaryText: '#ffffff',
  secondaryText: '#facc15',
};

export const getColors = (highContrastMode: boolean, isDark = false): CalendarColors => {
  if (highContrastMode) return HIGH_CONTRAST_COLORS;
  if (isDark) {
    return {
      currentDayBackground: '#F9FAFB',
      currentDayText: '#111827',
      dayBackground: '#1F2937',
      dayBorder: '#374151',
      dayText: '#E5E7EB',
      icon: '#D1D5DB',
      primaryText: '#F9FAFB',
      secondaryText: '#9CA3AF',
    };
  }
  return DEFAULT_COLORS;
};

/** Theme-aware getColors using semantic tokens */
export function getThemedColors(highContrastMode: boolean, themeColors: SemanticColors, isDark: boolean): CalendarColors {
  if (highContrastMode) return HIGH_CONTRAST_COLORS;
  return {
    currentDayBackground: isDark ? themeColors.text.primary : '#1c1917',
    currentDayText: themeColors.text.inverse,
    dayBackground: themeColors.card,
    dayBorder: isDark ? themeColors.border : 'transparent',
    dayText: themeColors.text.secondary,
    icon: themeColors.gray[500],
    primaryText: themeColors.text.primary,
    secondaryText: themeColors.text.tertiary,
  };
}

/** Color values for completion status dots */
export const COMPLETION_DOT_COLORS: Record<CompletionStatus, string> = {
  complete: '#10b981', // emerald-500
  future: '#f5f5f4', // stone-100
  none: '#e7e5e4', // stone-200
  partial: '#f59e0b', // amber-500
};

/** Size values for completion status dots */
export const COMPLETION_DOT_SIZES: Record<CompletionStatus, number> = {
  complete: 8,
  future: 5,
  none: 5,
  partial: 6,
};

/** Today highlight colors */
export const TODAY_HIGHLIGHT = {
  background: '#fffbeb', // amber-50
  border: '#f59e0b', // amber-500
  text: '#b45309', // amber-700
};

/** Future date color */
export const FUTURE_DATE_TEXT_COLOR = '#d6d3d1'; // stone-300

/** Container shadow styling */
export const CONTAINER_SHADOW = {
  ...shadows.subtle,
  shadowColor: '#78716c',
  shadowOpacity: 0.04,
  shadowRadius: 8,
};

/** Today cell shadow styling */
export const TODAY_SHADOW = {
  elevation: 2,
  shadowColor: '#f59e0b',
  shadowOffset: { height: 2, width: 0 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
};

/** Glow effect for complete status dots */
export const COMPLETE_DOT_GLOW = {
  elevation: 2,
  shadowColor: '#10b981',
  shadowOffset: { height: 0, width: 0 },
  shadowOpacity: 0.5,
  shadowRadius: 4,
};
