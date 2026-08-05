/**
 * HabitCard Color Constants (Light Mode Defaults)
 *
 * These map to `colors.light.*` values and are used in the static StyleSheet
 * (HabitCard.styles.ts). Dark mode colors are applied dynamically by
 * sub-components (HabitCardContent, StreakBadge, StatusIndicator, etc.)
 * via `useThemeColors()` at render time, overriding these defaults.
 */

import { colors } from '../../theme/colors';

export const REDESIGN_COLORS = {
  accent: colors.primary[500],
  accentMuted: colors.primary[100],
  cardBg: colors.light.surfaceMuted,
  cardSurface: colors.light.card,
  dominant: colors.light.background,
  metaText: colors.gray[500],
  neutral: colors.gray[200],
  secondaryText: colors.text.primary,
  streakText: colors.streak[700],
} as const;
