/**
 * useChartData Hook - Computes chart points and path data from strength snapshots.
 */
import { useMemo } from 'react';

import type { StrengthSnapshot } from '../../HabitStrengthHistory/types';
import {
  CHART_HEIGHT,
  CHART_PADDING_BOTTOM,
  CHART_PADDING_TOP,
  CHART_PADDING_X,
} from '../constants';

import { catmullRomToBezier } from './StrengthChart.utils';
import type { ChartPathData } from './StrengthChart.types';

interface UseChartDataOptions {
  data: StrengthSnapshot[];
  chartWidth: number;
}

/** Computes chart points, bezier paths, and fill area from raw data. */
export function useChartData({
  data,
  chartWidth,
}: UseChartDataOptions): ChartPathData {
  return useMemo(() => {
    const chartAreaWidth = chartWidth - CHART_PADDING_X * 2;
    const chartAreaHeight =
      CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;

    if (data.length < 2) {
      return {
        fillPathD: '',
        lastPoint: { x: chartWidth / 2, y: CHART_HEIGHT / 2 },
        pathD: '',
        pathLength: 0,
        points: [],
      };
    }

    const mappedPoints = data
      .filter((snapshot): snapshot is StrengthSnapshot => snapshot != null)
      .map((snapshot, index, arr) => ({
        x:
          CHART_PADDING_X +
          (index / Math.max(1, arr.length - 1)) * chartAreaWidth,
        y:
          CHART_PADDING_TOP +
          chartAreaHeight -
          ((snapshot.strength ?? 0) / 100) * chartAreaHeight,
      }));

    const curvePath = catmullRomToBezier(mappedPoints);
    const lastPoint = mappedPoints.at(-1);
    const firstPoint = mappedPoints[0];

    // Safety check - should never happen due to length check above, but prevents crashes
    if (!lastPoint || !firstPoint) {
      return {
        fillPathD: '',
        lastPoint: { x: chartWidth / 2, y: CHART_HEIGHT / 2 },
        pathD: '',
        pathLength: 0,
        points: [],
      };
    }

    const fillPath = `${curvePath} L ${lastPoint.x} ${
      CHART_PADDING_TOP + chartAreaHeight
    } L ${firstPoint.x} ${CHART_PADDING_TOP + chartAreaHeight} Z`;

    let estimatedLength = 0;
    for (let i = 1; i < mappedPoints.length; i++) {
      const prev = mappedPoints[i - 1];
      const point = mappedPoints[i];
      // Guard against undefined points (shouldn't happen but prevents crashes)
      if (prev && point) {
        estimatedLength += Math.hypot(point.x - prev.x, point.y - prev.y);
      }
    }

    return {
      fillPathD: fillPath,
      lastPoint,
      pathD: curvePath,
      pathLength: estimatedLength,
      points: mappedPoints,
    };
  }, [data, chartWidth]);
}
