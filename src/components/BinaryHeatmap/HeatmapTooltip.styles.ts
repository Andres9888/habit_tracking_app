/**
 * Styles for HeatmapTooltip Component
 */

import { StyleSheet } from 'react-native';

import { TOOLTIP } from './constants';

export const styles = StyleSheet.create({
  arrow: {
    position: 'absolute',
    bottom: -TOOLTIP.ARROW_SIZE,
    left: '50%',
    marginLeft: -TOOLTIP.ARROW_SIZE,
    width: 0,
    height: 0,
    borderLeftWidth: TOOLTIP.ARROW_SIZE,
    borderLeftColor: 'transparent',
    borderRightWidth: TOOLTIP.ARROW_SIZE,
    borderRightColor: 'transparent',
    borderTopWidth: TOOLTIP.ARROW_SIZE,
    borderTopColor: '#1c1917', // Will be overridden by theme-aware color
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  tooltip: {
    position: 'absolute',
    paddingHorizontal: TOOLTIP.PADDING_X,
    paddingVertical: TOOLTIP.PADDING_Y,
    borderRadius: TOOLTIP.BORDER_RADIUS,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipText: {
    fontSize: TOOLTIP.FONT_SIZE,
    fontWeight: '500',
  },
});
