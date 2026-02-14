import type {
  CalendarColors,
  CompletionStatus,
} from './CalendarTimeline.types';
import { shadows } from '../../theme/spacing';
import type { SemanticColors } from '../../theme/darkColors';

/**
 * Build CalendarTimeline colors from semantic theme tokens.
 * Falls back to hardcoded values only for high-contrast mode.
 */
export function getThemeAwareColors(
  themeColors: SemanticColors,
  isDark: boolean,
  highContrastMode: boolean
): CalendarColors {
  if (highContrastMode) return HIGH_CONTRAST_COLORS;

  return {
    currentDayBackground: isDark ? '#fbbf24' : '#1c1917', // amber-400 (dark) / stone-900 (light)
    currentDayText: isDark ? '#1c1917' : '#ffffff',
    dayBackground: isDark ? themeColors.gray[100] : '#ffffff',
    dayBorder: 'transparent',
    dayText: themeColors.text.secondary,
    icon: themeColors.text.tertiary,
    primaryText: themeColors.text.primary,
    secondaryText: themeColors.text.tertiary,
  };
}

/** Get today highlight colors based on theme */
export function getTodayHighlight(isDark: boolean) {
  return isDark
    ? {
        background: '#78350f', // amber-900
        border: '#f59e0b',     // amber-500
        text: '#fbbf24',       // amber-400
      }
    : {
        background: '#fffbeb', // amber-50
        border: '#f59e0b',     // amber-500
        text: '#b45309',       // amber-700
      };
}

/** Get container styles based on theme */
export function getContainerStyle(themeColors: SemanticColors, isDark: boolean, highContrastMode: boolean) {
  return {
    backgroundColor: highContrastMode
      ? 'transparent'
      : isDark
        ? themeColors.card
        : '#ffffff',
    borderColor: highContrastMode
      ? 'transparent'
      : themeColors.cardBorder,
    borderWidth: highContrastMode ? 0 : 1,
    ...CONTAINER_SHADOW,
    ...(isDark && { shadowOpacity: 0 }), // no shadow in dark mode
  };
}

/** Get completion dot colors based on theme */
export function getCompletionDotColors(isDark: boolean): Record<CompletionStatus, string> {
  return isDark
    ? {
        complete: '#34d399', // emerald-400 — brighter on dark
        future: '#374151',   // gray-700
        none: '#4B5563',     // gray-600
        partial: '#fbbf24',  // amber-400
      }
    : {
        complete: '#10b981', // emerald-500
        future: '#f5f5f4',   // stone-100
        none: '#e7e5e4',     // stone-200
        partial: '#f59e0b',  // amber-500
      };
}

/** Get today shadow based on theme */
export function getTodayShadow(isDark: boolean) {
  return isDark
    ? {
        elevation: 2,
        shadowColor: '#fbbf24',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      }
    : {
        elevation: 2,
        shadowColor: '#f59e0b',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      };
}

/** Get complete dot glow based on theme */
export function getCompleteDotGlow(isDark: boolean) {
  return {
    elevation: 2,
    shadowColor: isDark ? '#34d399' : '#10b981',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: isDark ? 0.6 : 0.5,
    shadowRadius: 4,
  };
}

// ── Legacy exports (kept for compatibility) ──

export const HIGH_CONTRAST_COLORS: CalendarColors = {
  currentDayBackground: '#facc15',
  currentDayText: '#000000',
  dayBackground: '#000000',
  dayBorder: '#facc15',
  dayText: '#ffffff',
  icon: '#facc15',
  primaryText: '#ffffff',
  secondaryText: '#facc15',
};

export const DEFAULT_COLORS: CalendarColors = {
  currentDayBackground: '#1c1917',
  currentDayText: '#ffffff',
  dayBackground: '#ffffff',
  dayBorder: 'transparent',
  dayText: '#57534e',
  icon: '#78716c',
  primaryText: '#1c1917',
  secondaryText: '#a8a29e',
};

export const getColors = (highContrastMode: boolean): CalendarColors => {
  return highContrastMode ? HIGH_CONTRAST_COLORS : DEFAULT_COLORS;
};

export const COMPLETION_DOT_COLORS: Record<CompletionStatus, string> = {
  complete: '#10b981',
  future: '#f5f5f4',
  none: '#e7e5e4',
  partial: '#f59e0b',
};

export const COMPLETION_DOT_SIZES: Record<CompletionStatus, number> = {
  complete: 8,
  future: 5,
  none: 5,
  partial: 6,
};

export const TODAY_HIGHLIGHT = {
  background: '#fffbeb',
  border: '#f59e0b',
  text: '#b45309',
};

export const FUTURE_DATE_TEXT_COLOR = '#d6d3d1';

export const CONTAINER_SHADOW = {
  ...shadows.subtle,
  shadowColor: '#78716c',
  shadowOpacity: 0.04,
  shadowRadius: 8,
};

export const TODAY_SHADOW = {
  elevation: 2,
  shadowColor: '#f59e0b',
  shadowOffset: { height: 2, width: 0 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
};

export const COMPLETE_DOT_GLOW = {
  elevation: 2,
  shadowColor: '#10b981',
  shadowOffset: { height: 0, width: 0 },
  shadowOpacity: 0.5,
  shadowRadius: 4,
};
