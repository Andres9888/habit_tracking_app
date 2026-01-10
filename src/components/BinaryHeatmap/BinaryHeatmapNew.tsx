/**
 * BinaryHeatmap Component
 *
 * Main container component for the GitHub-style binary heatmap.
 * Grid rendering is delegated to InlineHeatmapGrid to maintain file size.
 */

import React, { memo, useState, useMemo, useCallback, useRef } from 'react';
import { View, Text } from 'react-native';

import type { BinaryHeatmapProps, TimeRange, BinaryDay } from './types';
import { HeatmapLegend } from './HeatmapLegend';
import { HeatmapTooltip } from './HeatmapTooltip';
import { InlineHeatmapGrid } from './InlineHeatmapGrid';
import { generateBinaryGrid } from './utils';
import { styles } from './BinaryHeatmapNew.styles';
import { createDayLookupMap } from './cellHelpers';

const FIXED_TIME_RANGE: TimeRange = '6m';

export const BinaryHeatmap = memo(function BinaryHeatmap({
  habitId: _habitId,
  completedDates,
  habitCreatedAt,
  habitColor,
  currentStreak: _currentStreak,
  onDayPress,
}: BinaryHeatmapProps) {
  const [tooltipDay, setTooltipDay] = useState<BinaryDay | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const gridData = useMemo(
    () => generateBinaryGrid(FIXED_TIME_RANGE, completedDates, habitCreatedAt),
    [completedDates, habitCreatedAt]
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>
      <View style={styles.gridWrapper}>
        <InlineHeatmapGrid
          habitColor={habitColor}
          monthLabels={gridData.monthLabels}
          weeks={gridData.weeks}
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
