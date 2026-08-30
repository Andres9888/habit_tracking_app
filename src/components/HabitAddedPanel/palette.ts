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
