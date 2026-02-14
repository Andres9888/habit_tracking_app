/**
 * TimeRangeToggle Component
 *
 * A segmented control for switching between time ranges (3m, 6m, 1y).
 */

import React, { memo, useCallback } from 'react';
import { View } from 'react-native';

import type { TimeRange, TimeRangeToggleProps } from './types';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { styles } from './TimeRangeToggle.styles';
import { TIME_RANGES } from './TimeRangeToggle.helpers';
import { TimeRangeButton } from './TimeRangeButton';

export const TimeRangeToggle = memo(function TimeRangeToggle({
  value,
  onChange,
}: TimeRangeToggleProps) {
  const reduceMotion = useReduceMotion();

  const handleRangePress = useCallback(
    (range: TimeRange) => {
      if (range !== value) onChange(range);
    },
    [value, onChange]
  );

  return (
    <View
      accessibilityLabel='Time range selector'
      accessibilityRole='tablist'
      style={styles.container}
    >
      {TIME_RANGES.map((range) => (
        <TimeRangeButton
          key={range}
          isActive={value === range}
          range={range}
          reduceMotion={reduceMotion}
          onPress={handleRangePress}
        />
      ))}
    </View>
  );
});

export default TimeRangeToggle;
