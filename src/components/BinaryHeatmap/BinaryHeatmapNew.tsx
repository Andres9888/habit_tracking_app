/**
 * BinaryHeatmap Component
 *
 * Main container component for the GitHub-style binary heatmap.
 * Grid rendering is delegated to InlineHeatmapGrid to maintain file size.
 */

import React, { memo, useState, useMemo, useCallback, useRef } from 'react';
import { View } from 'react-native';

import type { BinaryHeatmapProps, BinaryDay } from './types';
import { HeatmapLegend } from './HeatmapLegend';
import { HeatmapTooltip } from './HeatmapTooltip';
import { HeatmapHeader } from './HeatmapHeader';
import { InlineHeatmapGrid } from './InlineHeatmapGrid';
import { generateBinaryGrid } from './utils';
import { styles } from './BinaryHeatmapNew.styles';
import { createDayLookupMap } from './cellHelpers';
import { useThemeColors } from '@/theme/ThemeContext';

export const BinaryHeatmap = memo(function BinaryHeatmap({
  habitId: _habitId,
  completedDates,
  habitCreatedAt,
  habitColor,
  currentStreak: _currentStreak,
  timeRange = '6m',
  title = 'Activity',
  showCompletionRate = true,
  onDayPress,
}: BinaryHeatmapProps) {
  const { colors, isDark } = useThemeColors();
  const [tooltipDay, setTooltipDay] = useState<BinaryDay | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const gridData = useMemo(
    () => generateBinaryGrid(timeRange, completedDates, habitCreatedAt),
    [timeRange, completedDates, habitCreatedAt]
  );

  const dayLookupMap = useMemo(
    () => createDayLookupMap(gridData.weeks),
    [gridData.weeks]
  );

  const onDayPressRef = useRef(onDayPress);
  onDayPressRef.current = onDayPress;
  const dayLookupMapRef = useRef(dayLookupMap);
  dayLookupMapRef.current = dayLookupMap;

  const handleCellPress = useCallback(
    (date: string, completed: boolean, position?: { x: number; y: number }) => {
      const day = dayLookupMapRef.current.get(date);
      if (day) {
        setTooltipDay(day);
        setTooltipPosition(position ?? { x: 100, y: 50 });
        setTooltipVisible(true);
      }
      onDayPressRef.current?.(date, completed);
    },
    []
  );

  const handleTooltipClose = useCallback(() => {
    setTooltipVisible(false);
    setTooltipDay(null);
  }, []);

  return (
    <View
      accessible
      accessibilityLabel='Habit completion heatmap'
      accessibilityRole='summary'
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.card : '#FFFFFF',
          borderColor: colors.border,
        },
      ]}
    >
      <HeatmapHeader
        habitColor={habitColor}
        showStat={showCompletionRate}
        stats={gridData.stats}
        title={title}
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
        showCompletionRate={false}
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
