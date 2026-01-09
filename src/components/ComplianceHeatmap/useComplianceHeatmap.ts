/**
 * Hook for ComplianceHeatmap data transformation
 */

import { useMemo } from 'react';
import type { HeatmapData, MonthLabel } from './ComplianceHeatmap.types';
import { MONTH_NAMES } from './ComplianceHeatmap.constants';

const EMPTY_DAY: HeatmapData = {
  completedHabits: 0,
  completionRate: 0,
  date: '',
  level: 'none',
  totalHabits: 0,
};

export function useComplianceHeatmap(data: HeatmapData[] | null) {
  const weeks = useMemo(() => {
    if (!data) return [];

    const weeksData: HeatmapData[][] = [];
    let currentWeek: HeatmapData[] = [];

    const firstDate = new Date(data[0].date);
    const firstDayOfWeek = firstDate.getDay();

    // Add empty cells for days before the first data point
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ ...EMPTY_DAY });
    }

    for (const day of data) {
      currentWeek.push(day);

      if (currentWeek.length === 7) {
        weeksData.push(currentWeek);
        currentWeek = [];
      }
    }

    // Add remaining days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ ...EMPTY_DAY });
      }
      weeksData.push(currentWeek);
    }

    return weeksData;
  }, [data]);

  const monthLabels = useMemo(() => {
    if (!data || data.length === 0) return [];

    const labels: MonthLabel[] = [];
    let currentMonth = -1;

    for (const [weekIndex, week] of weeks.entries()) {
      const validDay = week.find((day) => day.date);
      if (validDay) {
        const date = new Date(validDay.date);
        const month = date.getMonth();
        if (month !== currentMonth) {
          currentMonth = month;
          labels.push({
            month: MONTH_NAMES[month],
            weekIndex,
          });
        }
      }
    }

    return labels;
  }, [weeks, data]);

  return { monthLabels, weeks };
}
