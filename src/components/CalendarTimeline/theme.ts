/**
 * CalendarTimeline Theme
 *
 * Centralized color configurations for calendar timeline variants.
 * Supports both standard and high-contrast modes.
 */

import { DARK_SURFACE_COLOR } from '@/constants/colors';

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
  currentDayText: '#ffffff',
  dayBackground: '#ffffff',
  dayBorder: 'transparent',
  dayText: '#1a1a1a',
  icon: '#1a1a1a',
  primaryText: '#1a1a1a',
  secondaryText: '#6B7280',
};

/**
 * Dark mode color scheme
 */
const DARK_COLORS: CalendarTimelineColors = {
  currentDayBackground: '#F9FAFB',
  currentDayText: '#111827',
  dayBackground: '#1F2937',
  dayBorder: '#374151',
  dayText: '#E5E7EB',
  icon: '#D1D5DB',
  primaryText: '#F9FAFB',
  secondaryText: '#9CA3AF',
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
