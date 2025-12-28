/**
 * ChainConnection Utilities
 * Algorithm implementations for streak chain visualization
 */

import {
  format,
  parseISO,
  differenceInDays,
  isBefore,
  isSameDay,
  addDays,
  isAfter,
} from 'date-fns';
import type {
  StreakSegment,
  StreakBreak,
  StreakStrength,
  GridPosition,
  ChainConnection,
  GridData,
  StrengthConfig,
  StreakProgressionGradient,
  BreakIndicatorConfig,
  ConnectionPathType,
  CalendarViewMode,
} from './types';

/**
 * Detect all streak segments from completion data
 *
 * Algorithm:
 * 1. Sort all completed dates chronologically
 * 2. Group consecutive dates into segments
 * 3. Mark final segment as "active" if ends today or yesterday
 *
 * Time Complexity: O(n log n) where n = number of completed dates
 * Space Complexity: O(n)
 */
export function detectStreakSegments(
  completedDates: Set<string>,
  habitCreatedAt?: number,
  endDate: Date = new Date()
): StreakSegment[] {
  if (completedDates.size === 0) {
    return [];
  }

  // Sort all completed dates chronologically
  const sortedDates = [...completedDates].sort();

  const segments: StreakSegment[] = [];
  let currentSegment: string[] = [];
  let segmentId = 0;

  const habitCreatedDate = habitCreatedAt ? new Date(habitCreatedAt) : null;

  for (const dateStr of sortedDates) {
    const date = parseISO(dateStr);

    // Skip dates before habit creation
    if (
      habitCreatedDate &&
      isBefore(date, habitCreatedDate) &&
      !isSameDay(date, habitCreatedDate)
    ) {
      continue;
    }

    // Skip future dates
    if (isAfter(date, endDate)) {
      continue;
    }

    if (currentSegment.length === 0) {
      // Start new segment
      currentSegment.push(dateStr);
    } else {
      // Check if consecutive to previous date
      const prevDateStr = currentSegment.at(-1);
      const prevDate = parseISO(prevDateStr);
      const daysDiff = differenceInDays(date, prevDate);

      if (daysDiff === 1) {
        // Consecutive - extend segment
        currentSegment.push(dateStr);
      } else {
        // Gap found - finalize current segment and start new
        segments.push(createSegment(currentSegment, segmentId++, endDate));
        currentSegment = [dateStr];
      }
    }
  }

  // Add final segment
  if (currentSegment.length > 0) {
    segments.push(createSegment(currentSegment, segmentId, endDate));
  }

  return segments;
}

/**
 * Create a StreakSegment from an array of date strings
 */
function createSegment(
  dates: string[],
  id: number,
  endDate: Date
): StreakSegment {
  const startDate = dates[0];
  const lastDate = dates.at(-1);
  const todayStr = format(endDate, 'yyyy-MM-dd');
  const yesterdayStr = format(addDays(endDate, -1), 'yyyy-MM-dd');

  // Active if ends today or yesterday
  const isActive = lastDate === todayStr || lastDate === yesterdayStr;

  return {
    dates: [...dates],
    endDate: lastDate,
    id: `streak-${id}`,
    isActive,
    length: dates.length,
    startDate,
  };
}

/**
 * Get strength tier based on streak length
 * Aligned with HabitChainVisualizer strength tiers
 */
export function getStrengthTier(streakLength: number): StreakStrength {
  if (streakLength >= 21) return 'legendary-plus';
  if (streakLength >= 14) return 'legendary';
  if (streakLength >= 7) return 'very-strong';
  if (streakLength >= 5) return 'strong';
  if (streakLength >= 3) return 'growing';
  return 'subtle';
}

/**
 * Get visual configuration for a strength tier
 * Aligned with HabitChainVisualizer getStrengthConfig
 */
