/**
 * GridRow Component
 *
 * Renders a single row of cells in the heatmap grid.
 */

import React, { memo } from 'react';
import { Pressable, View } from 'react-native';

import type { BinaryDay } from './types';
import { CELL_SIZE } from './constants';
import { styles } from './BinaryHeatmapGrid.styles';
import { getCellBackgroundColor } from './cellHelpers';
import { getBinaryCellAccessibilityLabel } from './utils';

export interface GridRowProps {
  dayIndex: number;
  row: (BinaryDay | null)[];
  habitColor: string;
  onCellPress?: (date: string, completed: boolean) => void;
}

export const GridRow = memo(function GridRow({
  dayIndex,
  row,
  habitColor,
  onCellPress,
}: GridRowProps) {
  return (
    <View accessibilityRole={'row' as never} style={styles.gridRow}>
      {row.map((day, weekIndex) => {
        const key = day?.date ?? `empty-${dayIndex}-${weekIndex}`;
        const accessibilityLabel = getBinaryCellAccessibilityLabel(day);
        const cellStyle = [
          styles.cellWrapper,
          {
            backgroundColor: getCellBackgroundColor(day, habitColor),
            borderRadius: 2,
            height: CELL_SIZE,
            opacity: day?.isFuture ? 0.4 : 1,
            width: CELL_SIZE,
          },
          day?.isToday && { borderColor: habitColor, borderWidth: 2 },
        ];

        if (day === null || day.isFuture || day.isBeforeCreation) {
          return (
            <View
              key={key}
              accessible
              accessibilityLabel={accessibilityLabel}
              accessibilityRole='text'
              style={cellStyle}
            />
          );
        }

        return (
          <Pressable
            key={key}
            accessibilityHint='Tap to toggle completion'
            accessibilityLabel={accessibilityLabel}
            accessibilityRole='button'
            accessibilityState={{ selected: day.completed }}
            style={cellStyle}
            onPress={() => onCellPress?.(day.date, day.completed)}
          />
        );
      })}
    </View>
  );
});
