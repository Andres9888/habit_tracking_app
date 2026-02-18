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
    heroIconBackground: isDark ? colors.primary[100] : '#D1FAE5', // emerald-100
    heroIconOverlay: isDark ? colors.primary[300] : '#F0FDF4', // green-50
    heroIconShadow: colors.primary[500],

    // Input colors
    inputBackground: isDark ? colors.card : '#ffffff',
    inputBorder: isDark ? colors.border : '#E7E5E4', // stone-200
    inputBorderFocused: isDark ? colors.primary[400] : '#3B82F6', // blue-500
    inputPlaceholder: isDark ? colors.gray[500] : '#A8A29E', // stone-400
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
      : 'rgba(209, 250, 229, 0.5)',
    linkBackgroundPressed: isDark ? colors.primary[100] : '#D1FAE5',
    linkBorder: isDark
      ? `rgba(${hexToRgb(colors.primary[400])}, 0.3)`
      : 'rgba(167, 243, 208, 0.8)',
    linkText: isDark ? colors.primary[500] : '#047857', // emerald-700

    // Error colors
    errorBackground: isDark ? 'rgba(254, 202, 202, 0.1)' : '#FEF2F2', // red-50
    errorBorder: isDark ? 'rgba(254, 202, 202, 0.3)' : '#FECACA', // red-200
    errorText: isDark ? '#FCA5A5' : '#DC2626', // red-300 / red-600
    errorIcon: isDark ? '#F87171' : '#EF4444', // red-400 / red-500

    // Success colors
    successBackground: isDark ? colors.primary[100] : '#D1FAE5', // emerald-100

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
