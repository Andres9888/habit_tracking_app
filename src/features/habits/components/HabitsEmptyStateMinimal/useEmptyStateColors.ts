/**
 * useEmptyStateColors - Theme-aware colors for the empty state
 *
 * Provides WCAG AA compliant colors for both light and dark modes
 */

import { useThemeColors } from '../../../../theme/ThemeContext';

export function useEmptyStateColors() {
  const { colors, isDark } = useThemeColors();

  return {
    // Background colors
    background: colors.background,
    surface: colors.surface,

    // Text colors (WCAG AA compliant)
    textPrimary: colors.text.primary, // High contrast
    textSecondary: colors.text.secondary, // Medium contrast
    textTertiary: colors.text.tertiary, // Lower contrast

    // Hero icon colors
    heroIconBackground: colors.primary[100],
    heroIconOverlay: colors.primary[300],
    heroIconShadow: colors.primary[500],

    // Input colors
    inputBackground: colors.card,
    inputBorder: colors.border,
    inputBorderFocused: colors.primary[500],
    inputPlaceholder: colors.gray[400],
    inputText: colors.text.primary,
    inputCaret: colors.primary[400],

    // Character counter colors
    counterNormal: colors.text.tertiary,
    counterWarning: isDark ? '#FBBF24' : '#F59E0B',
    counterError: isDark ? '#F87171' : '#EF4444',

    // Chip colors
    chipBackground: colors.card,
    chipBackgroundSelected: colors.primary[700],
    chipBorder: colors.border,
    chipBorderSelected: colors.primary[700],
    chipText: colors.text.primary,
    chipTextSelected: colors.text.inverse,
    chipShadow: colors.gray[900],

    // Button colors
    ctaBackground: colors.primary[700],
    ctaText: colors.text.inverse,
    ctaDisabled: colors.gray[300],

    // Secondary link colors
    linkBackground: isDark
      ? `rgba(${hexToRgb(colors.primary[300])}, 0.15)`
      : `rgba(${hexToRgb(colors.primary[100])}, 0.5)`,
    linkBackgroundPressed: colors.primary[100],
    linkBorder: isDark
      ? `rgba(${hexToRgb(colors.primary[400])}, 0.3)`
      : `rgba(${hexToRgb(colors.primary[100])}, 0.8)`,
    linkText: colors.primary[600],

    // Error colors
    errorBackground: isDark ? 'rgba(254, 202, 202, 0.1)' : colors.gray[50],
    errorBorder: isDark ? 'rgba(254, 202, 202, 0.3)' : 'rgba(254, 202, 202, 0.8)',
    errorText: isDark ? '#FCA5A5' : '#DC2626',
    errorIcon: isDark ? '#F87171' : '#EF4444',

    // Success colors
    successBackground: colors.primary[100],

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
