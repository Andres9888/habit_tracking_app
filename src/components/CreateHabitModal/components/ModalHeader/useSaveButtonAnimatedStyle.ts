import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { createHabitMotion } from '../../createHabitMotion';

const DISABLED_OPACITY = 0.35;

/** Smooth opacity + scale when create/save becomes available. */
export function useSaveButtonAnimatedStyle(canSave: boolean) {
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(canSave ? 1 : 0);

  useEffect(() => {
    const target = canSave ? 1 : 0;
    const timing = canSave
      ? createHabitMotion.saveButtonEnable
      : createHabitMotion.saveButtonDisable;
    progress.value = reduceMotion ? target : withTiming(target, timing);
  }, [canSave, progress, reduceMotion]);

  return useAnimatedStyle(() => ({
    opacity: DISABLED_OPACITY + progress.value * (1 - DISABLED_OPACITY),
    transform: [{ scale: 0.97 + progress.value * 0.03 }],
  }));
}
