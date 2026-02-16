/**
 * Theme-Aware Colors for BinaryHeatmap
 *
 * Provides colors that adapt to light/dark mode.
 * Addresses the issue of hardcoded colors that don't work in dark mode.
 */

import { useThemeColors } from '@/theme/ThemeContext';
import type { SemanticColors } from '@/theme/darkColors';

/**
 * Get theme-aware colors for the binary heatmap
 *
 * Returns colors appropriate for the current theme (light/dark mode),
 * ensuring visibility and contrast in both modes.
 *
 * @returns Object containing colors keyed by semantic name
 *
 * @example
 * const colors = useHeatmapColors();
 * // In light mode: { cellEmpty: '#e7e5e4', textPrimary: '#1f2937', ... }
 * // In dark mode: { cellEmpty: '#374151', textPrimary: '#F9FAFB', ... }
 */
export function useHeatmapColors() {
  const { colors } = useThemeColors();

  return {
    /**
     * Cell backgrounds
     * - Use theme's gray scale for empty/missed cells
     * - Darker in light mode, lighter in dark mode
     */
    cellEmpty: colors.gray[300], // Missed days
    cellFuture: colors.gray[200], // Future days (lighter)
    cellBeforeCreation: colors.gray[100], // Before habit creation (lightest)

    /**
     * Text colors
     * - Use theme's text hierarchy
     */
    textPrimary: colors.text.primary,
    textSecondary: colors.text.secondary,
    textTertiary: colors.text.tertiary,

    /**
     * Card background
     * - Use theme's card color
     */
    cardBackground: colors.card,

    /**
     * Tooltip colors
     * - Use high-contrast colors for visibility
     */
    tooltipBackground: colors.gray[50],
    tooltipText: colors.text.primary,

    /**
     * Today ring color
     * - Uses habit color dynamically, provided at render time
     * This is just a fallback reference
     */
    todayRingWidth: 2,
  } as const;
}

/**
 * Type for heatmap colors returned by useHeatmapColors
 */
export type HeatmapColors = ReturnType<typeof useHeatmapColors>;