export function getStrengthConfig(strength: StreakStrength): StrengthConfig {
  switch (strength) {
    case 'legendary-plus': {
      return {
        height: 3,
        maxOpacity: 0.85,
        shimmerSpeed: 1000,
        showShadow: true,
        useAccent: true,
      };
    }
    case 'legendary': {
      return {
        height: 2.7,
        maxOpacity: 0.75,
        shimmerSpeed: 1200,
        showShadow: true,
        useAccent: true,
      };
    }
    case 'very-strong': {
      return {
        height: 2.4,
        maxOpacity: 0.65,
        shimmerSpeed: 1500,
        showShadow: false,
        useAccent: true,
      };
    }
    case 'strong': {
      return {
        height: 2.1,
        maxOpacity: 0.55,
        shimmerSpeed: 2000,
        showShadow: false,
        useAccent: false,
      };
    }
    case 'growing': {
      return {
        height: 1.8,
        maxOpacity: 0.45,
        shimmerSpeed: 0,
        showShadow: false,
        useAccent: false,
      };
    }
    default: {
      // subtle strength or unknown
      return {
        height: 1.5,
        maxOpacity: 0.35,
        shimmerSpeed: 0,
        showShadow: false,
        useAccent: false,
      };
    }
  }
}

/**
 * Calculate grid positions for a set of dates
 * Maps dates to pixel coordinates based on view mode
 */
export function calculateGridPositions(
  dates: string[],
  viewMode: CalendarViewMode,
  gridData: GridData,
  referenceDate: Date = new Date()
): Map<string, GridPosition> {
  const positions = new Map<string, GridPosition>();

  for (const dateStr of dates) {
    const position = calculateSinglePosition(
      dateStr,
      viewMode,
      gridData,
      referenceDate
    );
    if (position) {
      positions.set(dateStr, position);
    }
  }

  return positions;
}

/**
 * Calculate position for a single date
 */
function calculateSinglePosition(
  dateStr: string,
  viewMode: CalendarViewMode,
  gridData: GridData,
  referenceDate: Date
): GridPosition | null {
  const date = parseISO(dateStr);
  const { cellSize, cellGap, labelWidth, headerHeight } = gridData;

  switch (viewMode) {
    case 'week': {
      // Week view: 7 large cells in a row
      const dayOfWeek = date.getDay(); // 0 = Sunday
      const x = dayOfWeek * (cellSize + cellGap) + cellSize / 2;
      const y = cellSize / 2;
      return { primaryIndex: dayOfWeek, secondaryIndex: 0, type: 'week', x, y };
    }

    case 'month': {
      // Month view: 7 columns, up to 6 rows
      const dayOfWeek = date.getDay(); // Column (0-6)
      const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const firstDayOffset = firstOfMonth.getDay();
      const dayOfMonth = date.getDate();
      const row = Math.floor((dayOfMonth - 1 + firstDayOffset) / 7);

      const x = dayOfWeek * (cellSize + cellGap) + cellSize / 2;
      const y = row * (cellSize + cellGap) + cellSize / 2 + headerHeight;
      return {
        primaryIndex: row,
        secondaryIndex: dayOfWeek,
        type: 'month',
        x,
        y,
      };
    }

    case '3m': {
      // 3-month horizontal view: weeks as columns, days as rows
      const dayOfWeek = date.getDay(); // Row (0-6)

      // Calculate week index from 90 days ago
      const startDate = addDays(referenceDate, -90);
      const startSunday = addDays(startDate, -startDate.getDay());
      const weeksDiff = Math.floor(differenceInDays(date, startSunday) / 7);

      if (weeksDiff < 0 || weeksDiff >= gridData.weekCount) {
        return null; // Date outside visible range
      }

      const x = labelWidth + weeksDiff * (cellSize + cellGap) + cellSize / 2;
      const y = dayOfWeek * (cellSize + cellGap) + cellSize / 2;
      return {
        primaryIndex: weeksDiff,
        secondaryIndex: dayOfWeek,
        type: 'horizontal',
        x,
        y,
      };
    }

    case 'year': {
      // Year view: 52+ weeks as columns, days as rows
      const dayOfWeek = date.getDay(); // Row (0-6)
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const startSunday = addDays(startOfYear, -startOfYear.getDay());
      const weeksDiff = Math.floor(differenceInDays(date, startSunday) / 7);

      if (weeksDiff < 0 || weeksDiff >= gridData.weekCount) {
        return null; // Date outside visible range
      }

      const x = labelWidth + weeksDiff * (cellSize + cellGap) + cellSize / 2;
      const y = dayOfWeek * (cellSize + cellGap) + cellSize / 2;
      return {
        primaryIndex: weeksDiff,
        secondaryIndex: dayOfWeek,
        type: 'year',
        x,
        y,
      };
    }

    default: {
      return null;
    }
  }
}

