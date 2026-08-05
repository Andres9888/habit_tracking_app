/**
 * GridRow Component
 *
 * Renders a single row of cells in the heatmap grid.
 */

import React, { memo } from 'react';
import { View } from 'react-native';

import type { BinaryDay } from './types';
import { CELL_SIZE } from './constants';
import { styles } from './BinaryHeatmapGrid.styles';
import { getCellBackgroundColor } from './cellHelpers';
import { getBinaryCellAccessibilityLabel } from './utils';

export interface GridRowProps {
  dayIndex: number;
  row: (BinaryDay | null)[];
  habitColor: string;
}

export const GridRow = memo(function GridRow({
  dayIndex,
  row,
  habitColor,
}: GridRowProps) {
  return (
    <View accessibilityRole='row' style={styles.gridRow}>
      {row.map((day, weekIndex) => (
        <View
          accessible
          key={day?.date ?? `empty-${dayIndex}-${weekIndex}`}
          accessibilityLabel={getBinaryCellAccessibilityLabel(day)}
          accessibilityRole='image'
          accessibilityState={
            day ? { selected: day.completed } : undefined
          }
          style={[
            styles.cellWrapper,
            {
              backgroundColor: getCellBackgroundColor(day, habitColor),
              borderRadius: 2,
              height: CELL_SIZE,
              opacity: day?.isFuture ? 0.4 : 1,
              width: CELL_SIZE,
            },
            day?.isToday && { borderColor: habitColor, borderWidth: 2 },
          ]}
        />
      ))}
    </View>
  );
});
