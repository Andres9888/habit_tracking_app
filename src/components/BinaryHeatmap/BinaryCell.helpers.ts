/**
 * Helper functions for BinaryCell Component
 */

import type { BinaryCellState, BinaryCellProps } from './types';
import { getHeatmapColors } from './constants';

/**
 * Determines the background color for a cell based on its state.
 */
export function getBackgroundColor(
  cellState: BinaryCellState,
  day: NonNullable<BinaryCellProps['day']>,
  habitColor: string,
  isDark = false
): string {
  const hColors = getHeatmapColors(isDark);
  switch (cellState) {
    case 'done': {
      return habitColor;
    }
    case 'today': {
      return day.completed ? habitColor : 'transparent';
    }
    case 'missed': {
      return hColors.CELL_EMPTY;
    }
    case 'future': {
      return hColors.CELL_FUTURE;
    }
    case 'beforeCreation': {
      return hColors.CELL_BEFORE_CREATION;
    }
    default: {
      return hColors.CELL_EMPTY;
    }
  }
}