/**
 * Generate connections for streak visualization
 * Creates ChainConnection objects for consecutive completed cells
 */
export function generateConnections(
  segments: StreakSegment[],
  positions: Map<string, GridPosition>
): ChainConnection[] {
  const connections: ChainConnection[] = [];
  let connectionId = 0;

  for (const segment of segments) {
    const strength = getStrengthTier(segment.length);

    // Create connections between consecutive dates in the segment
    for (let i = 0; i < segment.dates.length - 1; i++) {
      const fromDate = segment.dates[i];
      const toDate = segment.dates[i + 1];

      const fromPosition = positions.get(fromDate);
      const toPosition = positions.get(toDate);

      // Skip if either position is not found (outside visible range)
      if (!fromPosition || !toPosition) {
        continue;
      }

      connections.push({
        fromDate,
        fromPosition,
        id: `connection-${connectionId++}`,
        isActive: segment.isActive,
        streakLength: segment.length,
        streakPosition: i + 1,
        strength,
        toDate,
        toPosition,
      });
    }
  }

  return connections;
}

/**
 * Determine the path type for a connection
 */
export function getConnectionPathType(
  connection: ChainConnection
): ConnectionPathType {
  const { fromPosition, toPosition } = connection;

  // Same row, adjacent columns
  if (
    fromPosition.secondaryIndex === toPosition.secondaryIndex &&
    Math.abs(fromPosition.primaryIndex - toPosition.primaryIndex) === 1
  ) {
    return 'horizontal';
  }

  // Same column, adjacent rows
  if (
    fromPosition.primaryIndex === toPosition.primaryIndex &&
    Math.abs(fromPosition.secondaryIndex - toPosition.secondaryIndex) === 1
  ) {
    return 'vertical';
  }

  // Week wrap (Saturday row 6 → Sunday row 0, next column)
  if (
    (fromPosition.type === 'horizontal' || fromPosition.type === 'year') &&
    fromPosition.secondaryIndex === 6 &&
    toPosition.secondaryIndex === 0 &&
    toPosition.primaryIndex === fromPosition.primaryIndex + 1
  ) {
    return 'week-wrap';
  }

  // All other cases (different row AND column)
  return 'diagonal';
}

/**
 * Generate SVG path string for a connection
 */
export function generateConnectionPath(
  connection: ChainConnection,
  cellSize: number
): string {
  const { fromPosition, toPosition } = connection;
  const pathType = getConnectionPathType(connection);

  const fromX = fromPosition.x;
  const fromY = fromPosition.y;
  const toX = toPosition.x;
  const toY = toPosition.y;

  // Offset to start/end at cell edge
  const halfCell = cellSize / 2;

  switch (pathType) {
    case 'horizontal': {
      // Simple horizontal line
      const startX = fromX + halfCell;
      const endX = toX - halfCell;
      return `M ${startX} ${fromY} L ${endX} ${toY}`;
    }

    case 'vertical': {
      // Simple vertical line
      const startY = fromY + halfCell;
      const endY = toY - halfCell;
      return `M ${fromX} ${startY} L ${toX} ${endY}`;
    }

    case 'week-wrap': {
      // Curved path from bottom-right to top-left of next column
      const startX = fromX + halfCell;
      const startY = fromY + halfCell;
      const endX = toX - halfCell;
      const endY = toY - halfCell;

      // Create a smooth curve using quadratic bezier
      const midX = (startX + endX) / 2;
      const controlY = (startY + endY) / 2;

      return `M ${startX} ${startY} Q ${midX} ${controlY} ${endX} ${endY}`;
    }

    default: {
      // diagonal or unknown - L-shaped or curved path for diagonal connections
      const startX = fromX + (toX > fromX ? halfCell : -halfCell);
      const startY = fromY + (toY > fromY ? halfCell : -halfCell);
      const endX = toX + (toX > fromX ? -halfCell : halfCell);
      const endY = toY + (toY > fromY ? -halfCell : halfCell);

      // Use quadratic bezier for smooth curve
      const controlX = startX;
      const controlY = endY;

      return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
    }
  }
}

