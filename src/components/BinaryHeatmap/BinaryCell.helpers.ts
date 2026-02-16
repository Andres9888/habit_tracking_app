/**
 * Helper functions for BinaryCell Component
 */

import type { BinaryCellState, BinaryCellProps } from './types';
import type { HeatmapColors } from './themeAwareColors';

/**
 * Determines to background color for a cell based on its state.
 *
 * @param cellState - The state of the cell (done, missed, today, etc.)
 * @param day - The day data containing completion status
 * @param habitColor - The habit's accent color (hex)
 * @param colors - Theme-aware colors from useHeatmapColors()
 * @returns Background color string (hex)
 */
export function getBackgroundColor(
  cellState: BinaryCellState,
  day: NonNullable<BinaryCellProps['day']>,
  habitColor: string,
  colors?: HeatmapColors
): string {
  // Use theme-aware colors if provided, otherwise fall back to constants
  const themeColors = colors || {
    cellEmpty: '#e7e5e4',
    cellFuture: '#f5f5f4',
    cellBeforeCreation: '#fafaf9',
  };

  switch (cellState) {
    case 'done': {
      return habitColor;
    }
    case 'today': {
      return day.completed ? habitColor : 'transparent';
    }
    case 'missed': {
      return themeColors.cellEmpty;
    }
    case 'future': {
      return themeColors.cellFuture;
    }
    case 'beforeCreation': {
      return themeColors.cellBeforeCreation;
    }
    default: {
      return themeColors.cellEmpty;
    }
  }
}
