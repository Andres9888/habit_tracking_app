/**
 * MonthLabelsRow Component
 *
 * Renders the month labels row above the binary heatmap grid.
 */

import React, { memo } from 'react';
import { View, Text } from 'react-native';

import type { BinaryMonthLabel } from './types';
import { CELL_SIZE, CELL_GAP, MONTH_LABEL } from './constants';
import { styles } from './MonthLabelsRow.styles';
import { getFullMonthName } from './MonthLabelsRow.helpers';

export interface MonthLabelsRowProps {
  monthLabels: BinaryMonthLabel[];
  gridWidth: number;
}

export const MonthLabelsRow = memo(function MonthLabelsRow({
  monthLabels,
  gridWidth,
}: MonthLabelsRowProps) {
  const cellUnit = CELL_SIZE + CELL_GAP;

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
        const leftPosition = monthLabel.weekIndex * cellUnit;
        const nextLabelIndex = index + 1;
        const nextLeftPosition =
          nextLabelIndex < monthLabels.length
            ? monthLabels[nextLabelIndex].weekIndex * cellUnit
            : gridWidth;
        const width = Math.max(
          nextLeftPosition - leftPosition,
          MONTH_LABEL.MIN_WIDTH
        );

        return (
          <View
            key={`month-${monthLabel.label}-${monthLabel.weekIndex}`}
            style={[styles.labelContainer, { left: leftPosition, width }]}
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

export default MonthLabelsRow;
