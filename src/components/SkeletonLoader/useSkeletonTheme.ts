/**
 * useSkeletonTheme - Provides theme-aware background colors for skeleton screens.
 * Returns semantic background colors so skeleton layouts match light/dark mode.
 */
import { useThemeColors } from '../../theme/ThemeContext';

export function useSkeletonTheme() {
  const { colors, isDark } = useThemeColors();
  return {
    /** Page-level background (e.g. stone-100 light / gray-900 dark) */
    pageBg: colors.background,
    /** Card-level background (e.g. white light / gray-800 dark) */
    cardBg: colors.card,
    /** Surface background (e.g. stone-50 light / gray-800 dark) */
    surfaceBg: isDark ? colors.surface : colors.gray[50],
    /** Card border color */
    borderColor: colors.cardBorder,
    /** Shadow color */
    shadowColor: isDark ? '#000000' : '#1c1917',
    shadowOpacity: isDark ? 0.3 : 0.08,
    isDark,
  };
}
