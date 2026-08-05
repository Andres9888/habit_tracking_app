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
import { colors as palette } from '@/theme/colors';
import { DEFAULT_TOOLTIP_POSITION } from './constants';

export const BinaryHeatmap = memo(function BinaryHeatmap({
  habitId: _habitId,
  completedDates,
  habitCreatedAt,
  habitColor,
  currentStreak: _currentStreak,
  timeRange = '6m',
  title = 'Activity',
  showCompletionRate = true,
  compact = false,
  onDayPress,
}: BinaryHeatmapProps) {
  const { colors, isDark } = useThemeColors();
  const [tooltipDay, setTooltipDay] = useState<BinaryDay | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState(
    DEFAULT_TOOLTIP_POSITION
  );
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
        setTooltipPosition(position ?? DEFAULT_TOOLTIP_POSITION);
        setTooltipVisible(true);
      }
      onDayPressRef.current?.(date, completed);
    },
    []
  );

  return (
    <View
      accessible
      accessibilityLabel='Habit completion heatmap'
      accessibilityRole='summary'
      style={[
        styles.container,
        compact && { paddingBottom: 12, paddingTop: 12 },
        {
          backgroundColor: isDark ? colors.card : palette.light.surfaceMuted,
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
      <View style={[styles.gridWrapper, compact && { marginTop: 8 }]}>
        <InlineHeatmapGrid
          habitColor={habitColor}
          monthLabels={gridData.monthLabels}
          onCellPress={handleCellPress}
          weeks={gridData.weeks}
        />
      </View>
      {compact ? null : (
        <HeatmapLegend
          completionRate={gridData.stats.completionRate}
          habitColor={habitColor}
          showCompletionRate={false}
        />
      )}
      {tooltipDay ? (
        <HeatmapTooltip
          day={tooltipDay}
          position={tooltipPosition}
          visible={tooltipVisible}
          onClose={() => {
            setTooltipVisible(false);
            setTooltipDay(null);
          }}
        />
      ) : null}
    </View>
  );
});
