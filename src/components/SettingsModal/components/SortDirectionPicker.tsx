/** Expand/collapse wrapper for context-aware sort direction picker */
import { useCallback, useEffect, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useExpandAnimation } from '@/hooks/useExpandAnimation';
import { getSortFamily } from '../SortOrderPicker.constants';
import { SortDirectionSegments } from './SortDirectionSegments';
import type { HabitSortMode } from '../../../features/habits/types';

interface SortDirectionPickerProps {
  selected: HabitSortMode;
  onSelect: (mode: HabitSortMode) => void;
}

export function SortDirectionPicker({
  selected,
  onSelect,
}: SortDirectionPickerProps) {
  const family = getSortFamily(selected);
  const showDirection = family !== 'manual';
  const reduceMotion = useReduceMotion();
  const [pickerHeight, setPickerHeight] = useState(0);
  const [pickerMeasured, setPickerMeasured] = useState(false);

  const { contentAnimatedStyle } = useExpandAnimation({
    contentHeight: pickerHeight,
    defaultExpanded: showDirection,
    hasContentMeasured: pickerMeasured,
    reduceMotion,
  });

  const handlePickerLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height <= 0) return;
      if (pickerMeasured && !showDirection) return;
      setPickerHeight((prev) => (prev === height ? prev : height));
      setPickerMeasured(true);
    },
    [pickerMeasured, showDirection]
  );

  useEffect(() => {
    if (!showDirection) setPickerMeasured(false);
  }, [showDirection]);

  const segments = (
    <SortDirectionSegments
      selected={selected}
      onLayout={handlePickerLayout}
      onSelect={onSelect}
    />
  );

  return (
    <Animated.View
      pointerEvents={showDirection ? 'auto' : 'none'}
      style={contentAnimatedStyle}
    >
      {showDirection && !reduceMotion ? (
        <Animated.View
          key={family}
          entering={FadeIn.duration(durations.enter).easing(enterEasing)}
        >
          {segments}
        </Animated.View>
      ) : (
        showDirection && segments
      )}
    </Animated.View>
  );
}
