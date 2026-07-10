/**
 * Helper functions for BinaryHeatmap cell rendering
 */

import type { BinaryDay } from './types';
import { hexToRgba } from './MonthlyCalendarGrid/colors';
import { colors } from '@/theme/colors';
import { CELL_SIZE } from './constants';

/**
 * Alpha applied to the habit color for "missed" (eligible, not completed) cells.
 * HabitKit-style: empty days are a faint tint of the habit color — not gray — so
 * the whole grid reads as one cohesive color field. Brighter in dark mode so the
 * tint stays visible against the dark card surface.
 */
const MISSED_TINT_ALPHA_LIGHT = 0.15;
const MISSED_TINT_ALPHA_DARK = 0.25;

/**
 * Faint neutral fill for days before the habit existed. Kept visible (not
 * transparent) so the grid reads as a complete rectangle of boxes — like
 * HabitKit — while staying clearly fainter and un-tinted vs. "missed" days.
 */
const BEFORE_CREATION_LIGHT = 'rgba(0, 0, 0, 0.05)';
const BEFORE_CREATION_DARK = 'rgba(255, 255, 255, 0.06)';

/**
 * Determines the background color for a heatmap cell.
 *
 * Cells are monochromatic — every state is derived from the habit's own color:
 * - done            → solid habit color
 * - missed / future → faint tint of the habit color (future is further dimmed
 *                      via opacity by the renderer)
 * - beforeCreation  → faint neutral box (visible placeholder, no habit tint)
 * - null padding    → transparent
 *
 * @param isDark - current theme; controls tint strength for visibility
 */
export function getCellBackgroundColor(
  day: BinaryDay | null,
  habitColor: string,
  isDark: boolean = false
): string {
  if (day === null) {
    return 'transparent';
  }
  if (day.isBeforeCreation) {
    return isDark ? BEFORE_CREATION_DARK : BEFORE_CREATION_LIGHT;
  }
  if (day.completed) {
    return habitColor;
  }
  const alpha = isDark ? MISSED_TINT_ALPHA_DARK : MISSED_TINT_ALPHA_LIGHT;
  return hexToRgba(habitColor, alpha);
}

/**
 * Shape-specific style overrides for the year strip's chain rendering.
 * Only borderRadius/border — background color still comes from
 * getCellBackgroundColor above. No connector at this 13px scale (see spec).
 */
export function getChainCellShapeStyle(
  day: BinaryDay | null,
  isDark: boolean
): {
  borderRadius: number;
  borderStyle?: 'dashed';
  borderColor?: string;
  borderWidth?: number;
} {
  const missed = Boolean(
    day &&
    !day.completed &&
    !day.isFuture &&
    !day.isBeforeCreation &&
    !day.isToday
  );
  return {
    borderRadius: CELL_SIZE / 2,
    ...(missed
      ? {
          borderStyle: 'dashed',
          borderColor: isDark ? colors.gray[500] : colors.gray[300],
          borderWidth: 1.5,
        }
      : {}),
  };
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
