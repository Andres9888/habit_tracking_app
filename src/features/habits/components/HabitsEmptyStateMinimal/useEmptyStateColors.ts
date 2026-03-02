/**
 * useEmptyStateColors - Theme-aware colors for the empty state
 *
 * Provides WCAG AA compliant colors for both light and dark modes
 */

import { useThemeColors } from '../../../../theme/ThemeContext';
import { colors as appColors } from '../../../../theme/colors';

export function useEmptyStateColors() {
  const { colors, isDark } = useThemeColors();
  const warningColor = appColors.warning;
  const errorColor = appColors.error;
  const badgeDarkTextColor = colors.text.primary;
  const badgeLightTextColor = colors.text.inverse;

  return {
    // Background colors
    background: colors.background,
    surface: colors.surface,

    // Text colors (WCAG AA compliant)
    textPrimary: colors.text.primary, // High contrast
    textSecondary: colors.text.secondary, // Medium contrast
    textTertiary: colors.text.tertiary, // Lower contrast

    // Hero icon colors
    heroIconBackground: colors.primary[100], // emerald-100
    heroIconOverlay: isDark ? colors.primary[300] : appColors.primary[100], // green-50
    heroIconShadow: colors.primary[500],

    // Input colors
    inputBackground: colors.surface,
    inputBorder: colors.border,
    inputBorderFocused: isDark ? colors.primary[400] : appColors.secondary[500], // blue-500
    inputPlaceholder: isDark ? colors.gray[500] : colors.text.tertiary, // stone-400 equivalent
    inputText: colors.text.primary,
    inputCaret: colors.primary[400],

    // Character counter colors
    counterNormal: colors.text.tertiary,
    counterWarning: warningColor,
    counterError: isDark ? toRgba(errorColor, 0.8) : errorColor, // red-400 / red-500

    // Chip colors
    chipBackground: colors.card,
    chipBackgroundSelected: isDark ? colors.primary[300] : colors.primary[700], // emerald-700
    chipBorder: colors.border,
    chipBorderSelected: isDark ? colors.primary[300] : colors.primary[700],
    chipText: colors.text.primary,
    chipTextSelected: colors.text.inverse,
    chipShadow: isDark ? colors.gray[900] : colors.text.primary,

    // Button colors
    ctaBackground: isDark ? colors.primary[500] : colors.primary[700],
    ctaShadow: colors.primary[700],
    ctaText: colors.text.inverse,
    ctaDisabled: isDark ? colors.gray[300] : colors.text.tertiary,
    ctaShimmer:
      isDark ? toRgba(badgeDarkTextColor, 0.22) : toRgba(badgeLightTextColor, 0.3),

    // Secondary link colors
    linkBackground: isDark
      ? toRgba(colors.primary[300], 0.15)
      : toRgba(appColors.primary[100], 0.5),
    linkBackgroundPressed: colors.primary[100],
    linkBorder: isDark
      ? toRgba(colors.primary[400], 0.3)
      : toRgba(colors.primary[300], 0.8),
    linkText: isDark ? colors.primary[500] : colors.primary[700], // emerald-700

    // Error colors
    errorBackground: isDark ? toRgba(errorColor, 0.1) : appColors.errorLight,
    errorBorder: isDark ? toRgba(errorColor, 0.3) : toRgba(appColors.error, 0.3),
    errorText: isDark ? toRgba(errorColor, 0.8) : errorColor,
    errorIcon: isDark ? toRgba(errorColor, 0.95) : errorColor,

    // Gradient colors for templates button
    gradientColors: isDark
      ? ([
          toRgba(colors.primary[700], 0.85),
          toRgba(colors.primary[600], 0.85),
          toRgba(colors.primary[500], 0.85),
        ] as const)
      : ([colors.primary[700], colors.primary[600], colors.primary[500]] as const),

    // Accent stripe color (emerald-400 in dark for visibility, emerald-300 in light)
    accentStripeColor: isDark ? colors.primary[400] : colors.primary[300],

    // Build my own card background (elevated surface in dark, white in light)
    buildMyOwnCardBg: isDark ? colors.surface : appColors.surface,
    buildMyOwnCardBgPressed: isDark ? colors.border : appColors.surface,

    // Success colors
    successBackground: colors.primary[100], // emerald-100
    badgeBackground: isDark
      ? toRgba(badgeDarkTextColor, 0.22)
      : toRgba(badgeLightTextColor, 0.22),

    // Utility
    isDark,
  };
}

/**
 * Convert hex color to RGB values (for rgba usage)
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}`
    : '0, 0, 0';
}

function toRgba(hex: string, alpha: number): string {
  return `rgba(${hexToRgb(hex)}, ${alpha})`;
}
