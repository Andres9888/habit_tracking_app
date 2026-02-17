import type {
  CalendarColors,
  CompletionStatus,
} from './CalendarTimeline.types';
import { shadows } from '../../theme/spacing';
import { darkColors, lightColors } from '../../theme/darkColors';
import { colors } from '../../theme/colors';

export const DEFAULT_COLORS: CalendarColors = {
  currentDayBackground: '#1c1917', // stone-900 for strong today indicator
  currentDayText: lightColors.text.inverse,
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
      currentDayBackground: darkColors.text.primary,    // #F9FAFB
      currentDayText: darkColors.text.inverse,          // #111827
      dayBackground: darkColors.card,                   // #1F2937
      dayBorder: darkColors.border,                     // #374151
      dayText: darkColors.gray[700],                    // #E5E7EB
      icon: darkColors.gray[600],                       // #D1D5DB
      primaryText: darkColors.text.primary,             // #F9FAFB
      secondaryText: darkColors.text.secondary,         // #9CA3AF
    };
  }
  return DEFAULT_COLORS;
};

/** Color values for completion status dots */
export const COMPLETION_DOT_COLORS: Record<CompletionStatus, string> = {
  complete: colors.primary[500],  // #10b981 emerald-500
  future: '#f5f5f4',              // stone-100
  none: '#e7e5e4',                // stone-200
  partial: '#f59e0b',             // amber-500
};

/** Dark mode completion status dot colors */
export const COMPLETION_DOT_COLORS_DARK: Record<CompletionStatus, string> = {
  complete: darkColors.primary[500],   // #34D399 brighter emerald for dark bg
  future: darkColors.gray[200],        // #374151
  none: darkColors.gray[300],          // #4B5563
  partial: '#f59e0b',                  // amber-500 (unchanged)
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
  border: '#f59e0b',     // amber-500
  text: '#b45309',       // amber-700
};

/** Dark mode today highlight colors */
export const TODAY_HIGHLIGHT_DARK = {
  background: '#422006', // amber-950 for dark bg
  border: '#f59e0b',     // amber-500 (unchanged)
  text: '#fbbf24',       // amber-400 (lighter for dark bg)
};

/** Future date color */
export const FUTURE_DATE_TEXT_COLOR = '#d6d3d1'; // stone-300

/** Future date color — dark mode */
export const FUTURE_DATE_TEXT_COLOR_DARK = darkColors.gray[300]; // #4B5563

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
  shadowColor: colors.primary[500], // #10b981
  shadowOffset: { height: 0, width: 0 },
  shadowOpacity: 0.5,
  shadowRadius: 4,
};
