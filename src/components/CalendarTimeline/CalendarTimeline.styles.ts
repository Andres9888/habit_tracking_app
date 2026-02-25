/**
 * CalendarTimeline Styles and Colors
 *
 * Warm stone palette for visual consistency with the app's design system.
 * Supports light mode, dark mode, and high-contrast mode for accessibility.
 */

import type {
  CalendarColors,
  CompletionStatus,
} from './CalendarTimeline.types';
import { colors } from '../../theme/colors';
import { borderRadius } from '../../theme/spacing';

export const DEFAULT_COLORS: CalendarColors = {
  currentDayBackground: colors.gray[800],
  currentDayText: colors.text.inverse,
  dayBackground: colors.light.card,
  dayBorder: 'transparent',
  dayText: colors.gray[600],
  icon: colors.gray[500],
  primaryText: colors.gray[800],
  secondaryText: colors.gray[300],
};

export const HIGH_CONTRAST_COLORS: CalendarColors = {
  currentDayBackground: '#facc15',
  currentDayText: '#000000',
  dayBackground: '#000000',
  dayBorder: '#facc15',
  dayText: colors.text.inverse,
  icon: '#facc15',
  primaryText: colors.text.inverse,
  secondaryText: '#facc15',
};

export const getColors = (
  highContrastMode: boolean,
  isDark = false
): CalendarColors => {
  if (highContrastMode) return HIGH_CONTRAST_COLORS;
  if (isDark) {
    return {
      currentDayBackground: colors.dark.background,
      currentDayText: colors.gray[900],
      dayBackground: colors.dark.surface,
      dayBorder: colors.dark.card,
      dayText: '#E5E7EB',
      icon: '#D1D5DB',
      primaryText: colors.dark.background,
      secondaryText: '#9CA3AF',
    };
  }
  return DEFAULT_COLORS;
};

/** Color values for completion status dots */
export const COMPLETION_DOT_COLORS: Record<CompletionStatus, string> = {
  complete: colors.primary[500],
  future: colors.light.card,
  none: colors.gray[200],
  partial: colors.streak[300],
};

/** Size values for completion status dots */
export const COMPLETION_DOT_SIZES: Record<CompletionStatus, number> = {
  complete: 8,
  future: 5,
  none: 5,
  partial: 6,
};

/** Today highlight colors (amber accent for current-day identity) */
export const TODAY_HIGHLIGHT = {
  background: colors.streak[100],
  border: colors.streak[300],
  text: colors.streak[700],
};

/** Future date color */
export const FUTURE_DATE_TEXT_COLOR = colors.gray[300];

/** Today cell shadow styling */
export const TODAY_SHADOW = {
  elevation: 2,
  shadowColor: colors.gray[800],
  shadowOffset: { height: 2, width: 0 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
};

/** Glow effect for complete status dots */
export const COMPLETE_DOT_GLOW = {
  elevation: 2,
  shadowColor: colors.primary[500],
  shadowOffset: { height: 0, width: 0 },
  shadowOpacity: 0.5,
  shadowRadius: 4,
};

/** Streak connector bar between consecutive completed days */
export const STREAK_CONNECTOR = {
  height: 3,
  /** Circle center Y = weekday(14) + gap(2) + radius(20) = 36 */
  topOffset: 14 + 2 + 20 - 1.5,
  light: 'rgba(16, 185, 129, 0.25)',
  dark: 'rgba(52, 211, 153, 0.20)',
  highContrast: 'rgba(250, 204, 21, 0.35)',
};

/** Tinted shelf background — subtly darker than canvas for zone separation */
export const SHELF_STYLE = {
  backgroundColor: colors.light.gradientMid, // #F0EDE8
  borderBottomLeftRadius: borderRadius.large,
  borderBottomRightRadius: borderRadius.large,
};

/** Complete day cell styling (100% habits done) */
export const COMPLETE_DAY_CELL = {
  background: colors.primary[500],
  text: colors.text.inverse,
  glow: {
    elevation: 3,
    shadowColor: colors.primary[500],
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
};
