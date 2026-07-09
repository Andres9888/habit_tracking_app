/**
 * CalendarTimeline Theme
 *
 * Centralized color configurations for calendar timeline variants.
 */

import { colors, withAlpha } from '@/theme/colors';
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
 * Date-navigator pill colors for WeekNavRow.
 *
 * Rest keeps the warm green tint but the caret is green (not disabled-gray)
 * so the pill reads as a live control. Open floods to a solid primary fill
 * with inverse text — a category jump in form, not a shade tweak — so the
 * open and closed states can never read alike.
 */
export interface DatePillColors {
  background: string;
  border: string;
  chevron: string;
  date: string;
  icon: string;
  month: string;
}

const DATE_PILL_OPEN: Record<'dark' | 'light', DatePillColors> = {
  dark: {
    background: darkColors.primary[500],
    border: darkColors.primary[500],
    chevron: darkColors.text.inverse,
    date: withAlpha(darkColors.text.inverse, 0.78),
    icon: darkColors.text.inverse,
    month: darkColors.text.inverse,
  },
  light: {
    background: colors.primary[600],
    border: colors.primary[600],
    chevron: colors.text.inverse,
    date: withAlpha(colors.text.inverse, 0.78),
    icon: colors.text.inverse,
    month: colors.text.inverse,
  },
};

const DATE_PILL_CLOSED: Record<'dark' | 'light', DatePillColors> = {
  dark: {
    background: 'rgba(5,150,105,0.08)',
    border: 'rgba(5,150,105,0.20)',
    chevron: withAlpha(darkColors.primary[500], 0.7),
    date: darkColors.text.secondary,
    icon: darkColors.primary[500],
    month: darkColors.primary[500],
  },
  light: {
    background: 'rgba(5,150,105,0.06)',
    border: 'rgba(5,150,105,0.15)',
    chevron: withAlpha(colors.primary[600], 0.55),
    date: colors.text.secondary,
    icon: colors.primary[600],
    month: colors.primary[700],
  },
};

export const getDatePillColors = (
  isDark: boolean,
  isOpen = false
): DatePillColors =>
  (isOpen ? DATE_PILL_OPEN : DATE_PILL_CLOSED)[isDark ? 'dark' : 'light'];

/**
 * Export individual themes for direct access if needed
 */
export const CALENDAR_THEMES = {
  dark: DARK_COLORS,
  standard: STANDARD_COLORS,
} as const;
