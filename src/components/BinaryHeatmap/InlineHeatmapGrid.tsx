/**
 * InlineHeatmapGrid Component
 *
 * Renders the inline grid rows for the simplified BinaryHeatmap.
 * Used by BinaryHeatmapNew when Metro caching issues require inline rendering.
 */

import React, { memo, useMemo, useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';
import { Pressable } from 'react-native';

import type { BinaryMonthLabel, BinaryDay } from './types';
import { CELL_SIZE, CELL_GAP, GRID } from './constants';
import { styles } from './BinaryHeatmapNew.styles';
import { getCellBackgroundColor, transformWeeksToRows } from './cellHelpers';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export interface InlineHeatmapGridProps {
  weeks: (BinaryDay | null)[][];
  monthLabels: BinaryMonthLabel[];
  habitColor: string;
  onCellPress?: (date: string, completed: boolean) => void;
}

export const InlineHeatmapGrid = memo(function InlineHeatmapGrid({
  weeks,
  monthLabels,
  habitColor,
  onCellPress,
}: InlineHeatmapGridProps) {
  const rows = useMemo(() => transformWeeksToRows(weeks, GRID.ROWS), [weeks]);
  const gridContentWidth = weeks.length * (CELL_SIZE + CELL_GAP);
  const scrollRef = useRef<ScrollViewType>(null);

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
        ref={scrollRef}
        horizontal
        accessibilityLabel='Habit completion heatmap grid'
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
                const cellStyle = [
                  styles.cell,
                  {
                    backgroundColor: getCellBackgroundColor(day, habitColor),
                    borderColor: day?.isToday ? habitColor : 'transparent',
                    borderWidth: day?.isToday ? 2 : 0,
                    opacity: day?.isFuture ? 0.4 : 1,
                  },
                ];
                if (!day) {
                  return (
                    <View
                      key={`empty-${dayIndex}-${weekIndex}`}
                      style={cellStyle}
                    />
                  );
                }
                if (!onCellPress || day.isFuture || day.isBeforeCreation) {
                  return <View key={day.date} style={cellStyle} />;
                }
                return (
                  <Pressable
                    key={day.date}
                    accessibilityRole='button'
                    style={cellStyle}
                    onPress={() => onCellPress(day.date, day.completed)}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
});
