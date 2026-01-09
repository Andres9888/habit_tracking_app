/**
 * BinaryHeatmap Component
 *
 * Main container component for the GitHub-style binary heatmap.
 * Grid rendering is inline to avoid Metro caching issues with child components.
 */

import React, { memo, useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';

import type { BinaryHeatmapProps, TimeRange, BinaryDay } from './types';
import { HeatmapLegend } from './HeatmapLegend';
import { HeatmapTooltip } from './HeatmapTooltip';
import { generateBinaryGrid } from './utils';
import { CELL_SIZE, CELL_GAP, GRID } from './constants';
import { styles } from './BinaryHeatmapNew.styles';
import {
  getCellBackgroundColor,
  transformWeeksToRows,
  createDayLookupMap,
} from './cellHelpers';

const FIXED_TIME_RANGE: TimeRange = '6m';
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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

  const rows = useMemo(
    () => transformWeeksToRows(gridData.weeks, GRID.ROWS),
    [gridData.weeks]
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

  const gridContentWidth = gridData.weeks.length * (CELL_SIZE + CELL_GAP);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>
      <View style={styles.gridWrapper}>
        <View style={styles.gridContainer}>
          <View style={styles.dayLabelsColumn}>
            <View style={styles.monthLabelSpacer} />
            {DAY_LABELS.map((label, index) => (
              <View key={`label-${index}`} style={styles.dayLabelCell}>
                <Text style={styles.dayLabelText}>{label}</Text>
              </View>
            ))}
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={{ width: gridContentWidth }}
            showsHorizontalScrollIndicator={false}
          >
            <View>
              <View style={styles.monthLabelsRow}>
                {gridData.monthLabels.map((ml, i) => (
                  <Text
                    key={`month-${i}`}
                    style={[
                      styles.monthLabel,
                      { left: ml.weekIndex * (CELL_SIZE + CELL_GAP) },
                    ]}
                  >
                    {ml.label}
                  </Text>
                ))}
              </View>
              {rows.map((row, dayIndex) => (
                <View key={`row-${dayIndex}`} style={styles.gridRow}>
                  {row.map((day, weekIndex) => (
                    <View
                      key={day?.date ?? `empty-${dayIndex}-${weekIndex}`}
                      style={[
                        styles.cell,
                        {
                          backgroundColor: getCellBackgroundColor(
                            day,
                            habitColor
                          ),
                          borderColor: day?.isToday
                            ? habitColor
                            : 'transparent',
                          borderWidth: day?.isToday ? 2 : 0,
                          opacity: day?.isFuture ? 0.4 : 1,
                        },
                      ]}
                    />
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
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
