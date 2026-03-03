/**
 * Styles for StatsRow Component
 *
 * Color-dependent styles (text color, badge bg) are applied inline
 * via getHeatmapColors(isDark) in StatsRow.tsx.
 */

import {
  StyleSheet,
  Platform,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

import { FOCUS } from './constants';
import { typography } from '@/theme/typography';

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
    borderRadius: STATS_CONFIG.BADGE_BORDER_RADIUS,
    paddingHorizontal: STATS_CONFIG.BADGE_PADDING_X,
    paddingVertical: STATS_CONFIG.BADGE_PADDING_Y,
  } as ViewStyle,
  frequencyText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  } as TextStyle,
  settingsButton: {
    alignItems: 'center',
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
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  } as TextStyle,
  webFocus: {
    outlineColor: FOCUS.RING_COLOR,
    outlineOffset: FOCUS.RING_OFFSET,
    outlineStyle: 'solid',
    outlineWidth: FOCUS.RING_WIDTH,
  } as ViewStyle,
});
