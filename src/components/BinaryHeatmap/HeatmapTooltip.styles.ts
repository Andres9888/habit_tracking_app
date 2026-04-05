/**
 * Styles for HeatmapTooltip Component
 */

import { StyleSheet } from 'react-native';

import { COLORS, TOOLTIP } from './constants';
import { fontFamilies, fontWeights } from '@/theme/typography';

export const styles = StyleSheet.create({
  arrow: {
    alignSelf: 'center',
    borderLeftColor: 'transparent',
    borderLeftWidth: TOOLTIP.ARROW_SIZE,
    borderRightColor: 'transparent',
    borderRightWidth: TOOLTIP.ARROW_SIZE,
    borderTopColor: COLORS.TOOLTIP_BACKGROUND,
    borderTopWidth: TOOLTIP.ARROW_SIZE,
    bottom: -TOOLTIP.ARROW_SIZE,
    height: 0,
    position: 'absolute',
    width: 0,
  },
  backdrop: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  tooltip: {
    alignItems: 'center',
    backgroundColor: COLORS.TOOLTIP_BACKGROUND,
    borderRadius: TOOLTIP.BORDER_RADIUS,
    paddingHorizontal: TOOLTIP.PADDING_X,
    paddingVertical: TOOLTIP.PADDING_Y,
    position: 'absolute',
    transform: [{ translateX: -50 }],
  },
  tooltipText: {
    color: COLORS.TOOLTIP_TEXT,
    fontFamily: fontFamilies.primary.text,
    fontSize: TOOLTIP.FONT_SIZE,
    fontWeight: fontWeights.medium,
  },
});
