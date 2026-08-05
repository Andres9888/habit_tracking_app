/**
 * BinaryHeatmapGrid Component
 *
 * Renders the main 7-row grid for the GitHub-style binary heatmap.
 * Each row represents a day of the week (Sunday through Saturday),
 * and each column represents a week in the selected time range.
 */

import React, { memo, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';

import type { BinaryHeatmapGridProps } from './types';
import { GridRow } from './GridRow';
import { MonthLabelsRow } from './MonthLabelsRow';
import { transformWeeksToRows } from './cellHelpers';
import { CELL_SIZE, CELL_GAP, DAY_LABELS, GRID } from './constants';
import { styles } from './BinaryHeatmapGrid.styles';

const DAY_FULL_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const BinaryHeatmapGrid = memo(function BinaryHeatmapGrid({
  gridData,
  habitColor,
}: BinaryHeatmapGridProps) {
  const { weeks, monthLabels } = gridData;

  const rows = useMemo(() => transformWeeksToRows(weeks, GRID.ROWS), [weeks]);

  const gridContentWidth = weeks.length * (CELL_SIZE + CELL_GAP);

  return (
    <View style={styles.container}>
      {/* Day labels column */}
      <View style={styles.dayLabelsColumn}>
        <View style={styles.monthLabelSpacer} />
        {DAY_LABELS.map((label, index) => (
          <View key={`label-${index}`} style={styles.dayLabelCell}>
            <Text
              accessible
              accessibilityLabel={`${DAY_FULL_NAMES[index]} row`}
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
          <MonthLabelsRow
            gridWidth={gridContentWidth}
            monthLabels={monthLabels}
          />
          <View style={styles.gridContainer}>
            {rows.map((row, dayIndex) => (
              <GridRow
                key={`row-${dayIndex}`}
                dayIndex={dayIndex}
                habitColor={habitColor}
                row={row}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

export default BinaryHeatmapGrid;
