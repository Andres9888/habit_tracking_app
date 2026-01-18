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

    const mappedPoints = data.map((snapshot, index) => ({
      x: CHART_PADDING_X + (index / (data.length - 1)) * chartAreaWidth,
      y:
        CHART_PADDING_TOP +
        chartAreaHeight -
        (snapshot.strength / 100) * chartAreaHeight,
    }));

    const curvePath = catmullRomToBezier(mappedPoints);
    const fillPath = `${curvePath} L ${mappedPoints.at(-1).x} ${
      CHART_PADDING_TOP + chartAreaHeight
    } L ${mappedPoints[0].x} ${CHART_PADDING_TOP + chartAreaHeight} Z`;

    let estimatedLength = 0;
    for (let i = 1; i < mappedPoints.length; i++) {
      const prev = mappedPoints[i - 1];
      const point = mappedPoints[i];
      estimatedLength += Math.hypot(point.x - prev.x, point.y - prev.y);
    }

    return {
      fillPathD: fillPath,
      lastPoint: mappedPoints.at(-1),
      pathD: curvePath,
      pathLength: estimatedLength,
      points: mappedPoints,
    };
  }, [data, chartWidth]);
}
