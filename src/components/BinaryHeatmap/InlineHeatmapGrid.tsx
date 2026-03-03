/**
 * InlineHeatmapGrid Component
 *
 * Renders the inline grid rows for the simplified BinaryHeatmap.
 * Used by BinaryHeatmapNew when Metro caching issues require inline rendering.
 */

import React, { memo, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';

import type { BinaryMonthLabel, BinaryDay } from './types';
import { CELL_SIZE, CELL_GAP, GRID, getHeatmapColors } from './constants';
import { styles } from './BinaryHeatmapNew.styles';
import { getCellBackgroundColor, transformWeeksToRows } from './cellHelpers';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export interface InlineHeatmapGridProps {
  weeks: (BinaryDay | null)[][];
  monthLabels: BinaryMonthLabel[];
  habitColor: string;
  isDark?: boolean;
}

export const InlineHeatmapGrid = memo(function InlineHeatmapGrid({
  weeks,
  monthLabels,
  habitColor,
  isDark = false,
}: InlineHeatmapGridProps) {
  const hColors = getHeatmapColors(isDark);
  const rows = useMemo(() => transformWeeksToRows(weeks, GRID.ROWS), [weeks]);
  const gridContentWidth = weeks.length * (CELL_SIZE + CELL_GAP);

  return (
    <View style={styles.gridContainer}>
      <View style={styles.dayLabelsColumn}>
        <View style={styles.monthLabelSpacer} />
        {DAY_LABELS.map((label, index) => (
          <View key={`label-${index}`} style={styles.dayLabelCell}>
            <Text
              style={[styles.dayLabelText, { color: hColors.TEXT_SECONDARY }]}
            >
              {label}
            </Text>
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
                  { color: hColors.TEXT_SECONDARY },
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
                        habitColor,
                        isDark
                      ),
                      borderColor: day?.isToday ? habitColor : 'transparent',
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
  );
});
