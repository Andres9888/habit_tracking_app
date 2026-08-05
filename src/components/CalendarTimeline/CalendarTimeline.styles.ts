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
import { shadows } from '../../theme/spacing';

import { getCalendarTimelineColors } from './theme';

export const DEFAULT_COLORS: CalendarColors = getCalendarTimelineColors(false);

export const getColors = (isDark = false): CalendarColors =>
  getCalendarTimelineColors(isDark);

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

/** Today cell shadow — based on shadows.subtle with slightly higher opacity */
export const TODAY_SHADOW = {
  ...shadows.subtle,
  shadowOpacity: 0.08,
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
/* Intentional rgba — base colors at full opacity; strength config controls opacity */
export const STREAK_CONNECTOR = {
  topOffset: 14 + 2 + 22 - 2,
  light: 'rgb(16, 185, 129)',
  dark: 'rgb(52, 211, 153)',
  ghostLight: 'rgba(16, 185, 129, 0.15)',
  ghostDark: 'rgba(52, 211, 153, 0.12)',
  glowLight: 'rgba(16, 185, 129, 0.45)',
  glowDark: 'rgba(52, 211, 153, 0.40)',
};

/** Shelf background color (shared with HabitsListHeader sticky fill) */
export const getShelfBackgroundColor = (isDark: boolean) =>
  isDark ? darkColors.card : colors.light.surfaceMuted;

/** Theme-aware shelf background — full-width bar, no rounded corners */
export const getShelfStyle = (isDark: boolean) => ({
  backgroundColor: getShelfBackgroundColor(isDark),
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
