/**
 * StrengthChart Utility Functions - Math utilities for chart path generation.
 */
import { format } from 'date-fns';

/** Catmull-Rom to Bezier curve conversion for smooth curves through data points. */
export function catmullRomToBezier(
  points: Array<{ x: number; y: number }>,
  tension = 0.5
): string {
  if (!points || points.length < 2) return '';
  const firstPoint = points[0];
  // Guard against undefined first point
  if (!firstPoint) return '';
  const path: string[] = [`M ${firstPoint.x} ${firstPoint.y}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    // Guard against undefined points (shouldn't happen but prevents crashes)
    if (!p0 || !p1 || !p2 || !p3) continue;
    const cp1x = p1.x + ((p2.x - p0.x) * tension) / 6;
    const cp1y = p1.y + ((p2.y - p0.y) * tension) / 6;
    const cp2x = p2.x - ((p3.x - p1.x) * tension) / 6;
    const cp2y = p2.y - ((p3.y - p1.y) * tension) / 6;
    path.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }
  return path.join(' ');
}

/** Safely format a date, returning fallback on error */
function safeFormat(date: Date, formatStr: string, fallback: string): string {
  try {
    if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
      return fallback;
    }
    return format(date, formatStr);
  } catch {
    return fallback;
  }
}

/** Generate X-axis labels based on actual data range (not time range selection). */
export function getXAxisLabelsFromData(data: Array<{ date: Date }>): string[] {
  if (!data || data.length < 2) return ['Start', 'Now'];
  const firstItem = data[0];
  const lastItem = data.at(-1);
  if (!firstItem || !lastItem) return ['Start', 'Now'];
  const startDate = firstItem.date;
  const endDate = lastItem.date;
  // Guard against invalid dates
  if (
    !startDate ||
    !endDate ||
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    return ['Start', 'Now'];
  }
  const daySpan = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  // Guard against NaN or negative daySpan
  if (Number.isNaN(daySpan) || daySpan < 0) return ['Start', 'Now'];
  if (daySpan < 14) {
    return [safeFormat(startDate, 'MMM d', 'Start'), 'Now'];
  }
  if (daySpan < 60) {
    const midDate = new Date(
      startDate.getTime() + (endDate.getTime() - startDate.getTime()) / 2
    );
    return [
      safeFormat(startDate, 'MMM d', 'Start'),
      safeFormat(midDate, 'MMM d', ''),
      'Now',
    ];
  }
  const oneThird = new Date(
    startDate.getTime() + (endDate.getTime() - startDate.getTime()) / 3
  );
  const twoThirds = new Date(
    startDate.getTime() + ((endDate.getTime() - startDate.getTime()) * 2) / 3
  );
  if (daySpan < 365) {
    return [
      safeFormat(startDate, 'MMM d', 'Start'),
      safeFormat(oneThird, 'MMM d', ''),
      safeFormat(twoThirds, 'MMM d', ''),
      'Now',
    ];
  }
  return [
    safeFormat(startDate, "MMM ''yy", 'Start'),
    safeFormat(oneThird, "MMM ''yy", ''),
    safeFormat(twoThirds, "MMM ''yy", ''),
    'Now',
  ];
}

/** Get strength label for accessibility/theming. */
export function getStrengthLabel(
  strength: number
): 'weak' | 'developing' | 'strong' {
  if (strength < 30) return 'weak';
  if (strength < 70) return 'developing';
  return 'strong';
}
