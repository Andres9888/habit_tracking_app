/**
 * Styles for TimeRangeToggle Component
 *
 * Color-dependent styles are applied inline via getHeatmapColors(isDark).
 */

import { StyleSheet } from 'react-native';

import { shadows, borderRadius } from '../../theme/spacing';
import { typography } from '@/theme/typography';
import { FOCUS } from './constants';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    justifyContent: 'center',
    minWidth: 32,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  buttonActive: {
    ...shadows.subtle,
    shadowOpacity: 0.1,
  },
  buttonText: {
    fontSize: typography.tabBar.fontSize,
    fontWeight: '500',
  },
  container: {
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
