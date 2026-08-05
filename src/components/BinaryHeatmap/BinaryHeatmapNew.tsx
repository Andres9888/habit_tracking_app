/**
 * BinaryHeatmap Component
 *
 * Main container component for the GitHub-style binary heatmap.
 * Grid rendering is delegated to InlineHeatmapGrid to maintain file size.
 */

import React, { memo, useState, useMemo, useCallback, useRef } from 'react';
import { View, Text } from 'react-native';

import type { BinaryHeatmapProps, BinaryDay, TimeRange } from './types';
import { HeatmapLegend } from './HeatmapLegend';
import { HeatmapTooltip } from './HeatmapTooltip';
import { InlineHeatmapGrid } from './InlineHeatmapGrid';
import { TimeRangeToggle } from './TimeRangeToggle';
import { generateBinaryGrid } from './utils';
import { styles } from './BinaryHeatmapNew.styles';
import { createDayLookupMap } from './cellHelpers';

export const BinaryHeatmap = memo(function BinaryHeatmap({
  habitId: _habitId,
  completedDates,
  habitCreatedAt,
  habitColor,
  currentStreak: _currentStreak,
  timeRange: controlledTimeRange,
  title = 'Activity',
  showCompletionRate = true,
  onDayPress,
  onTimeRangeChange,
}: BinaryHeatmapProps) {
  const [tooltipDay, setTooltipDay] = useState<BinaryDay | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [internalTimeRange, setInternalTimeRange] = useState<TimeRange>(
    controlledTimeRange ?? '3m'
  );
  const activeTimeRange = controlledTimeRange ?? internalTimeRange;

  const gridData = useMemo(
    () => generateBinaryGrid(activeTimeRange, completedDates, habitCreatedAt),
    [activeTimeRange, completedDates, habitCreatedAt]
  );

  const dayLookupMap = useMemo(
    () => createDayLookupMap(gridData.weeks),
    [gridData.weeks]
  );

  const onDayPressRef = useRef(onDayPress);
  onDayPressRef.current = onDayPress;
  const dayLookupMapRef = useRef(dayLookupMap);
  dayLookupMapRef.current = dayLookupMap;

  const handleCellPress = useCallback((date: string, completed: boolean) => {
    const day = dayLookupMapRef.current.get(date);
    if (day) {
      setTooltipDay(day);
      setTooltipPosition({ x: 100, y: 50 });
      setTooltipVisible(true);
    }
    onDayPressRef.current?.(date, completed);
  }, []);

  const handleTooltipClose = useCallback(() => {
    setTooltipVisible(false);
    setTooltipDay(null);
  }, []);

  const handleTimeRangeChange = useCallback(
    (nextRange: TimeRange) => {
      if (controlledTimeRange === undefined) {
        setInternalTimeRange(nextRange);
      }

      onTimeRangeChange?.(nextRange);
    },
    [controlledTimeRange, onTimeRangeChange]
  );

  return (
    <View
      accessible
      accessibilityLabel='Habit completion heatmap'
      accessibilityRole='summary'
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <TimeRangeToggle
        value={activeTimeRange}
        onChange={handleTimeRangeChange}
      />
      <View style={styles.gridWrapper}>
        <InlineHeatmapGrid
          habitColor={habitColor}
          monthLabels={gridData.monthLabels}
          onCellPress={handleCellPress}
          weeks={gridData.weeks}
        />
      </View>
      <HeatmapLegend
        completionRate={gridData.stats.completionRate}
        habitColor={habitColor}
        showCompletionRate={showCompletionRate}
      />
      {tooltipDay ? (
        <HeatmapTooltip
          day={tooltipDay}
          position={tooltipPosition}
          visible={tooltipVisible}
          onClose={handleTooltipClose}
        />
      ) : null}
    </View>
  );
});

export default BinaryHeatmap;
