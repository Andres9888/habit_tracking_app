import { useEffect } from 'react';
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { createHabitMotion } from '../../createHabitMotion';

export interface SaveButtonPalette {
  disabledBg: string;
  enabledBg: string;
  disabledLabel: string;
  enabledLabel: string;
}

/**
 * Animates between a neutral "visibly present but inactive" state and the
 * solid primary state. The disabled state keeps full opacity — a washed-out
 * primary fill was unreadable against the cream surface.
 */
export function useSaveButtonAnimatedStyle(
  canSave: boolean,
  palette: SaveButtonPalette
) {
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(canSave ? 1 : 0);

  useEffect(() => {
    const target = canSave ? 1 : 0;
    const timing = canSave
      ? createHabitMotion.saveButtonEnable
      : createHabitMotion.saveButtonDisable;
    progress.value = reduceMotion ? target : withTiming(target, timing);
  }, [canSave, progress, reduceMotion]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [palette.disabledBg, palette.enabledBg]
    ),
    transform: [{ scale: 0.97 + progress.value * 0.03 }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [palette.disabledLabel, palette.enabledLabel]
    ),
  }));

  return { containerStyle, labelStyle };
}