/**
 * Get default grid data for each view mode
 */
export function getDefaultGridData(viewMode: CalendarViewMode): GridData {
  switch (viewMode) {
    case 'week': {
      return {
        cellGap: 8,
        cellSize: 64,
        headerHeight: 0,
        labelWidth: 0,
        viewMode,
        weekCount: 1,
      };
    }

    case 'month': {
      return {
        cellGap: 4,
        cellSize: 48,
        headerHeight: 32,
        labelWidth: 0,
        viewMode,
        weekCount: 6,
      };
    }

    case '3m': {
      return {
        cellGap: 3,
        cellSize: 20,
        headerHeight: 0,
        labelWidth: 20,
        viewMode,
        weekCount: 13,
      };
    }

    case 'year': {
      return {
        cellGap: 1,
        cellSize: 10,
        headerHeight: 0,
        labelWidth: 20,
        viewMode,
        weekCount: 53,
      };
    }

    default: {
      return {
        cellGap: 3,
        cellSize: 20,
        headerHeight: 0,
        labelWidth: 20,
        viewMode: '3m',
        weekCount: 13,
      };
    }
  }
}

/**
 * Calculate grid dimensions for SVG viewport
 */
export function calculateGridDimensions(gridData: GridData): {
  width: number;
  height: number;
} {
  const { viewMode, weekCount, cellSize, cellGap, headerHeight, labelWidth } =
    gridData;

  switch (viewMode) {
    case 'week': {
      return {
        height: cellSize,
        width: 7 * (cellSize + cellGap) - cellGap,
      };
    }

    case 'month': {
      return {
        height: 6 * (cellSize + cellGap) - cellGap + headerHeight,
        width: 7 * (cellSize + cellGap) - cellGap,
      };
    }

    case '3m':
    case 'year': {
      return {
        height: 7 * (cellSize + cellGap) - cellGap,
        width: labelWidth + weekCount * (cellSize + cellGap) - cellGap,
      };
    }

    default: {
      return { height: 0, width: 0 };
    }
  }
}

/**
 * Default progression gradient configuration
 * Creates a "momentum" effect where streaks grow stronger over time
 */
export const DEFAULT_PROGRESSION_GRADIENT: StreakProgressionGradient = {
  enabled: true,
  endOpacity: 1,
  endSaturation: 1,
  endThickness: 1,
  startOpacity: 0.3,
  startSaturation: 0.4,
  startThickness: 0.7,
};

/**
 * Calculate progression factor for a connection within a streak
 * Returns a value from 0 (start of streak) to 1 (end of streak)
 *
 * @param streakPosition - 1-indexed position within the streak
 * @param streakLength - Total length of the streak
 * @param easingType - Type of easing to apply ('linear' | 'easeIn' | 'easeOut' | 'easeInOut')
 */
