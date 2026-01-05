/**
 * BinaryHeatmap Component
 *
 * Main container component for the GitHub-style binary heatmap.
 * Grid rendering is inline to avoid Metro caching issues with child components.
 */

import React, { memo, useState, useMemo, useCallback, useRef } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';

import type { BinaryHeatmapProps, TimeRange, BinaryDay } from './types';
import { HeatmapLegend } from './HeatmapLegend';
import { HeatmapTooltip } from './HeatmapTooltip';
import { generateBinaryGrid } from './utils';
import { COLORS, CELL_SIZE, CELL_GAP, DAY_LABEL_WIDTH, GRID, MONTH_LABEL } from './constants';

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

  // Transform weeks to rows (day-of-week based)
  const rows = useMemo(() => {
    const result: (BinaryDay | null)[][] = [];
    for (let dayIndex = 0; dayIndex < GRID.ROWS; dayIndex++) {
      result[dayIndex] = [];
    }
    for (const week of gridData.weeks) {
      for (let dayIndex = 0; dayIndex < GRID.ROWS; dayIndex++) {
        result[dayIndex].push(week[dayIndex] ?? null);
      }
    }
    return result;
  }, [gridData.weeks]);

  const dayLookupMap = useMemo(() => {
    const map = new Map<string, BinaryDay>();
    for (const week of gridData.weeks) {
      for (const day of week) {
        if (day !== null) {
          map.set(day.date, day);
        }
      }
    }
    return map;
  }, [gridData.weeks]);

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

  // Calculate grid width
  const gridContentWidth = gridData.weeks.length * (CELL_SIZE + CELL_GAP);

  return (
    <View style={styles.container}>
      {/* DEBUG: Orange bar to confirm this code is running */}
      <View style={{ backgroundColor: '#FF6600', height: 8, marginBottom: 4 }} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>

      {/* Grid - rendered inline */}
      <View style={styles.gridWrapper}>
        <View style={styles.gridContainer}>
          {/* Day labels column */}
          <View style={styles.dayLabelsColumn}>
            <View style={styles.monthLabelSpacer} />
            {DAY_LABELS.map((label, index) => (
              <View key={`label-${index}`} style={styles.dayLabelCell}>
                <Text style={styles.dayLabelText}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Scrollable grid */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ width: gridContentWidth }}
          >
            <View>
              {/* Month labels */}
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

              {/* Grid rows - inline styles like working test */}
              {rows.map((row, dayIndex) => (
                <View key={`row-${dayIndex}`} style={{ flexDirection: 'row', marginBottom: CELL_GAP }}>
                  {row.map((day, weekIndex) => {
                    // Determine background color
                    let bgColor = COLORS.CELL_EMPTY;
                    if (day === null) {
                      bgColor = 'transparent';
                    } else if (day.isBeforeCreation) {
                      bgColor = COLORS.CELL_BEFORE_CREATION;
                    } else if (day.isFuture) {
                      bgColor = COLORS.CELL_FUTURE;
                    } else if (day.completed) {
                      bgColor = habitColor;
                    }

                    return (
                      <View
                        key={day?.date ?? `empty-${dayIndex}-${weekIndex}`}
                        style={{
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          marginRight: CELL_GAP,
                          borderRadius: 2,
                          backgroundColor: bgColor,
                          opacity: day?.isFuture ? 0.4 : 1,
                          borderWidth: day?.isToday ? 2 : 0,
                          borderColor: day?.isToday ? habitColor : 'transparent',
                        }}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Legend */}
      <HeatmapLegend
        completionRate={gridData.stats.completionRate}
        habitColor={habitColor}
      />

      {/* Tooltip */}
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
  cell: {
    borderRadius: 2,
    height: CELL_SIZE,
    marginRight: CELL_GAP,
    width: CELL_SIZE,
  },
  container: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 16,
  },
  dayLabelCell: {
    height: CELL_SIZE,
    justifyContent: 'center',
    marginBottom: CELL_GAP,
  },
  dayLabelsColumn: {
    marginRight: CELL_GAP,
    width: DAY_LABEL_WIDTH,
  },
  dayLabelText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'right',
  },
  gridContainer: {
    flexDirection: 'row',
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: CELL_GAP,
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
  monthLabel: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 10,
    position: 'absolute',
  },
  monthLabelsRow: {
    height: MONTH_LABEL.HEIGHT,
    marginBottom: CELL_GAP,
    position: 'relative',
  },
  monthLabelSpacer: {
    height: MONTH_LABEL.HEIGHT + CELL_GAP,
  },
});

export default BinaryHeatmap;
