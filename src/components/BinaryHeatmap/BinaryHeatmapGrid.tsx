/**
 * BinaryHeatmapGrid Component
 *
 * Renders the main 7-row grid for the GitHub-style binary heatmap.
 * Each row represents a day of the week (Sunday through Saturday),
 * and each column represents a week in the selected time range.
 *
 * Layout:
 * - Day labels column (S/M/T/W/T/F/S) on the left
 * - Horizontally scrollable grid of BinaryCell components
 * - Cells are organized by row (day-of-week) for proper layout
 */

import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import type { BinaryHeatmapGridProps, BinaryDay } from './types';
import { BinaryCell } from './BinaryCell';
import {
  CELL_SIZE,
  CELL_GAP,
  DAY_LABEL_WIDTH,
  DAY_LABELS,
  COLORS,
  GRID,
} from './constants';
import { calculateCellAnimationDelay } from './utils';

/**
 * BinaryHeatmapGrid - The main grid component for the binary heatmap
 *
 * This component transforms the week-based data structure into a row-based
 * layout for rendering. Each row represents a day of the week (0=Sunday through
 * 6=Saturday), and each column represents a week from the time range.
 *
 * The grid scrolls horizontally to accommodate larger time ranges (6m, 1y).
 */
export const BinaryHeatmapGrid = memo(function BinaryHeatmapGrid({
  gridData,
  habitColor,
  onCellPress,
}: BinaryHeatmapGridProps) {
  const { weeks } = gridData;

  // Transform week-based data to row-based for rendering
  // weeks[weekIndex][dayIndex] -> rows[dayIndex][weekIndex]
  const rows = useMemo(() => {
    const result: (BinaryDay | null)[][] = [];

    // Initialize 7 empty rows (one for each day of week)
    for (let dayIndex = 0; dayIndex < GRID.ROWS; dayIndex++) {
      result[dayIndex] = [];
    }

    // Transpose: for each week, extract the day at each position
    for (const [weekIndex, week] of weeks.entries()) {
      for (let dayIndex = 0; dayIndex < GRID.ROWS; dayIndex++) {
        // Get the day from this week, or null if not present
        result[dayIndex][weekIndex] = week[dayIndex] ?? null;
      }
    }

    return result;
  }, [weeks]);

  // Handle cell press with day data
  const handleCellPress = useCallback(
    (date: string, completed: boolean) => {
      onCellPress?.(date, completed);
    },
    [onCellPress]
  );

  // Calculate total width for the scrollable content
  const gridContentWidth = weeks.length * (CELL_SIZE + CELL_GAP);

  return (
    <View style={styles.container}>
      {/* Day labels column */}
      <View style={styles.dayLabelsColumn}>
        {DAY_LABELS.map((label, index) => (
          <View key={`label-${index}`} style={styles.dayLabelCell}>
            <Text
              accessible
              accessibilityLabel={`${getDayFullName(index)} row`}
              accessibilityRole='text'
              style={styles.dayLabelText}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Scrollable grid area */}
      <ScrollView
        horizontal
        accessibilityLabel='Habit completion heatmap grid'
        accessibilityRole='grid'
        contentContainerStyle={[
          styles.gridScrollContent,
          { width: gridContentWidth },
        ]}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {rows.map((row, dayIndex) => (
            <View
              key={`row-${dayIndex}`}
              accessibilityRole='row'
              style={styles.gridRow}
            >
              {row.map((day, weekIndex) => {
                // Calculate the animation delay for staggered effect
                // Animate left-to-right, top-to-bottom
                const animationIndex = calculateCellAnimationDelay(
                  weekIndex,
                  dayIndex,
                  1 // Returns the linear index, we multiply by stagger delay in BinaryCell
                );

                return (
                  <View
                    key={`cell-${dayIndex}-${weekIndex}`}
                    style={styles.cellWrapper}
                  >
                    <BinaryCell
                      day={day}
                      habitColor={habitColor}
                      index={animationIndex}
                      onPress={handleCellPress}
                    />
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
});

/**
 * Get the full day name for accessibility
 */
function getDayFullName(dayIndex: number): string {
  const fullNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return fullNames[dayIndex] || '';
}

const styles = StyleSheet.create({
  cellWrapper: {
    marginRight: CELL_GAP,
  },
  container: {
    flexDirection: 'row',
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
    paddingRight: 4,
    textAlign: 'right',
  },
  gridContainer: {
    flexDirection: 'column',
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: CELL_GAP,
  },
  gridScrollContent: {
    flexGrow: 1,
  },
});

export default BinaryHeatmapGrid;
