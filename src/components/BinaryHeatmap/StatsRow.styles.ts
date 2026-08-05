/**
 * Styles for StatsRow Component
 */

import {
  StyleSheet,
  Platform,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

import { COLORS, FOCUS } from './constants';
import { colors } from '@/theme';
import { typography, fontWeights, fontFamilies } from '@/theme/typography';
import { useThemeColors } from '@/theme/ThemeContext';

const STATS_CONFIG = {
  BADGE_BORDER_RADIUS: 8,
  BADGE_PADDING_X: 12,
  BADGE_PADDING_Y: 6,
  SETTINGS_BUTTON_SIZE: 36,
} as const;

export const styles = StyleSheet.create({
  badgesContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  } as ViewStyle,
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 4,
  } as ViewStyle,
  frequencyBadge: {
    backgroundColor: colors.gray[50], // overridden by useThemedStatsStyles
    borderRadius: STATS_CONFIG.BADGE_BORDER_RADIUS,
    paddingHorizontal: STATS_CONFIG.BADGE_PADDING_X,
    paddingVertical: STATS_CONFIG.BADGE_PADDING_Y,
  } as ViewStyle,
  frequencyText: {
    color: COLORS.TEXT_PRIMARY,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.semibold,
  } as TextStyle,
  settingsButton: {
    alignItems: 'center',
    backgroundColor: colors.gray[50], // overridden by useThemedStatsStyles
    borderRadius: STATS_CONFIG.SETTINGS_BUTTON_SIZE / 2,
    height: STATS_CONFIG.SETTINGS_BUTTON_SIZE,
    justifyContent: 'center',
    width: STATS_CONFIG.SETTINGS_BUTTON_SIZE,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
  } as ViewStyle,
  streakBadge: {
    alignItems: 'center',
    borderRadius: STATS_CONFIG.BADGE_BORDER_RADIUS,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: STATS_CONFIG.BADGE_PADDING_X,
    paddingVertical: STATS_CONFIG.BADGE_PADDING_Y,
  } as ViewStyle,
  streakText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.semibold,
  } as TextStyle,
  webFocus: {
    outlineColor: FOCUS.RING_COLOR,
    outlineOffset: FOCUS.RING_OFFSET,
    outlineStyle: 'solid',
    outlineWidth: FOCUS.RING_WIDTH,
  } as ViewStyle,
});

export function useThemedStatsStyles() {
  const { colors } = useThemeColors();
  return {
    ...styles,
    frequencyBadge: {
      ...styles.frequencyBadge,
      backgroundColor: colors.gray[100],
    },
    settingsButton: {
      ...styles.settingsButton,
      backgroundColor: colors.gray[100],
    },
  };
}
