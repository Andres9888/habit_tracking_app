/**
 * Bezier curve utilities for chart path generation
 */

import type { ChartDimensions, ChartPoint } from './types';

/**
 * Convert data point index and strength to SVG coordinates
 */
export function dataToSvg(
  index: number,
  strength: number,
  dataLength: number,
  dimensions: ChartDimensions
): ChartPoint {
  const { chartWidth, chartHeight, paddingLeft, paddingTop } = dimensions;

  const x =
    dataLength > 1
      ? paddingLeft + (index / (dataLength - 1)) * chartWidth
      : paddingLeft + chartWidth / 2;

  const y = paddingTop + chartHeight - (strength / 100) * chartHeight;

  return { x, y };
}

/**
 * Generate bezier curve segments using Catmull-Rom to Bezier conversion
 */
export function generateBezierCurves(points: ChartPoint[]): string {
  let path = '';
  const tension = 0.3;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}
