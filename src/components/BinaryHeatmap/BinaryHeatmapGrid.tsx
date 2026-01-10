/**
 * BinaryHeatmapGrid Component
 *
 * Renders the main 7-row grid for the GitHub-style binary heatmap.
 */

import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';

import type { BinaryHeatmapGridProps } from './types';
import { MonthLabelsRow } from './MonthLabelsRow';
import { GridRow } from './GridRow';
import {
  CELL_SIZE,
  CELL_GAP,
  DAY_LABELS,
  GRID,
  DAY_NAMES_FULL,
} from './constants';
import { styles } from './BinaryHeatmapGrid.styles';
import { transformWeeksToRows } from './cellHelpers';

export const BinaryHeatmapGrid = memo(function BinaryHeatmapGrid({
  gridData,
  habitColor,
  onCellPress,
}: BinaryHeatmapGridProps) {
  const { weeks, monthLabels } = gridData;

  const rows = useMemo(() => transformWeeksToRows(weeks, GRID.ROWS), [weeks]);

  const handleCellPress = useCallback(
    (date: string, completed: boolean) => {
      onCellPress?.(date, completed);
    },
    [onCellPress]
  );

  const gridContentWidth = weeks.length * (CELL_SIZE + CELL_GAP);

  return (
    <View style={styles.container}>
      <View style={styles.dayLabelsColumn}>
        <View style={styles.monthLabelSpacer} />
        {DAY_LABELS.map((label, index) => (
          <View key={`label-${index}`} style={styles.dayLabelCell}>
            <Text
              accessible
              accessibilityLabel={`${DAY_NAMES_FULL[index]} row`}
              accessibilityRole='text'
              style={styles.dayLabelText}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>
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
