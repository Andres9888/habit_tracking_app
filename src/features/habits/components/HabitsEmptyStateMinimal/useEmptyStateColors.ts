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
    counterWarning: '#F59E0B', // amber-500 (WCAG AA on both backgrounds)
    counterError: isDark ? '#F87171' : '#EF4444', // red-400 / red-500

    // Chip colors
    chipBackground: isDark ? colors.card : '#ffffff',
    chipBackgroundSelected: isDark ? colors.primary[300] : '#047857', // emerald-700
    chipBorder: isDark ? colors.border : '#E7E5E4', // stone-200
    chipBorderSelected: isDark ? colors.primary[300] : '#047857',
    chipText: isDark ? colors.text.primary : '#44403C', // stone-700
    chipTextSelected: '#ffffff',
    chipShadow: isDark ? colors.gray[900] : '#1c1917',

    // Button colors
    ctaBackground: isDark ? colors.primary[300] : '#047857', // emerald-700
    ctaText: '#ffffff',
    ctaDisabled: isDark ? colors.gray[300] : '#A8A29E',

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
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
}
