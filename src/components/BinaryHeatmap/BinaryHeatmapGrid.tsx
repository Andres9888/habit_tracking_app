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
 *
 * Performance Optimizations:
 * - Uses React.memo() on GridRow and BinaryHeatmapGrid components
 * - Memoizes row transformation via useMemo()
 * - Stable callback references via useCallback()
 * - Key stability: uses date strings or stable position-based keys
 * - No virtualization needed: max 364 cells (1y) is well within efficient render limits
 */

import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import type { BinaryHeatmapGridProps, BinaryDay } from './types';
// Force Metro rebuild - timestamp: 2025-12-30T22:00
import { BinaryCell } from './BinaryCell';
import { MonthLabelsRow } from './MonthLabelsRow';
import {
  CELL_SIZE,
  CELL_GAP,
  DAY_LABEL_WIDTH,
  DAY_LABELS,
  COLORS,
  GRID,
  MONTH_LABEL,
} from './constants';
import { calculateCellAnimationDelay } from './utils';

/**
 * Memoized row component to prevent unnecessary re-renders of entire rows
 * when only a single cell changes. Each row renders cells for a specific
 * day of the week (Sunday=0 through Saturday=6).
 */
interface GridRowProps {
  dayIndex: number;
  row: (BinaryDay | null)[];
  habitColor: string;
  onCellPress: (date: string, completed: boolean) => void;
}

// Inline cell rendering to bypass Metro caching issues with BinaryCell
const GridRow = memo(function GridRow({
  dayIndex,
  row,
  habitColor,
  onCellPress,
}: GridRowProps) {
  return (
    <View accessibilityRole='none' style={styles.gridRow}>
      {row.map((day, weekIndex) => {
        // Determine background color inline
        let bgColor: string = COLORS.CELL_EMPTY;
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
            style={[
              styles.cellWrapper,
              {
                width: CELL_SIZE,
                height: CELL_SIZE,
                borderRadius: 2,
                backgroundColor: bgColor,
                opacity: day?.isFuture ? 0.4 : 1,
              },
              // Today ring
              day?.isToday && {
                borderWidth: 2,
                borderColor: habitColor,
              },
            ]}
          />
        );
      })}
    </View>
  );
});

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
  const { weeks, monthLabels } = gridData;

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
        {/* Spacer for month labels row alignment */}
        <View style={styles.monthLabelSpacer} />

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
        accessibilityRole='none'
        contentContainerStyle={[
          styles.gridScrollContent,
          { width: gridContentWidth },
        ]}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.gridContentContainer}>
          {/* Month labels row above the grid */}
          <MonthLabelsRow
            gridWidth={gridContentWidth}
            monthLabels={monthLabels}
          />

          {/* Grid cells */}
          <View style={styles.gridContainer}>
            {rows.map((row, dayIndex) => (
              <GridRow
                key={`row-${dayIndex}`}
                dayIndex={dayIndex}
                habitColor={habitColor}
                row={row}
                onCellPress={handleCellPress}
              />
            ))}
          </View>
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
  gridContentContainer: {
    flexDirection: 'column',
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: CELL_GAP,
  },
  gridScrollContent: {
    flexGrow: 1,
  },
  monthLabelSpacer: {
    height: MONTH_LABEL.HEIGHT + CELL_GAP,
  },
});

export default BinaryHeatmapGrid;
