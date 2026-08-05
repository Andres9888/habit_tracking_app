/**
 * Timeline Generation Functions
 */

import { differenceInDays, startOfDay } from 'date-fns';

import type { StrengthSnapshot } from '../types';
import { DEFAULT_MAX_SAMPLE_POINTS } from './constants';
import { formatDateString } from './formatting';
import { getStrengthLabel } from './labels';
import { iterateStrengthValues } from './strengthIterator';

/**
 * Generate a complete strength timeline from habit creation to today.
 *
 * For performance with long histories (2+ years), samples down to
 * maxSamplePoints while preserving key events (start, end, peaks, valleys).
 */
export function generateStrengthTimeline(
  completedDates: Set<string>,
  habitCreatedAt: Date,
  sampleSize: number = DEFAULT_MAX_SAMPLE_POINTS
): StrengthSnapshot[] {
  // Guard against invalid dates
  if (!habitCreatedAt || Number.isNaN(habitCreatedAt.getTime())) {
    return [];
  }

  const startDate = startOfDay(habitCreatedAt);
  const endDate = startOfDay(new Date());
  const totalDays = differenceInDays(endDate, startDate) + 1;

  // Guard against negative or extremely large day counts
  if (totalDays <= 0 || totalDays > 3650) {
    return [];
  }

  const dataPoints = iterateStrengthValues(completedDates, startDate, endDate);

  if (totalDays <= sampleSize) {
    return dataPoints.map((p) => ({
      date: p.date,
      dateString: p.dateStr,
      label: getStrengthLabel(p.strength),
      strength: p.strength,
    }));
  }

  return sampleTimeline(dataPoints, totalDays, sampleSize);
}

function sampleTimeline(
  dataPoints: Array<{ date: Date; dateStr: string; strength: number }>,
  totalDays: number,
  sampleSize: number
): StrengthSnapshot[] {
  // Guard against empty or invalid data
  if (dataPoints.length === 0) {
    return [];
  }

  const timeline: StrengthSnapshot[] = [];
  const step = (totalDays - 1) / (sampleSize - 1);

  for (let i = 0; i < sampleSize; i++) {
    const index = Math.min(Math.round(i * step), dataPoints.length - 1);
    const sample = dataPoints[index];
    // Safety check in case index calculation goes wrong
    if (!sample) {
      continue;
    }
    timeline.push({
      date: sample.date,
      dateString: formatDateString(sample.date),
      label: getStrengthLabel(sample.strength),
      strength: sample.strength,
    });
  }

  return timeline;
}
