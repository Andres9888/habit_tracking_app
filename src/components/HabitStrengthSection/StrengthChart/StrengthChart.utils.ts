/**
 * StrengthChart Utility Functions - Math utilities for chart path generation.
 */
import { format } from 'date-fns';

/** Catmull-Rom to Bezier curve conversion for smooth curves through data points. */
export function catmullRomToBezier(
  points: Array<{ x: number; y: number }>,
  tension = 0.5
): string {
  if (points.length < 2) return '';
  const path: string[] = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1.x + ((p2.x - p0.x) * tension) / 6;
    const cp1y = p1.y + ((p2.y - p0.y) * tension) / 6;
    const cp2x = p2.x - ((p3.x - p1.x) * tension) / 6;
    const cp2y = p2.y - ((p3.y - p1.y) * tension) / 6;
    path.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }
  return path.join(' ');
}

/** Generate X-axis labels based on actual data range (not time range selection). */
export function getXAxisLabelsFromData(data: Array<{ date: Date }>): string[] {
  if (data.length < 2) return ['Start', 'Now'];
  const startDate = data[0].date;
  const endDate = data.at(-1).date;
  const daySpan = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daySpan < 14) {
    return [format(startDate, 'MMM d'), 'Now'];
  }
  if (daySpan < 60) {
    const midDate = new Date(
      startDate.getTime() + (endDate.getTime() - startDate.getTime()) / 2
    );
    return [format(startDate, 'MMM d'), format(midDate, 'MMM d'), 'Now'];
  }
  const oneThird = new Date(
    startDate.getTime() + (endDate.getTime() - startDate.getTime()) / 3
  );
  const twoThirds = new Date(
    startDate.getTime() + ((endDate.getTime() - startDate.getTime()) * 2) / 3
  );
  if (daySpan < 365) {
    return [
      format(startDate, 'MMM d'),
      format(oneThird, 'MMM d'),
      format(twoThirds, 'MMM d'),
      'Now',
    ];
  }
  return [
    format(startDate, "MMM ''yy"),
    format(oneThird, "MMM ''yy"),
    format(twoThirds, "MMM ''yy"),
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
