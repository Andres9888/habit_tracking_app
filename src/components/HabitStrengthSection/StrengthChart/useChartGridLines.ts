/**
 * useChartGridLines Hook - Computes Y positions for horizontal grid lines.
 */
import { useMemo } from 'react';

import {
  CHART_HEIGHT,
  CHART_PADDING_BOTTOM,
  CHART_PADDING_TOP,
  GRID_LINE_COUNT,
} from '../constants';

/** Computes Y positions for grid lines (0%, 50%, 100%). */
export function useChartGridLines(): number[] {
  return useMemo(() => {
    const chartAreaHeight =
      CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;
    return Array.from(
      { length: GRID_LINE_COUNT },
      (_, i) =>
        CHART_PADDING_TOP + (i / (GRID_LINE_COUNT - 1)) * chartAreaHeight
    );
  }, []);
}
