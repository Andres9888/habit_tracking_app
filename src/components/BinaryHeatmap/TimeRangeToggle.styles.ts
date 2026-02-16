/**
 * Styles for TimeRangeToggle Component
 *
 * Colors that need theme awareness are provided at runtime
 * via useThemedToggleStyles() hook.
 */

import { StyleSheet } from 'react-native';
import { useMemo } from 'react';

import { typography } from '../../theme/typography';
import { useThemeColors } from '@/theme/ThemeContext';
import type { ThemedToggleStyles } from './types';

export const baseStyles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: typography.tabBar.fontSize,
    fontWeight: '500',
  },
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 2,
  },
  webFocus: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#2563eb',
  },
});

/**
 * Hook to get theme-aware styles for the TimeRangeToggle component
 */
export function useThemedToggleStyles(): ThemedToggleStyles {
  const { colors } = useThemeColors();

  return useMemo(() => {
    return {
      button: baseStyles.button,
      buttonActive: {
        backgroundColor: colors.cardBorder,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
      buttonText: baseStyles.buttonText,
      buttonTextActive: {
        color: colors.text.primary,
        fontWeight: '600',
      },
      buttonTextInactive: {
        color: colors.text.tertiary,
        fontWeight: '400',
      },
      container: {
        ...baseStyles.container,
        backgroundColor: colors.gray[200],
      },
      webFocus: baseStyles.webFocus,
    };
  }, [colors]);
}
