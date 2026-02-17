/**
 * useStreakHeatmapData
 *
 * Computes a GitHub-style contribution grid from completed dates.
 * Calculates intensity levels (0-4) based on surrounding-day consistency
 * within a rolling 7-day window.
 */

import { useMemo } from 'react';
import { format, subDays, startOfWeek, addDays } from 'date-fns';
import type { DayCellData, IntensityLevel } from './StreakHeatmap.types';

/**
 * Calculate intensity level based on consistency in a 7-day rolling window.
 * 0 = not completed, 1-4 = increasing consistency around that day.
 */
function getIntensity(
  dateStr: string,
  completedDates: Set<string>
): IntensityLevel {
  if (!completedDates.has(dateStr)) return 0;

  const date = new Date(dateStr + 'T12:00:00');
  let nearbyCount = 0;

  // Check 3 days before and 3 days after (7-day window)
  for (let offset = -3; offset <= 3; offset++) {
    const nearby = format(addDays(date, offset), 'yyyy-MM-dd');
    if (completedDates.has(nearby)) nearbyCount++;
  }

  // Map 1-7 completions in window to intensity 1-4
  if (nearbyCount >= 6) return 4;
  if (nearbyCount >= 4) return 3;
  if (nearbyCount >= 2) return 2;
  return 1;
}

export function useStreakHeatmapData(
  completedDates: Set<string>,
  weeks: number = 16
): DayCellData[][] {
  return useMemo(() => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    // End on the current week's Saturday, start `weeks` weeks back
    const endOfCurrentWeek = addDays(
      startOfWeek(today, { weekStartsOn: 1 }),
      6
    );
    const totalDays = weeks * 7;
    const startDate = subDays(endOfCurrentWeek, totalDays - 1);

    const grid: DayCellData[][] = [];

    for (let w = 0; w < weeks; w++) {
      const week: DayCellData[] = [];
      for (let d = 0; d < 7; d++) {
        const dayIndex = w * 7 + d;
        const date = addDays(startDate, dayIndex);
        const dateStr = format(date, 'yyyy-MM-dd');
        const isFuture = dateStr > todayStr;

        week.push({
          date: dateStr,
          completed: completedDates.has(dateStr),
          intensity: isFuture ? 0 : getIntensity(dateStr, completedDates),
          isToday: dateStr === todayStr,
          isFuture,
        });
      }
      grid.push(week);
    }

    return grid;
  }, [completedDates, weeks]);
}
