/**
 * GoalPresetChip — animated selection background/border cross-fade.
 */
import { useEffect } from 'react';
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { durations } from '../../../theme/animations';
import { useReduceMotion } from '../../../hooks/useReduceMotion';

interface ChipPalette {
  borderDefault: string;
  borderSelected: string;
  fillDefault: string;
  fillSelected: string;
}

export function useGoalPresetChipAnimation(selected: boolean, palette: ChipPalette) {
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    const target = selected ? 1 : 0;
    progress.value = reduceMotion
      ? target
      : withTiming(target, { duration: durations.quick });
  }, [selected, reduceMotion, progress]);

  return useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [palette.fillDefault, palette.fillSelected]
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [palette.borderDefault, palette.borderSelected]
    ),
  }));
}
