/**
 * HabitCard Color Constants
 * Implements theme color palette
 * Maps semantic card colors to canonical theme tokens
 */

import { colors } from '../../theme/colors';

export const REDESIGN_COLORS = {
  accent: colors.primary[500],
  accentMuted: '#D1FAE5',
  cardBg: colors.light.surfaceMuted,
  cardSurface: colors.light.card,
  dominant: colors.light.background,
  metaText: colors.gray[500],
  neutral: colors.gray[200],
  secondaryText: colors.text.primary,
  streakText: colors.primary[700],
} as const;
