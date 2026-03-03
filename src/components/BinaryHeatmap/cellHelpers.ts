/**
 * Helper functions for BinaryHeatmap cell rendering
 */

import type { BinaryDay } from './types';
import { getHeatmapColors } from './constants';

/**
 * Determines the background color for a heatmap cell
 */
export function getCellBackgroundColor(
  day: BinaryDay | null,
  habitColor: string,
  isDark = false
): string {
  const hColors = getHeatmapColors(isDark);
  if (day === null) {
    return 'transparent';
  }
  if (day.isBeforeCreation) {
    return hColors.CELL_BEFORE_CREATION;
  }
  if (day.isFuture) {
    return hColors.CELL_FUTURE;
  }
  if (day.completed) {
    return habitColor;
  }
  return hColors.CELL_EMPTY;
}

/**
 * Transforms week-based data to row-based for rendering
 * weeks[weekIndex][dayIndex] -> rows[dayIndex][weekIndex]
 */
export function transformWeeksToRows(
  weeks: (BinaryDay | null)[][],
  rowCount: number
): (BinaryDay | null)[][] {
  const result: (BinaryDay | null)[][] = [];
  for (let dayIndex = 0; dayIndex < rowCount; dayIndex++) {
    result[dayIndex] = [];
  }
  for (const week of weeks) {
    for (let dayIndex = 0; dayIndex < rowCount; dayIndex++) {
      result[dayIndex].push(week[dayIndex] ?? null);
    }
  }
  return result;
}

/**
 * Creates a lookup map for days by date string
 */
export function createDayLookupMap(
  weeks: (BinaryDay | null)[][]
): Map<string, BinaryDay> {
  const map = new Map<string, BinaryDay>();
  for (const week of weeks) {
    for (const day of week) {
      if (day !== null) {
        map.set(day.date, day);
      }
    }
  }
  return map;
}
