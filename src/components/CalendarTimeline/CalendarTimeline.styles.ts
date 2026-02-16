import type {
  CalendarColors,
  CompletionStatus,
} from './CalendarTimeline.types';
import { shadows } from '../../theme/spacing';

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

/** Color values for completion status dots */
export const COMPLETION_DOT_COLORS: Record<CompletionStatus, string> = {
  complete: '#10b981', // emerald-500
  future: '#f5f5f4', // stone-100
  none: '#e7e5e4', // stone-200
  partial: '#f59e0b', // amber-500
};

/** Dark mode color values for completion status dots */
export const COMPLETION_DOT_COLORS_DARK: Record<CompletionStatus, string> = {
  complete: '#34d399', // emerald-400
  future: '#374151', // gray-700
  none: '#4B5563', // gray-600
  partial: '#fbbf24', // amber-400
};

/** Size values for completion status dots */
export const COMPLETION_DOT_SIZES: Record<CompletionStatus, number> = {
  complete: 8,
  future: 5,
  none: 5,
  partial: 6,
};

/** Today highlight colors (light mode) */
export const TODAY_HIGHLIGHT = {
  background: '#fffbeb', // amber-50
  border: '#f59e0b', // amber-500
  text: '#b45309', // amber-700
};

/** Today highlight colors (dark mode) */
export const TODAY_HIGHLIGHT_DARK = {
  background: '#78350f', // amber-900
  border: '#f59e0b', // amber-500
  text: '#fef3c7', // amber-100
};

/** Future date color */
export const FUTURE_DATE_TEXT_COLOR = '#d6d3d1'; // stone-300

/** Future date color (dark mode) */
export const FUTURE_DATE_TEXT_COLOR_DARK = '#4B5563'; // gray-600

/** Chain connector color for streaks */
export const CHAIN_CONNECTOR_COLOR = '#10b981'; // emerald-500
export const CHAIN_CONNECTOR_COLOR_DARK = '#34d399'; // emerald-400

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
