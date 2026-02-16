/**
 * InlineHeatmapGrid Component
 *
 * Renders the inline grid rows for the simplified BinaryHeatmap.
 * Used by BinaryHeatmapNew when Metro caching issues require inline rendering.
 *
 * Updates for UX improvements:
 * - Uses BinaryCell component for consistent rendering with checkmarks
 * - Passes cell position to onCellPress for tooltip positioning
 * - Supports theme-aware colors
 */

import React, { memo, useMemo, useRef, useCallback } from 'react';
import { View, Text, ScrollView, LayoutChangeEvent } from 'react-native';

import type { BinaryMonthLabel, BinaryDay } from './types';
import { CELL_SIZE, CELL_GAP, GRID } from './constants';
import { styles } from './BinaryHeatmapNew.styles';
import { transformWeeksToRows } from './cellHelpers';
import { BinaryCell } from './BinaryCell';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export interface InlineHeatmapGridProps {
  weeks: (BinaryDay | null)[][];
  monthLabels: BinaryMonthLabel[];
  habitColor: string;
  onCellPress?: (date: string, completed: boolean, cellPosition: { x: number; y: number }) => void;
}

export const InlineHeatmapGrid = memo(function InlineHeatmapGrid({
  weeks,
  monthLabels,
  habitColor,
  onCellPress,
}: InlineHeatmapGridProps) {
  const rows = useMemo(() => transformWeeksToRows(weeks, GRID.ROWS), [weeks]);
  const gridContentWidth = weeks.length * (CELL_SIZE + CELL_GAP);
  const cellPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());

  const handleCellLayout = useCallback((date: string | null, event: LayoutChangeEvent) => {
    if (!date) return;
    const { x, y } = event.nativeEvent.layout;
    cellPositionsRef.current.set(date, { x, y });
  }, []);

  const handleCellPress = useCallback((date: string, completed: boolean) => {
    const position = cellPositionsRef.current.get(date);
    if (position && onCellPress) {
      onCellPress(date, completed, position);
    } else if (onCellPress) {
      // Fallback if position not yet measured
      onCellPress(date, completed, { x: 0, y: 0 });
    }
  }, [onCellPress]);

  return (
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
            {monthLabels.map((ml, i) => (
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
              {row.map((day, weekIndex) => {
                const globalIndex = weekIndex * GRID.ROWS + dayIndex;
                return (
                  <View
                    key={day?.date ?? `empty-${dayIndex}-${weekIndex}`}
                    onLayout={(e) => handleCellLayout(day?.date ?? null, e)}
                  >
                    <BinaryCell
                      day={day}
                      index={globalIndex}
                      habitColor={habitColor}
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
