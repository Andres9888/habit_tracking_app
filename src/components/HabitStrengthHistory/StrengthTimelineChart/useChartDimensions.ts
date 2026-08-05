/**
 * Chart dimensions hook for StrengthTimelineChart
 */

import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import {
  PADDING_BOTTOM,
  PADDING_LEFT,
  PADDING_RIGHT,
  PADDING_TOP,
} from './constants';
import type { ChartDimensions } from './types';

export function useChartDimensions(height: number): ChartDimensions {
  const { width: windowWidth } = useWindowDimensions();
  const chartContainerWidth = windowWidth - 32;

  return useMemo<ChartDimensions>(
    () => ({
      chartHeight: height - PADDING_TOP - PADDING_BOTTOM,
      chartWidth: chartContainerWidth - PADDING_LEFT - PADDING_RIGHT,
      height,
      paddingBottom: PADDING_BOTTOM,
      paddingLeft: PADDING_LEFT,
      paddingRight: PADDING_RIGHT,
      paddingTop: PADDING_TOP,
      width: chartContainerWidth,
    }),
    [chartContainerWidth, height]
  );
}
