/**
 * BinaryHeatmap Grid Generation
 *
 * Core grid generation for the GitHub-style binary heatmap.
 */

import {
  format,
  isAfter,
  isBefore,
  isSameDay,
  startOfWeek,
  startOfDay,
  addDays,
  subDays,
} from 'date-fns';

import type {
  TimeRange,
  BinaryDay,
  BinaryMonthLabel,
  BinaryGridData,
} from './types';
import { TIME_RANGE_CONFIG } from './constants';
import { calculateBinaryGridStats } from './gridStats';

/** Get the number of days for a given time range */
export function getTimeRangeDays(timeRange: TimeRange): number {
  return TIME_RANGE_CONFIG[timeRange].days;
}

/** Generate the binary heatmap grid for a given time range */
export function generateBinaryGrid(
  timeRange: TimeRange,
  completedDates: Set<string>,
  habitCreatedAt?: number,
  currentDate: Date = new Date()
): BinaryGridData {
  const today = startOfDay(currentDate);
  const todayStr = format(today, 'yyyy-MM-dd');
  const daysToShow = getTimeRangeDays(timeRange);
  const endDate = today;
  const startDate = subDays(today, daysToShow - 1);
  const gridStartDate = startOfWeek(startDate, { weekStartsOn: 0 });
  const habitCreatedDate = habitCreatedAt
    ? startOfDay(new Date(habitCreatedAt))
    : null;

  const weeks: (BinaryDay | null)[][] = [];
  const monthLabels: BinaryMonthLabel[] = [];
  let currentWeek: (BinaryDay | null)[] = [];
  let weekIndex = 0;
  let lastMonth = -1;
  let iterDate = new Date(gridStartDate);

  while (iterDate <= endDate) {
    const dayOfWeek = iterDate.getDay();
    const dateStr = format(iterDate, 'yyyy-MM-dd');
    const isInRange = iterDate >= startDate && iterDate <= endDate;
    const isToday = dateStr === todayStr;
    const isFuture = isAfter(iterDate, today) && !isToday;
    const hasCompletionData = completedDates.has(dateStr);
    const isBeforeCreation = habitCreatedDate
      ? isBefore(iterDate, habitCreatedDate) &&
        !isSameDay(iterDate, habitCreatedDate) &&
        !hasCompletionData
      : false;

    if (isInRange) {
      const currentMonth = iterDate.getMonth();
      if (currentMonth !== lastMonth) {
        monthLabels.push({ label: format(iterDate, 'MMM'), weekIndex });
        lastMonth = currentMonth;
      }
      currentWeek[dayOfWeek] = {
        completed: completedDates.has(dateStr),
        date: dateStr,
        isBeforeCreation,
        isFuture,
        isToday,
      };
    } else if (iterDate < startDate) {
      currentWeek[dayOfWeek] = null;
    }

    if (dayOfWeek === 6) {
      for (let i = 0; i < 7; i++) {
        if (currentWeek[i] === undefined) currentWeek[i] = null;
      }
      weeks.push([...currentWeek]);
      currentWeek = [];
      weekIndex++;
    }
    iterDate = addDays(iterDate, 1);
  }

  if (currentWeek.length > 0) {
    for (let i = 0; i < 7; i++) {
      if (currentWeek[i] === undefined) currentWeek[i] = null;
    }
    weeks.push([...currentWeek]);
  }

  return { monthLabels, stats: calculateBinaryGridStats(weeks), weeks };
}
