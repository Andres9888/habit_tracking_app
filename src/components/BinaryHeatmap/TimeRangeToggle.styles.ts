/**
 * Styles for TimeRangeToggle Component
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { shadows, borderRadius } from '../../theme/spacing';
import { typography, fontWeights, fontFamilies } from '@/theme/typography';
import { useThemeColors } from '@/theme/ThemeContext';
import { COLORS, FOCUS } from './constants';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    justifyContent: 'center',
    minWidth: 32,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  buttonActive: {
    ...shadows.subtle,
    backgroundColor: colors.light.surfaceMuted, // overridden by useThemedToggleStyles
    shadowOpacity: 0.1,
  },
  buttonText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.tabBar.fontSize,
    fontWeight: fontWeights.medium,
  },
  buttonTextActive: {
    color: COLORS.TEXT_PRIMARY,
  },
  buttonTextInactive: {
    color: COLORS.TEXT_SECONDARY,
  },
  container: {
    backgroundColor: colors.gray[50], // overridden by useThemedToggleStyles
    borderRadius: borderRadius.small,
    flexDirection: 'row',
    padding: 2,
  },
  webFocus: {
    outlineColor: FOCUS.RING_COLOR,
    outlineOffset: FOCUS.RING_OFFSET,
    outlineStyle: 'solid',
    outlineWidth: FOCUS.RING_WIDTH,
  },
});

export function useThemedToggleStyles() {
  const { colors } = useThemeColors();
  return {
    ...styles,
    buttonActive: {
      ...styles.buttonActive,
      backgroundColor: colors.card,
    },
    container: {
      ...styles.container,
      backgroundColor: colors.gray[100],
    },
  };
}
