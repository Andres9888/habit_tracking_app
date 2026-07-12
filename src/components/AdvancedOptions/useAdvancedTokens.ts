/**
 * Theme-aware tokens for the Advanced Options panel.
 * Replaces the hardcoded OD mock palette so the panel adapts to dark mode
 * and matches the app's raised-card / settings-tile language.
 */
import { useThemeColors } from '@/theme/ThemeContext';

export function useAdvancedTokens() {
  const { colors, settings, isDark } = useThemeColors();
  return {
    fg: colors.text.primary,
    muted: colors.text.secondary,
    meta: colors.text.tertiary,
    border: colors.border,
    /** Raised panel surface — same layering as settings cards */
    card: isDark ? colors.card : colors.gray[50],
    /** Neutral inner icon tile (stone) */
    tile: settings.neutral.bg,
    tileIcon: settings.neutral.icon,
    /** Brand-green accent: text + icon-tile pair */
    accentText: colors.status.successText,
    accentTile: settings.strength.bg,
    accentTileIcon: settings.strength.icon,
  } as const;
}
