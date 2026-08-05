/**
 * Styles for BinaryCell Component
 */

import { StyleSheet } from 'react-native';

import { CELL_SIZE, CELL_BORDER_RADIUS, FOCUS } from './constants';

export const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    height: CELL_SIZE,
    justifyContent: 'center',
    width: CELL_SIZE,
  },
  cellInner: {
    borderRadius: CELL_BORDER_RADIUS,
    height: CELL_SIZE,
    width: CELL_SIZE,
  },
  futureCell: {
    opacity: 0.4,
  },
  webFocus: {
    borderColor: FOCUS.RING_COLOR,
    borderRadius: CELL_BORDER_RADIUS + FOCUS.RING_OFFSET,
    borderWidth: FOCUS.RING_WIDTH,
    outlineColor: FOCUS.RING_COLOR,
    outlineOffset: FOCUS.RING_OFFSET,
    outlineStyle: 'solid',
    outlineWidth: FOCUS.RING_WIDTH,
  },
  webHover: {
    cursor: 'pointer',
  },
});
