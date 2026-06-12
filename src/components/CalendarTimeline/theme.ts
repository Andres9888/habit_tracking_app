/**
 * CalendarTimeline Theme
 *
 * Centralized color configurations for calendar timeline variants.
 */

import { colors } from '@/theme/colors';
import { darkColors, lightColors } from '@/theme/darkColors';

/**
 * Color theme for calendar timeline
 */
export interface CalendarTimelineColors {
  /** Background color for current/today indicator */
  currentDayBackground: string;
  /** Text color for current day */
  currentDayText: string;
  /** Background color for regular days */
  dayBackground: string;
  /** Border color for day cells */
  dayBorder: string;
  /** Text color for regular days */
  dayText: string;
  /** Icon/chevron color */
  icon: string;
  /** Primary text color (date range) */
  primaryText: string;
  /** Secondary text color (labels, hints) */
  secondaryText: string;
}

/**
 * Standard color scheme (default light)
 */
const STANDARD_COLORS: CalendarTimelineColors = {
  currentDayBackground: colors.gray[800],
  currentDayText: colors.text.inverse,
  dayBackground: lightColors.card,
  dayBorder: 'transparent',
  dayText: colors.gray[600],
  icon: colors.gray[500],
  primaryText: colors.gray[800],
  secondaryText: colors.gray[400],
};

/**
 * Dark mode color scheme
 */
const DARK_COLORS: CalendarTimelineColors = {
  currentDayBackground: darkColors.background,
  currentDayText: darkColors.gray[900],
  dayBackground: darkColors.surface,
  dayBorder: darkColors.border,
  dayText: darkColors.gray[700],
  icon: darkColors.gray[600],
  primaryText: darkColors.background,
  secondaryText: darkColors.gray[500],
};

/**
 * Get color theme based on mode settings
 *
 * @param isDark - Whether dark mode is active
 * @returns Color theme object
 */
export function getCalendarTimelineColors(
  isDark = false
): CalendarTimelineColors {
  return isDark ? DARK_COLORS : STANDARD_COLORS;
}

/**
 * Date pill colors for WeekNavRow (derived from primary[600] with opacity)
 */
export const getDatePillColors = (isDark: boolean) => ({
  backgroundColor: isDark ? 'rgba(5,150,105,0.08)' : 'rgba(5,150,105,0.06)',
  borderColor: isDark ? 'rgba(5,150,105,0.20)' : 'rgba(5,150,105,0.15)',
});

/**
 * Export individual themes for direct access if needed
 */
export const CALENDAR_THEMES = {
  dark: DARK_COLORS,
  standard: STANDARD_COLORS,
} as const;
