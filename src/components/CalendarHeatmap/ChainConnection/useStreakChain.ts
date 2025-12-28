/**
 * useStreakChain Hook
 * Manages streak chain visualization state and calculations
 */

import { useMemo } from 'react';
import type {
  StreakSegment,
  ChainConnection,
  GridPosition,
  UseStreakChainReturn,
  CalendarViewMode,
} from './types';
import {
  detectStreakSegments,
  calculateGridPositions,
  generateConnections,
  getDefaultGridData,
} from './utils';

interface UseStreakChainOptions {
  /** Set of completed dates in YYYY-MM-DD format */
  completedDates: Set<string>;
  /** Current calendar view mode */
  viewMode: CalendarViewMode;
  /** Habit creation timestamp */
  habitCreatedAt?: number;
  /** Reference date for calculations (default: today) */
  referenceDate?: Date;
}

/**
 * Hook to manage streak chain visualization
 *
 * Usage:
 * ```tsx
 * const {
 *   segments,
 *   connections,
 *   activeStreak,
 *   longestStreak,
 *   positions,
 * } = useStreakChain({
 *   completedDates,
 *   viewMode: '3m',
 *   habitCreatedAt: habit.createdAt,
 * });
 * ```
 *
 * Features:
 * - Detects all streak segments in completion data
 * - Calculates grid positions for each date
 * - Generates connections between consecutive completed cells
 * - Identifies active and longest streaks
 * - Memoized for performance
 */
export function useStreakChain({
  completedDates,
  viewMode,
  habitCreatedAt,
  referenceDate = new Date(),
}: UseStreakChainOptions): UseStreakChainReturn {
  // Detect all streak segments
  const segments = useMemo(
    () => detectStreakSegments(completedDates, habitCreatedAt, referenceDate),
    [completedDates, habitCreatedAt, referenceDate]
  );

  // Get all dates that need positions
  const allDates = useMemo(
    () => segments.flatMap((segment) => segment.dates),
    [segments]
  );

  // Get grid data for current view mode
  const gridData = useMemo(() => getDefaultGridData(viewMode), [viewMode]);

  // Calculate positions for all dates
  const positions = useMemo(
    () => calculateGridPositions(allDates, viewMode, gridData, referenceDate),
    [allDates, viewMode, gridData, referenceDate]
  );

  // Generate connections between consecutive cells
  const connections = useMemo(
    () => generateConnections(segments, positions),
    [segments, positions]
  );

  // Find the active streak (if any)
  const activeStreak = useMemo(
    () => segments.find((segment) => segment.isActive) || null,
    [segments]
  );

  // Find the longest streak
  const longestStreak = useMemo(() => {
    if (segments.length === 0) return null;
    return segments.reduce((longest, current) =>
      current.length > longest.length ? current : longest
    );
  }, [segments]);

  return {
    segments,
    connections,
    activeStreak,
    longestStreak,
    positions,
  };
}

export default useStreakChain;
