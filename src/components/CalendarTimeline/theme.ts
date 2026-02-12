/**
 * CalendarTimeline Theme
 *
 * Centralized color configurations for calendar timeline variants.
 * Supports both standard and high-contrast modes.
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
 * Standard color scheme (default)
 */
const STANDARD_COLORS: CalendarTimelineColors = {
  currentDayBackground: '#1a1a1a',
  currentDayText: '#ffffff',
  dayBackground: '#ffffff',
  dayBorder: 'transparent',
  dayText: '#1a1a1a',
  icon: '#1a1a1a',
  primaryText: '#1a1a1a',
  secondaryText: '#6B7280',
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
 * Get color theme based on high contrast mode setting
 *
 * @param highContrastMode - Whether high contrast mode is enabled
 * @returns Color theme object
 *
 * @example
 * const colors = getCalendarTimelineColors(settings.highContrastMode);
 * <Text style={{ color: colors.primaryText }}>Date Range</Text>
 */
export function getCalendarTimelineColors(
  highContrastMode: boolean
): CalendarTimelineColors {
  return highContrastMode ? HIGH_CONTRAST_COLORS : STANDARD_COLORS;
}

/**
 * Export individual themes for direct access if needed
 */
export const CALENDAR_THEMES = {
  highContrast: HIGH_CONTRAST_COLORS,
  standard: STANDARD_COLORS,
} as const;
