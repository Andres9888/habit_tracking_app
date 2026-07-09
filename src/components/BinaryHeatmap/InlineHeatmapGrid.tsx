/**
 * InlineHeatmapGrid Component
 *
 * Renders the inline grid rows for the simplified BinaryHeatmap.
 * Used by BinaryHeatmapNew when Metro caching issues require inline rendering.
 */

import React, { memo, useMemo, useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';

import type { BinaryMonthLabel, BinaryDay } from './types';
import { CELL_SIZE, CELL_GAP, GRID } from './constants';
import { styles } from './BinaryHeatmapNew.styles';
import { transformWeeksToRows } from './cellHelpers';
import { HeatmapCell } from './HeatmapCell';
import { useThemeColors } from '@/theme/ThemeContext';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export interface InlineHeatmapGridProps {
  weeks: (BinaryDay | null)[][];
  monthLabels: BinaryMonthLabel[];
  habitColor: string;
  shape?: 'circle' | 'square';
  onCellPress?: (
    date: string,
    completed: boolean,
    position?: { x: number; y: number }
  ) => void;
}

export const InlineHeatmapGrid = memo(function InlineHeatmapGrid({
  weeks,
  monthLabels,
  habitColor,
  shape = 'square',
  onCellPress,
}: InlineHeatmapGridProps) {
  const { colors, isDark } = useThemeColors();
  const rows = useMemo(() => transformWeeksToRows(weeks, GRID.ROWS), [weeks]);
  const gridContentWidth = weeks.length * (CELL_SIZE + CELL_GAP);
  const scrollRef = useRef<ScrollViewType>(null);
  const labelColor = { color: colors.text.tertiary };

  return (
    <View style={styles.gridContainer}>
      <View style={styles.dayLabelsColumn}>
        <View style={styles.monthLabelSpacer} />
        {DAY_LABELS.map((label, index) => (
          <View key={`label-${index}`} style={styles.dayLabelCell}>
            <Text style={[styles.dayLabelText, labelColor]}>{label}</Text>
          </View>
        ))}
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        contentContainerStyle={{ width: gridContentWidth }}
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: false })
        }
      >
        <View>
          <View style={styles.monthLabelsRow}>
            {monthLabels.map((ml, i) => (
              <Text
                key={`month-${i}`}
                style={[
                  styles.monthLabel,
                  labelColor,
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
                <HeatmapCell
                  key={day?.date ?? `empty-${dayIndex}-${weekIndex}`}
                  day={day}
                  habitColor={habitColor}
                  isDark={isDark}
                  shape={shape}
                  onCellPress={onCellPress}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
});
