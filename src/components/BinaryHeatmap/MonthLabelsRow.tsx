/**
 * MonthLabelsRow Component
 *
 * Renders the month labels row above the binary heatmap grid.
 * Each label is positioned at the start of its corresponding month's first week.
 *
 * Layout:
 * - Labels are positioned absolutely based on week index
 * - Each label shows abbreviated month name (e.g., "Oct", "Nov", "Dec")
 * - Labels handle edge cases where months may span multiple weeks
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import type { BinaryMonthLabel } from './types';
import { CELL_SIZE, CELL_GAP, COLORS, MONTH_LABEL } from './constants';

export interface MonthLabelsRowProps {
  /** Array of month labels with their starting week indices */
  monthLabels: BinaryMonthLabel[];

  /** Total width of the grid content (for container sizing) */
  gridWidth: number;
}

/**
 * MonthLabelsRow - Renders month labels above the heatmap grid
 *
 * Positions month labels at their corresponding week indices.
 * Labels are horizontally spaced to align with week columns.
 */
export const MonthLabelsRow = memo(function MonthLabelsRow({
  monthLabels,
  gridWidth,
}: MonthLabelsRowProps) {
  // Calculate the width of each cell + gap for positioning
  const cellUnit = CELL_SIZE + CELL_GAP;

  // If no labels, still render empty container for consistent spacing
  if (monthLabels.length === 0) {
    return (
      <View
        accessible
        accessibilityLabel='Month labels row'
        accessibilityRole='header'
        style={[styles.container, { width: gridWidth }]}
      />
    );
  }

  return (
    <View
      accessible
      accessibilityLabel='Month labels row'
      accessibilityRole='header'
      style={[styles.container, { width: gridWidth }]}
    >
      {monthLabels.map((monthLabel, index) => {
        // Calculate the left position based on week index
        const leftPosition = monthLabel.weekIndex * cellUnit;

        // Calculate width: extend to next month label or end of grid
        const nextLabelIndex = index + 1;
        const nextLeftPosition =
          nextLabelIndex < monthLabels.length
            ? monthLabels[nextLabelIndex].weekIndex * cellUnit
            : gridWidth;

        // Width is difference between positions, minimum of MIN_WIDTH
        const width = Math.max(
          nextLeftPosition - leftPosition,
          MONTH_LABEL.MIN_WIDTH
        );

        return (
          <View
            key={`month-${monthLabel.label}-${monthLabel.weekIndex}`}
            style={[
              styles.labelContainer,
              {
                left: leftPosition,
                width,
              },
            ]}
          >
            <Text
              accessible
              accessibilityLabel={`${getFullMonthName(monthLabel.label)} column`}
              accessibilityRole='text'
              style={styles.labelText}
            >
              {monthLabel.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
});

/**
 * Get full month name from abbreviated label for accessibility
 */
function getFullMonthName(abbreviation: string): string {
  const monthMap: Record<string, string> = {
    Apr: 'April',
    Aug: 'August',
    Dec: 'December',
    Feb: 'February',
    Jan: 'January',
    Jul: 'July',
    Jun: 'June',
    Mar: 'March',
    May: 'May',
    Nov: 'November',
    Oct: 'October',
    Sep: 'September',
  };

  return monthMap[abbreviation] || abbreviation;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: MONTH_LABEL.HEIGHT,
    marginBottom: CELL_GAP,
    position: 'relative',
  },
  labelContainer: {
    height: MONTH_LABEL.HEIGHT,
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
  },
  labelText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: MONTH_LABEL.FONT_SIZE,
    fontWeight: '500',
  },
});

export default MonthLabelsRow;
