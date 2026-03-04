/**
 * CalendarTimeline Styles and Colors
 *
 * Theme-aware style getters for light + dark mode support.
 * Static values for sizes, shadows, and layout that don't change with theme.
 */

import type {
  CalendarColors,
  CompletionStatus,
} from './CalendarTimeline.types';
import { colors } from '../../theme/colors';
import { darkColors } from '../../theme/darkColors';
import { borderRadius } from '../../theme/spacing';
import { getCalendarTimelineColors } from './theme';

export const DEFAULT_COLORS: CalendarColors = getCalendarTimelineColors(
  false,
  false
);
export const HIGH_CONTRAST_COLORS: CalendarColors = getCalendarTimelineColors(
  true,
  false
);

export const getColors = (
  highContrastMode: boolean,
  isDark = false
): CalendarColors => getCalendarTimelineColors(highContrastMode, isDark);

/** Completion dot sizes (theme-independent) */
export const COMPLETION_DOT_SIZES: Record<CompletionStatus, number> = {
  complete: 8,
  future: 5,
  none: 5,
  partial: 7,
};

/** Theme-aware completion dot colors */
export const getCompletionDotColors = (
  isDark: boolean
): Record<CompletionStatus, string> => ({
  complete: isDark ? darkColors.primary[500] : colors.primary[500],
  future: isDark ? darkColors.card : colors.light.card,
  none: isDark ? darkColors.gray[300] : colors.gray[200],
  partial: colors.streak[500],
});

/** Theme-aware today highlight (amber accent) */
export const getTodayHighlight = (isDark: boolean) =>
  isDark
    ? {
        background: 'rgba(232,185,77,0.12)',
        border: colors.streak[300],
        text: colors.streak[300],
      }
    : {
        background: colors.streak[100],
        border: colors.streak[300],
        text: colors.streak[700],
      };

/** Theme-aware future date text color */
export const getFutureDateTextColor = (isDark: boolean) =>
  isDark ? darkColors.gray[400] : colors.gray[300];

/** Today cell shadow (same for both themes) */
export const TODAY_SHADOW = {
  elevation: 2,
  shadowColor: colors.gray[800],
  shadowOffset: { height: 2, width: 0 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
};

/** Theme-aware completion dot glow */
export const getCompleteDotGlow = (isDark: boolean) => ({
  elevation: 2,
  shadowColor: isDark ? darkColors.primary[500] : colors.primary[500],
  shadowOffset: { height: 0, width: 0 },
  shadowOpacity: isDark ? 0.7 : 0.5,
  shadowRadius: 4,
});

/** Streak connector bar between consecutive completed days */
export const STREAK_CONNECTOR = {
  height: 3.5,
  topOffset: 14 + 2 + 22 - 1.5,
  light: 'rgba(16, 185, 129, 0.35)',
  dark: 'rgba(52, 211, 153, 0.30)',
  highContrast: 'rgba(250, 204, 21, 0.35)',
};

/** Shelf background color (shared with HabitsListHeader sticky fill) */
export const getShelfBackgroundColor = (isDark: boolean) =>
  isDark ? darkColors.card : colors.light.surfaceMuted;

/** Theme-aware shelf background */
export const getShelfStyle = (isDark: boolean) => ({
  backgroundColor: getShelfBackgroundColor(isDark),
  borderBottomLeftRadius: borderRadius.large,
  borderBottomRightRadius: borderRadius.large,
});

/** Theme-aware complete day cell styling */
export const getCompleteDayCell = (isDark: boolean) => ({
  background: isDark ? darkColors.primary[500] : colors.primary[600],
  text: isDark ? darkColors.text.inverse : colors.text.inverse,
  glow: {
    elevation: 4,
    shadowColor: isDark ? darkColors.primary[500] : colors.primary[600],
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: isDark ? 0.55 : 0.4,
    shadowRadius: isDark ? 14 : 10,
  },
});
