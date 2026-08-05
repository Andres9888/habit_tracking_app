/**
 * X-axis label utilities for StrengthTimelineChart
 */

import type { StrengthSnapshot } from '../types';
import type { ChartDimensions, XAxisLabel } from './types';

/**
 * Generate X-axis labels based on history length
 */
export function generateXAxisLabels(
  historyDays: number,
  dimensions: ChartDimensions
): XAxisLabel[] {
  const { paddingLeft, chartWidth } = dimensions;
  const labels: XAxisLabel[] = [
    { text: 'Start', x: paddingLeft },
    { text: 'Now', x: paddingLeft + chartWidth },
  ];

  // Always show Start and Now

  // Add intermediate labels based on duration
  if (historyDays >= 365) {
    // Show 6mo and 1yr markers
    const sixMonthRatio = 182 / historyDays;
    const oneYearRatio = 365 / historyDays;

    if (sixMonthRatio < 0.9) {
      // Don't show if too close to end
      labels.push({
        text: '6mo',
        x: paddingLeft + sixMonthRatio * chartWidth,
      });
    }

    if (oneYearRatio < 0.9) {
      labels.push({
        text: '1yr',
        x: paddingLeft + oneYearRatio * chartWidth,
      });
    }
  } else if (historyDays >= 180) {
    // Show just 6mo marker
    const sixMonthRatio = 182 / historyDays;
    if (sixMonthRatio < 0.9) {
      labels.push({
        text: '6mo',
        x: paddingLeft + sixMonthRatio * chartWidth,
      });
    }
  }

  // Sort labels by x position
  return labels.sort((a, b) => a.x - b.x);
}

/**
 * Calculate the overall trend direction for accessibility
 */
export function calculateTrendDescription(data: StrengthSnapshot[]): string {
  if (data.length < 2) return 'Not enough data to determine trend';

  const first = data[0].strength;
  const last = data.at(-1)?.strength ?? 0;
  const diff = last - first;

  if (diff > 10)
    return `Strength has increased from ${first.toFixed(0)}% to ${last.toFixed(0)}%`;
  if (diff < -10)
    return `Strength has decreased from ${first.toFixed(0)}% to ${last.toFixed(0)}%`;
  return `Strength has remained relatively stable around ${last.toFixed(0)}%`;
}
