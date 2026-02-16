import React, { memo, useState, useMemo, useCallback, useRef } from 'react';
import { View, Text } from 'react-native';

import type { BinaryHeatmapProps, TimeRange, BinaryDay } from './types';
import { HeatmapLegend } from './HeatmapLegend';
import { HeatmapTooltip } from './HeatmapTooltip';
import { TimeRangeToggle } from './TimeRangeToggle';
import { InlineHeatmapGrid } from './InlineHeatmapGrid';
import { generateBinaryGrid } from './utils';
import { styles } from './BinaryHeatmapNew.styles';
import { createDayLookupMap } from './cellHelpers';
import { useHeatmapColors } from './themeAwareColors';

export const BinaryHeatmap = memo(function BinaryHeatmap({
  habitId: _habitId,
  completedDates,
  habitCreatedAt,
  habitColor,
  currentStreak: _currentStreak,
  onDayPress,
  timeRange: controlledTimeRange,
  onTimeRangeChange,
}: BinaryHeatmapProps) {
  const [tooltipDay, setTooltipDay] = useState<BinaryDay | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [internalTimeRange, setInternalTimeRange] = useState<TimeRange>('3m');

  const colors = useHeatmapColors();
  const effectiveTimeRange = controlledTimeRange ?? internalTimeRange;

  const gridData = useMemo(
    () => generateBinaryGrid(effectiveTimeRange, completedDates, habitCreatedAt),
    [completedDates, habitCreatedAt, effectiveTimeRange]
  );

  const dayLookupMap = useMemo(
    () => createDayLookupMap(gridData.weeks),
    [gridData.weeks]
  );

  const onDayPressRef = useRef(onDayPress);
  onDayPressRef.current = onDayPress;
  const dayLookupMapRef = useRef(dayLookupMap);
  dayLookupMapRef.current = dayLookupMap;

  const handleCellPress = useCallback((date: string, completed: boolean, cellPosition: { x: number; y: number }) => {
    const day = dayLookupMapRef.current.get(date);
    if (day) {
      setTooltipDay(day);
      setTooltipPosition({ x: cellPosition.x, y: cellPosition.y });
      setTooltipVisible(true);
    }
    onDayPressRef.current?.(date, completed);
  }, []);

  const handleTooltipClose = useCallback(() => {
    setTooltipVisible(false);
    setTooltipDay(null);
  }, []);

  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    onTimeRangeChange?.(range);
    if (controlledTimeRange === undefined) {
      setInternalTimeRange(range);
    }
  }, [controlledTimeRange, onTimeRangeChange]);

  return (
    <View
      accessible
      accessibilityLabel='Habit completion heatmap'
      accessibilityRole='summary'
      style={{ ...styles.container, backgroundColor: '#ffffff' }}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Activity</Text>
        <TimeRangeToggle value={effectiveTimeRange} onChange={handleTimeRangeChange} />
      </View>
      <View accessibilityLabel='Habit completion heatmap grid' style={styles.gridWrapper}>
        <InlineHeatmapGrid
          habitColor={habitColor}
          monthLabels={gridData.monthLabels}
          weeks={gridData.weeks}
          onCellPress={handleCellPress}
        />
      </View>
      <HeatmapLegend
        completionRate={gridData.stats.completionRate}
        habitColor={habitColor}
      />
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

export default BinaryHeatmap;
