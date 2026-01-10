import type {
  ChartPoint,
  DataPoint,
  TrendDirection,
} from './StrengthHistoryChart.types';

/**
 * Generate SVG path from data points
 */
export function generateLinePath(
  data: DataPoint[],
  chartWidth: number,
  chartHeight: number,
  padding: number
): string {
  if (data.length === 0) return '';

  const maxValue = 100;
  const minValue = 0;
  const range = maxValue - minValue;
  const stepX = (chartWidth - padding * 2) / (data.length - 1 || 1);

  const points = data.map((point, index) => {
    const x = padding + index * stepX;
    const y =
      chartHeight -
      padding -
      ((point.strength - minValue) / range) * (chartHeight - padding * 2);
    return { x, y };
  });

  return points
    .map((point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
    )
    .join(' ');
}

/**
 * Calculate chart point positions for interactive circles
 */
export function calculateChartPoints(
  data: DataPoint[],
  chartWidth: number,
  chartHeight: number,
  padding: number
): ChartPoint[] {
  const maxValue = 100;
  const minValue = 0;
  const range = maxValue - minValue;
  const stepX = (chartWidth - padding * 2) / (data.length - 1 || 1);

  return data.map((point, index) => {
    const x = padding + index * stepX;
    const y =
      chartHeight -
      padding -
      ((point.strength - minValue) / range) * (chartHeight - padding * 2);
    return { data: point, x, y };
  });
}

/**
 * Calculate trend direction from strength change
 */
export function getTrendDirection(strengthChange: number): TrendDirection {
  if (strengthChange > 0) return 'up';
  if (strengthChange < 0) return 'down';
  return 'stable';
}
