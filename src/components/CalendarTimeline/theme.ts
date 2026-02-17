/**
 * CalendarTimeline Theme
 *
 * Centralized color configurations for calendar timeline variants.
 * Supports both standard and high-contrast modes.
 */

import { darkColors, lightColors } from '../../theme/darkColors';

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
  currentDayBackground: '#1a1a1a',
  currentDayText: lightColors.text.inverse,
  dayBackground: '#ffffff',
  dayBorder: 'transparent',
  dayText: '#1a1a1a',
  icon: '#1a1a1a',
  primaryText: '#1a1a1a',
  secondaryText: lightColors.gray[400],
};

/**
 * Dark mode color scheme — references darkColors tokens directly
 */
const DARK_COLORS: CalendarTimelineColors = {
  currentDayBackground: darkColors.text.primary,     // #F9FAFB
  currentDayText: darkColors.text.inverse,            // #111827
  dayBackground: darkColors.card,                     // #1F2937
  dayBorder: darkColors.border,                       // #374151
  dayText: darkColors.gray[700],                      // #E5E7EB
  icon: darkColors.gray[600],                         // #D1D5DB
  primaryText: darkColors.text.primary,               // #F9FAFB
  secondaryText: darkColors.text.secondary,           // #9CA3AF
};

/**
 * High contrast color scheme (accessibility)
 */
const HIGH_CONTRAST_COLORS: CalendarTimelineColors = {
  currentDayBackground: '#facc15',
  currentDayText: '#000000',
  dayBackground: '#000000',
  dayBorder: '#facc15',
  dayText: '#ffffff',
  icon: '#facc15',
  primaryText: '#ffffff',
  secondaryText: '#facc15',
};

/**
 * Get color theme based on mode settings
 *
 * @param highContrastMode - Whether high contrast mode is enabled
 * @param isDark - Whether dark mode is active
 * @returns Color theme object
 */
export function getCalendarTimelineColors(
  highContrastMode: boolean,
  isDark = false
): CalendarTimelineColors {
  if (highContrastMode) return HIGH_CONTRAST_COLORS;
  return isDark ? DARK_COLORS : STANDARD_COLORS;
}

/**
 * Export individual themes for direct access if needed
 */
export const CALENDAR_THEMES = {
  dark: DARK_COLORS,
  highContrast: HIGH_CONTRAST_COLORS,
  standard: STANDARD_COLORS,
} as const;
