/**
 * ChainConnection Utilities
 * Algorithm implementations for streak chain visualization
 */

import { format, parseISO, differenceInDays, isBefore, isSameDay, addDays, isAfter } from 'date-fns';
import type {
  StreakSegment,
  StreakStrength,
  GridPosition,
  ChainConnection,
  GridData,
  StrengthConfig,
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
  const sortedDates = Array.from(completedDates).sort();

  const segments: StreakSegment[] = [];
  let currentSegment: string[] = [];
  let segmentId = 0;

  const habitCreatedDate = habitCreatedAt ? new Date(habitCreatedAt) : null;

  for (const dateStr of sortedDates) {
    const date = parseISO(dateStr);

    // Skip dates before habit creation
    if (habitCreatedDate && isBefore(date, habitCreatedDate) && !isSameDay(date, habitCreatedDate)) {
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
      const prevDateStr = currentSegment[currentSegment.length - 1];
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
function createSegment(dates: string[], id: number, endDate: Date): StreakSegment {
  const startDate = dates[0];
  const lastDate = dates[dates.length - 1];
  const lastDateParsed = parseISO(lastDate);
  const todayStr = format(endDate, 'yyyy-MM-dd');
  const yesterdayStr = format(addDays(endDate, -1), 'yyyy-MM-dd');

  // Active if ends today or yesterday
  const isActive = lastDate === todayStr || lastDate === yesterdayStr;

  return {
    id: `streak-${id}`,
    startDate,
    endDate: lastDate,
    length: dates.length,
    dates: [...dates],
    isActive,
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
    case 'legendary-plus':
      return { height: 3, maxOpacity: 0.85, shimmerSpeed: 1000, useAccent: true, showShadow: true };
    case 'legendary':
      return { height: 2.7, maxOpacity: 0.75, shimmerSpeed: 1200, useAccent: true, showShadow: true };
    case 'very-strong':
      return { height: 2.4, maxOpacity: 0.65, shimmerSpeed: 1500, useAccent: true, showShadow: false };
    case 'strong':
      return { height: 2.1, maxOpacity: 0.55, shimmerSpeed: 2000, useAccent: false, showShadow: false };
    case 'growing':
      return { height: 1.8, maxOpacity: 0.45, shimmerSpeed: 0, useAccent: false, showShadow: false };
    case 'subtle':
    default:
      return { height: 1.5, maxOpacity: 0.35, shimmerSpeed: 0, useAccent: false, showShadow: false };
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
    const position = calculateSinglePosition(dateStr, viewMode, gridData, referenceDate);
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
      return { type: 'week', primaryIndex: dayOfWeek, secondaryIndex: 0, x, y };
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
      return { type: 'month', primaryIndex: row, secondaryIndex: dayOfWeek, x, y };
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
      return { type: 'horizontal', primaryIndex: weeksDiff, secondaryIndex: dayOfWeek, x, y };
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
      return { type: 'year', primaryIndex: weeksDiff, secondaryIndex: dayOfWeek, x, y };
    }

    default:
      return null;
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
        id: `connection-${connectionId++}`,
        fromDate,
        toDate,
        fromPosition,
        toPosition,
        streakPosition: i + 1,
        streakLength: segment.length,
        strength,
        isActive: segment.isActive,
      });
    }
  }

  return connections;
}

/**
 * Determine the path type for a connection
 */
export function getConnectionPathType(connection: ChainConnection): ConnectionPathType {
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

    case 'diagonal':
    default: {
      // L-shaped or curved path for diagonal connections
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
    case 'week':
      return {
        viewMode,
        weekCount: 1,
        cellSize: 64,
        cellGap: 8,
        headerHeight: 0,
        labelWidth: 0,
      };

    case 'month':
      return {
        viewMode,
        weekCount: 6,
        cellSize: 48,
        cellGap: 4,
        headerHeight: 32,
        labelWidth: 0,
      };

    case '3m':
      return {
        viewMode,
        weekCount: 13,
        cellSize: 20,
        cellGap: 3,
        headerHeight: 0,
        labelWidth: 20,
      };

    case 'year':
      return {
        viewMode,
        weekCount: 53,
        cellSize: 10,
        cellGap: 1,
        headerHeight: 0,
        labelWidth: 20,
      };

    default:
      return {
        viewMode: '3m',
        weekCount: 13,
        cellSize: 20,
        cellGap: 3,
        headerHeight: 0,
        labelWidth: 20,
      };
  }
}

/**
 * Calculate grid dimensions for SVG viewport
 */
export function calculateGridDimensions(
  gridData: GridData
): { width: number; height: number } {
  const { viewMode, weekCount, cellSize, cellGap, headerHeight, labelWidth } = gridData;

  switch (viewMode) {
    case 'week':
      return {
        width: 7 * (cellSize + cellGap) - cellGap,
        height: cellSize,
      };

    case 'month':
      return {
        width: 7 * (cellSize + cellGap) - cellGap,
        height: 6 * (cellSize + cellGap) - cellGap + headerHeight,
      };

    case '3m':
    case 'year':
      return {
        width: labelWidth + weekCount * (cellSize + cellGap) - cellGap,
        height: 7 * (cellSize + cellGap) - cellGap,
      };

    default:
      return { width: 0, height: 0 };
  }
}