export function calculateProgressionFactor(
  streakPosition: number,
  streakLength: number,
  easingType: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' = 'easeOut'
): number {
  // Handle edge cases
  if (streakLength <= 1) return 1;
  if (streakPosition <= 0) return 0;
  if (streakPosition >= streakLength) return 1;

  // Normalize position to 0-1 range
  // streakPosition is 1-indexed and represents the connection number
  // For a 5-day streak, positions 1-4 (4 connections) should map to progression
  const normalizedPosition = (streakPosition - 1) / (streakLength - 1);

  // Apply easing
  switch (easingType) {
    case 'easeIn': {
      return normalizedPosition * normalizedPosition;
    }
    case 'easeOut': {
      return 1 - Math.pow(1 - normalizedPosition, 2);
    }
    case 'easeInOut': {
      return normalizedPosition < 0.5
        ? 2 * normalizedPosition * normalizedPosition
        : 1 - Math.pow(-2 * normalizedPosition + 2, 2) / 2;
    }
    default: {
      // linear easing (default)
      return normalizedPosition;
    }
  }
}

/**
 * Interpolate a value based on progression factor
 */
export function interpolateValue(
  startValue: number,
  endValue: number,
  progressionFactor: number
): number {
  return startValue + (endValue - startValue) * progressionFactor;
}

/**
 * Calculate gradient-adjusted opacity for a connection
 */
export function calculateProgressionOpacity(
  connection: ChainConnection,
  baseOpacity: number,
  gradient: StreakProgressionGradient
): number {
  if (!gradient.enabled) return baseOpacity;

  const progressionFactor = calculateProgressionFactor(
    connection.streakPosition,
    connection.streakLength,
    'easeOut'
  );

  const adjustedOpacity = interpolateValue(
    gradient.startOpacity,
    gradient.endOpacity,
    progressionFactor
  );

  // Combine with base opacity (multiply)
  return baseOpacity * adjustedOpacity;
}

/**
 * Calculate gradient-adjusted thickness for a connection
 */
export function calculateProgressionThickness(
  connection: ChainConnection,
  baseThickness: number,
  gradient: StreakProgressionGradient
): number {
  if (!gradient.enabled) return baseThickness;

  const progressionFactor = calculateProgressionFactor(
    connection.streakPosition,
    connection.streakLength,
    'easeOut'
  );

  const thicknessMultiplier = interpolateValue(
    gradient.startThickness,
    gradient.endThickness,
    progressionFactor
  );

  return baseThickness * thicknessMultiplier;
}

/**
 * Convert hex color to HSL components
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Parse hex to RGB
  const r = Number.parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = Number.parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = Number.parseInt(cleanHex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: {
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      }
      case g: {
        h = ((b - r) / d + 2) / 6;
        break;
      }
      case b: {
        h = ((r - g) / d + 4) / 6;
        break;
      }
    }
  }

  return { h: h * 360, l, s };
}

/**
 * Helper function for HSL to RGB conversion
 */
function hueToRgb(p: number, q: number, t: number): number {
  let tNorm = t;
  if (tNorm < 0) tNorm += 1;
  if (tNorm > 1) tNorm -= 1;
  if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
  if (tNorm < 1 / 2) return q;
  if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
  return p;
}

/**
 * Convert a normalized RGB value (0-1) to hex
 */
function rgbToHexComponent(x: number): string {
  const hex = Math.round(x * 255).toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

/**
 * Convert HSL components to hex color
 */
export function hslToHex(h: number, s: number, l: number): string {
  const hNorm = h / 360;

  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, hNorm + 1 / 3);
    g = hueToRgb(p, q, hNorm);
    b = hueToRgb(p, q, hNorm - 1 / 3);
  }

  return `#${rgbToHexComponent(r)}${rgbToHexComponent(g)}${rgbToHexComponent(b)}`;
}

/**
 * Calculate gradient-adjusted color with saturation interpolation
 */
export function calculateProgressionColor(
  connection: ChainConnection,
  baseColor: string,
  gradient: StreakProgressionGradient
): string {
  if (!gradient.enabled) return baseColor;

  const progressionFactor = calculateProgressionFactor(
    connection.streakPosition,
    connection.streakLength,
    'easeOut'
  );

  const saturationMultiplier = interpolateValue(
    gradient.startSaturation,
    gradient.endSaturation,
    progressionFactor
  );

  // Convert to HSL, adjust saturation, convert back
  const hsl = hexToHSL(baseColor);
  const adjustedSaturation = Math.min(1, hsl.s * saturationMultiplier);

  return hslToHex(hsl.h, adjustedSaturation, hsl.l);
}

