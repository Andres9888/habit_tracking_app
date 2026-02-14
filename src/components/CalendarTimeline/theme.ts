/**
 * CalendarTimeline Theme
 *
 * Centralized color configurations for calendar timeline variants.
 * Supports standard, dark, and high-contrast modes.
 */

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
 * Standard color scheme (light mode)
 */
const STANDARD_COLORS: CalendarTimelineColors = {
  currentDayBackground: '#1c1917',
  currentDayText: '#ffffff',
  dayBackground: '#ffffff',
  dayBorder: 'transparent',
  dayText: '#57534e',
  icon: '#78716c',
  primaryText: '#1c1917',
  secondaryText: '#a8a29e',
};

/**
 * Dark mode color scheme
 */
const DARK_COLORS: CalendarTimelineColors = {
  currentDayBackground: '#fbbf24', // amber-400
  currentDayText: '#1c1917',
  dayBackground: '#1F2937', // gray-800
  dayBorder: 'transparent',
  dayText: '#9CA3AF', // gray-400
  icon: '#6B7280', // gray-500
  primaryText: '#F9FAFB', // gray-50
  secondaryText: '#6B7280', // gray-500
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
