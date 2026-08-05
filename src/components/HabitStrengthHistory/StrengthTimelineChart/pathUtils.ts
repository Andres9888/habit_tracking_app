/**
 * SVG path generation utilities for StrengthTimelineChart
 */

import type { StrengthSnapshot } from '../types';
import type { ChartDimensions, ChartPaths } from './types';
import { dataToSvg, generateBezierCurves } from './bezierUtils';

/**
 * Generate a smooth bezier curve area path through all data points.
 */
export function generateAreaPath(
  data: StrengthSnapshot[],
  dimensions: ChartDimensions
): string {
  if (data.length === 0) return '';

  const { chartHeight, paddingLeft, paddingTop } = dimensions;
  const bottomY = paddingTop + chartHeight;

  if (data.length === 1) {
    const point = dataToSvg(0, data[0].strength, 1, dimensions);
    const halfWidth = 20;
    return `
      M ${point.x - halfWidth} ${bottomY}
      L ${point.x - halfWidth} ${point.y}
      L ${point.x + halfWidth} ${point.y}
      L ${point.x + halfWidth} ${bottomY}
      Z
    `;
  }

  const points = data.map((snapshot, index) =>
    dataToSvg(index, snapshot.strength, data.length, dimensions)
  );

  let path = `M ${paddingLeft} ${bottomY}`;
  path += ` L ${points[0].x} ${points[0].y}`;
  path += generateBezierCurves(points);

  const lastPoint = points.at(-1) ?? points[0];
  path += ` L ${lastPoint.x} ${bottomY}`;
  path += ' Z';

  return path;
}

/**
 * Generate the line path (without the fill area) for the stroke
 */
export function generateLinePath(
  data: StrengthSnapshot[],
  dimensions: ChartDimensions
): string {
  if (data.length === 0) return '';

  if (data.length === 1) {
    const point = dataToSvg(0, data[0].strength, 1, dimensions);
    return `M ${point.x} ${point.y}`;
  }

  const points = data.map((snapshot, index) =>
    dataToSvg(index, snapshot.strength, data.length, dimensions)
  );

  let path = `M ${points[0].x} ${points[0].y}`;
  path += generateBezierCurves(points);

  return path;
}

/**
 * Generate all chart paths from strength history data
 */
export function generateChartPaths(
  strengthHistory: StrengthSnapshot[],
  dimensions: ChartDimensions
): ChartPaths {
  if (strengthHistory.length === 0) {
    return { areaPath: '', lastPoint: null, linePath: '' };
  }

  const areaPath = generateAreaPath(strengthHistory, dimensions);
  const linePath = generateLinePath(strengthHistory, dimensions);
  const lastPoint = dataToSvg(
    strengthHistory.length - 1,
    strengthHistory.at(-1)?.strength ?? 0,
    strengthHistory.length,
    dimensions
  );

  return { areaPath, lastPoint, linePath };
}