/**
 * Default break indicator configuration
 * Uses a muted amber/warning color to indicate broken streaks
 */
export const DEFAULT_BREAK_INDICATOR_CONFIG: BreakIndicatorConfig = {
  enabled: true,
  color: '#f59e0b', // amber-500
  opacity: 0.4,
  thickness: 1.5,
  dashPattern: '4 4',
  showIcon: true,
  iconSize: 12,
};

/**
 * Detect breaks (gaps) between streak segments
 *
 * Algorithm:
 * 1. Iterate through consecutive pairs of segments
 * 2. For each pair, calculate the gap between end of first and start of second
 * 3. Create a StreakBreak object for each gap
 *
 * Time Complexity: O(n) where n = number of segments
 */
export function detectStreakBreaks(
  segments: StreakSegment[],
  positions: Map<string, GridPosition>
): StreakBreak[] {
  if (segments.length < 2) {
    return [];
  }

  const breaks: StreakBreak[] = [];

  for (let i = 0; i < segments.length - 1; i++) {
    const beforeSegment = segments[i];
    const afterSegment = segments[i + 1];

    const beforeDate = beforeSegment.endDate;
    const afterDate = afterSegment.startDate;

    // Calculate gap in days
    const beforeDateObj = parseISO(beforeDate);
    const afterDateObj = parseISO(afterDate);
    const gapDays = differenceInDays(afterDateObj, beforeDateObj) - 1;

    // Get positions for both dates
    const beforePosition = positions.get(beforeDate);
    const afterPosition = positions.get(afterDate);

    breaks.push({
      id: `break-${i}`,
      beforeDate,
      afterDate,
      gapDays,
      beforeSegmentId: beforeSegment.id,
      afterSegmentId: afterSegment.id,
      beforePosition,
      afterPosition,
    });
  }

  return breaks;
}

/**
 * Generate SVG path for a break indicator
 * Creates a dashed line between the two positions
 */
export function generateBreakPath(
  break_: StreakBreak,
  cellSize: number
): string | null {
  const { beforePosition, afterPosition } = break_;

  if (!beforePosition || !afterPosition) {
    return null;
  }

  const fromX = beforePosition.x;
  const fromY = beforePosition.y;
  const toX = afterPosition.x;
  const toY = afterPosition.y;

  const halfCell = cellSize / 2;

  // Determine direction and create appropriate path
  const dx = toX - fromX;
  const dy = toY - fromY;

  // Start from edge of "before" cell, end at edge of "after" cell
  let startX: number;
  let startY: number;
  let endX: number;
  let endY: number;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Mostly horizontal
    startX = fromX + (dx > 0 ? halfCell : -halfCell);
    startY = fromY;
    endX = toX + (dx > 0 ? -halfCell : halfCell);
    endY = toY;
  } else {
    // Mostly vertical
    startX = fromX;
    startY = fromY + (dy > 0 ? halfCell : -halfCell);
    endX = toX;
    endY = toY + (dy > 0 ? -halfCell : halfCell);
  }

  // Use quadratic bezier for a subtle curve (looks more "broken")
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  // Add a slight perpendicular offset for the control point
  const perpX = -(endY - startY) * 0.15;
  const perpY = (endX - startX) * 0.15;

  const controlX = midX + perpX;
  const controlY = midY + perpY;

  return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
}

/**
 * Calculate the center point of a break for icon placement
 */
export function calculateBreakCenter(
  break_: StreakBreak
): { x: number; y: number } | null {
  const { beforePosition, afterPosition } = break_;

  if (!beforePosition || !afterPosition) {
    return null;
  }

  return {
    x: (beforePosition.x + afterPosition.x) / 2,
    y: (beforePosition.y + afterPosition.y) / 2,
  };
}
