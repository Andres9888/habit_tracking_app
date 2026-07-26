/**
 * HeatmapCell Component
 *
 * Renders a single heatmap cell — a static View for empty/future/pre-creation
 * days, or a Pressable for interactive (eligible) days that reports the tap
 * position so the tooltip can anchor to the cell.
 */

import React, { memo } from 'react';
import { View, Pressable } from 'react-native';
import type { GestureResponderEvent } from 'react-native';

import type { BinaryDay } from './types';
import { styles } from './BinaryHeatmapNew.styles';
import { getCellBackgroundColor, getChainCellShapeStyle } from './cellHelpers';
import { getBinaryCellAccessibilityLabel } from './utils';

export interface HeatmapCellProps {
  day: BinaryDay | null;
  habitColor: string;
  isDark: boolean;
  shape?: 'circle' | 'square';
  onCellPress?: (
    date: string,
    completed: boolean,
    position?: { x: number; y: number }
  ) => void;
}

export const HeatmapCell = memo(function HeatmapCell({
  day,
  habitColor,
  isDark,
  shape = 'square',
  onCellPress,
}: HeatmapCellProps) {
  const cellStyle = [
    styles.cell,
    {
      backgroundColor: getCellBackgroundColor(day, habitColor, isDark),
      borderColor: day?.isToday ? habitColor : 'transparent',
      borderWidth: day?.isToday ? 2 : 0,
      opacity: day?.isFuture ? 0.4 : 1,
    },
    shape === 'circle' ? getChainCellShapeStyle(day, isDark) : null,
  ];
  const accessibilityLabel = getBinaryCellAccessibilityLabel(day);

  if (!day || !onCellPress || day.isFuture || day.isBeforeCreation) {
    return (
      <View
        accessible
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='text'
        style={cellStyle}
      />
    );
  }

  return (
    <Pressable
      accessible
      accessibilityHint={day.isToday ? 'Today' : 'Tap to toggle completion'}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ selected: day.completed }}
      style={cellStyle}
      onPress={(e: GestureResponderEvent) =>
        onCellPress(day.date, day.completed, {
          x: e.nativeEvent.pageX,
          y: e.nativeEvent.pageY,
        })
      }
    />
  );
});
