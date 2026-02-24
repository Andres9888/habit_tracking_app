/**
 * CalendarTimeline Styles and Colors
 *
 * Centralized color and style definitions for the CalendarTimeline component.
 * Supports light mode, dark mode, and high-contrast mode for accessibility.
 *
 * All colors reference the design-system tokens in @/theme/colors/core.ts
 * to maintain a single source of truth.
 */

import type {
  CalendarColors,
  CompletionStatus,
} from './CalendarTimeline.types';
import { colors } from '../../theme/colors';
import { shadows } from '../../theme/spacing';

export const DEFAULT_COLORS: CalendarColors = {
  currentDayBackground: colors.gray[900],
  currentDayText: colors.text.inverse,
  dayBackground: colors.gray[50],
  dayBorder: 'transparent',
  dayText: colors.gray[600],
  icon: colors.gray[500],
  primaryText: colors.gray[900],
  secondaryText: colors.gray[400],
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
  future: colors.gray[50],
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

/** Today highlight colors */
export const TODAY_HIGHLIGHT = {
  background: colors.warningLight,
  border: colors.streak[300],
  text: colors.streak[700],
};

/** Future date color */
export const FUTURE_DATE_TEXT_COLOR = colors.gray[300];

/** Container shadow styling
 * Intentionally overrides shadowColor (gray[500] for neutral container chrome)
 * and shadowRadius (8 for a softer spread) from the subtle token.
 */
export const CONTAINER_SHADOW = {
  ...shadows.subtle,
  shadowColor: colors.gray[500],
  shadowRadius: 8,
};

/** Today cell shadow styling */
export const TODAY_SHADOW = {
  elevation: 2,
  shadowColor: colors.streak[300],
  shadowOffset: { height: 2, width: 0 },
  shadowOpacity: 0.2,
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
