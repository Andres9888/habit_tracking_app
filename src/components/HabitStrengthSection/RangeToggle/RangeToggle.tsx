/**
 * RangeToggle - Compact 1M/3M/1Y segmented control for the strength chart.
 * Mirrors DetailViewTabs' animated pill-indicator pattern at a smaller scale.
 */
import { useCallback, useEffect } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import useHapticFeedback from '@/hooks/useHapticFeedback';
import { borderRadius } from '@/theme/spacing';
import { useThemeColors } from '@/theme';
import { TIME_RANGE_OPTIONS } from '../constants';
import type { TimeRange } from '../types';
import { INDICATOR_TIMING, PADDING } from './RangeToggle.constants';
import { RangeToggleButton } from './RangeToggleButton';
import { RangeToggleIndicator } from './RangeToggleIndicator';

interface RangeToggleProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

export function RangeToggle({ value, onChange }: RangeToggleProps) {
  const { triggerSelection } = useHapticFeedback();
  const { colors, isDark } = useThemeColors();
  const containerWidth = useSharedValue(0);
  const activeIndex = TIME_RANGE_OPTIONS.findIndex((o) => o.value === value);
  const indicatorIndex = useSharedValue(Math.max(activeIndex, 0));

  useEffect(() => {
    const next = TIME_RANGE_OPTIONS.findIndex((o) => o.value === value);
    indicatorIndex.value = withTiming(Math.max(next, 0), INDICATOR_TIMING);
  }, [value, indicatorIndex]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      containerWidth.value = event.nativeEvent.layout.width;
    },
    [containerWidth]
  );

  const handlePress = useCallback(
    (next: TimeRange) => {
      if (next !== value) triggerSelection();
      onChange(next);
    },
    [onChange, triggerSelection, value]
  );

  const trackBg = isDark ? colors.surface : colors.gray[50];

  return (
    <View
      accessibilityRole='tablist'
      style={{
        backgroundColor: trackBg,
        borderRadius: borderRadius.full,
        flexDirection: 'row',
        padding: PADDING,
        position: 'relative',
        width: 116,
      }}
      onLayout={handleLayout}
    >
      <RangeToggleIndicator
        containerWidth={containerWidth}
        indicatorIndex={indicatorIndex}
      />
      {TIME_RANGE_OPTIONS.map((option) => (
        <RangeToggleButton
          key={option.value}
          activeRange={value}
          label={option.label}
          value={option.value}
          onPress={handlePress}
        />
      ))}
    </View>
  );
}
