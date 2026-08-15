/**
 * The one source of truth for post-add confirmation colors.
 *
 * `buildDetailPalette` (template drill-down) spreads these values rather than
 * restating them, so the confirmation reads identically wherever it appears —
 * footer panel, library toast — and a contrast fix lands in a single place.
 *
 * The light `addBg` is darkened for WCAG 4.5:1 against a white label on the
 * 16px bold CTA (measured 4.86:1; #1F8A5B sat at 4.33 and failed).
 */

import { useMemo } from 'react';
import { useThemeColors } from '@/theme/ThemeContext';
import type { SemanticColors } from '@/theme/darkColors';
import type { HabitAddedPalette } from './types';

export function buildHabitAddedPalette(
  colors: SemanticColors,
  isDark: boolean
): HabitAddedPalette {
  return {
    addBg: isDark ? '#2FA36F' : '#1E8153',
    addedBg: isDark ? 'rgba(52,211,153,0.16)' : '#DDF2E4',
    addedFg: isDark ? '#4ADE9E' : '#157A4E',
    addFg: '#FFFFFF',
    border: colors.border,
    card: isDark ? colors.card : colors.cardPaper,
    textPrimary: colors.text.primary,
    textSecondary: colors.text.secondary,
  };
}

export function useHabitAddedPalette(): HabitAddedPalette {
  const { colors, isDark } = useThemeColors();
  return useMemo(() => buildHabitAddedPalette(colors, isDark), [colors, isDark]);
}
