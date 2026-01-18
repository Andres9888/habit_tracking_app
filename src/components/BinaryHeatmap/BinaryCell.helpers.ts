/**
 * Helper functions for BinaryCell Component
 */

import type { BinaryCellState, BinaryCellProps } from './types';
import { COLORS } from './constants';

/**
 * Determines the background color for a cell based on its state.
 */
export function getBackgroundColor(
  cellState: BinaryCellState,
  day: NonNullable<BinaryCellProps['day']>,
  habitColor: string
): string {
  switch (cellState) {
    case 'done': {
      return habitColor;
    }
    case 'today': {
      return day.completed ? habitColor : 'transparent';
    }
    case 'missed': {
      return COLORS.CELL_EMPTY;
    }
    case 'future': {
      return COLORS.CELL_FUTURE;
    }
    case 'beforeCreation': {
      return COLORS.CELL_BEFORE_CREATION;
    }
    default: {
      return COLORS.CELL_EMPTY;
    }
  }
}
