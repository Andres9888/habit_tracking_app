/**
 * BinaryHeatmap Component
 *
 * Main container component for the GitHub-style binary heatmap.
 * Composes the header (with time range toggle), grid, legend, and tooltip
 * to create a complete habit completion visualization.
 *
 * This component manages:
 * - Time range state (3m, 6m, 1y)
 * - Grid data generation
 * - Tooltip visibility and positioning
 * - Day press event propagation
 */

import React, { memo, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import type { BinaryHeatmapProps, TimeRange, BinaryDay } from './types';
import { BinaryHeatmapGrid } from './BinaryHeatmapGrid';
import { TimeRangeToggle } from './TimeRangeToggle';
import { HeatmapLegend } from './HeatmapLegend';
import { HeatmapTooltip } from './HeatmapTooltip';
import { generateBinaryGrid } from './utils';
import { COLORS } from './constants';

/**
 * Default time range for initial render
 */
const DEFAULT_TIME_RANGE: TimeRange = '3m';

/**
 * BinaryHeatmap - A GitHub-style binary (on/off) heatmap for habit tracking
 *
 * This component displays habit completion data in a grid format where:
 * - Each cell represents a day
 * - Completed days show in the habit's accent color
 * - Missed days show in gray
 * - Today has a ring outline
 * - Future days are faded
 *
 * Features:
 * - Time range toggle (3 months, 6 months, 1 year)
 * - Month labels above the grid
 * - Day-of-week labels on the left
 * - Completion statistics legend
 * - Tooltip on cell tap showing date and status
 * - Staggered load animation
 * - Full accessibility support
 */
export const BinaryHeatmap = memo(function BinaryHeatmap({
  completedDates,
  habitCreatedAt,
  habitColor,
  timeRange: controlledTimeRange,
  onDayPress,
  onTimeRangeChange,
}: BinaryHeatmapProps) {
  // Time range state - use controlled value if provided, otherwise internal state
  const [internalTimeRange, setInternalTimeRange] =
    useState<TimeRange>(DEFAULT_TIME_RANGE);
  const timeRange = controlledTimeRange ?? internalTimeRange;

  // Tooltip state
  const [tooltipDay, setTooltipDay] = useState<BinaryDay | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Generate grid data based on time range and completed dates
  const gridData = useMemo(
    () => generateBinaryGrid(timeRange, completedDates, habitCreatedAt),
    [timeRange, completedDates, habitCreatedAt]
  );

  // Handle time range change
  const handleTimeRangeChange = useCallback(
    (newRange: TimeRange) => {
      // Update internal state if not controlled
      if (controlledTimeRange === undefined) {
        setInternalTimeRange(newRange);
      }
      // Always call callback if provided
      onTimeRangeChange?.(newRange);
    },
    [controlledTimeRange, onTimeRangeChange]
  );

  // Handle cell press - show tooltip and propagate event
  const handleCellPress = useCallback(
    (date: string, completed: boolean) => {
      // Find the day data for the pressed cell
      const day = gridData.weeks
        .flat()
        .find((d): d is BinaryDay => d !== null && d.date === date);

      if (day) {
        // Show tooltip for the pressed cell
        // Position will be updated by the cell's onLayout or measure
        setTooltipDay(day);
        setTooltipPosition({ x: 100, y: 50 }); // Default position, updated by cell
        setTooltipVisible(true);
      }

      // Propagate the press event to parent
      onDayPress?.(date, completed);
    },
    [gridData.weeks, onDayPress]
  );

  // Close tooltip
  const handleTooltipClose = useCallback(() => {
    setTooltipVisible(false);
    setTooltipDay(null);
  }, []);

  return (
    <View
      accessible
      accessibilityLabel='Habit completion heatmap'
      accessibilityRole='summary'
      style={styles.container}
    >
      {/* Header row: Activity label + Time range toggle */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
        <TimeRangeToggle value={timeRange} onChange={handleTimeRangeChange} />
      </View>

      {/* Main grid */}
      <View style={styles.gridWrapper}>
        <BinaryHeatmapGrid
          gridData={gridData}
          habitColor={habitColor}
          onCellPress={handleCellPress}
        />
      </View>

      {/* Legend row */}
      <HeatmapLegend
        completionRate={gridData.stats.completionRate}
        habitColor={habitColor}
      />

      {/* Tooltip (rendered conditionally) */}
      {tooltipDay && (
        <HeatmapTooltip
          day={tooltipDay}
          position={tooltipPosition}
          visible={tooltipVisible}
          onClose={handleTooltipClose}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 16,
  },
  gridWrapper: {
    marginTop: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BinaryHeatmap;
