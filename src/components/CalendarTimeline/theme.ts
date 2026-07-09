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
 * Date pill colors for WeekNavRow — quiet-emphasis toggle styling.
 *
 * Closed (rest) is neutral: warm grays only, no green. Open earns the
 * green — card fill, primary border, green glyphs — so the two states
 * can never read alike. Icon stays at the secondary-text gray tier
 * (not gray[300]) so the rest state doesn't read as disabled.
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
    background: darkColors.card,
    border: darkColors.primary[500],
    chevron: darkColors.primary[500],
    date: darkColors.text.primary,
    icon: darkColors.primary[500],
    month: darkColors.primary[500],
  },
  light: {
    background: colors.light.cardElevated,
    border: colors.primary[600],
    chevron: colors.primary[600],
    date: colors.gray[800],
    icon: colors.primary[600],
    month: colors.primary[700],
  },
};

const DATE_PILL_CLOSED: Record<'dark' | 'light', DatePillColors> = {
  dark: {
    background: 'transparent',
    border: darkColors.border,
    chevron: darkColors.gray[500],
    date: darkColors.gray[500],
    icon: darkColors.gray[500],
    month: darkColors.gray[600],
  },
  light: {
    background: 'transparent',
    border: colors.gray[200],
    chevron: colors.gray[300],
    date: colors.gray[500],
    icon: colors.gray[500],
    month: colors.gray[600],
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
