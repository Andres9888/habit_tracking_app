/**
 * useHabitCardEffects - Side effect synchronization for HabitCard
 */

import { useEffect } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { withSpring } from 'react-native-reanimated';
import { springs } from '@/theme/animations';

interface UseHabitCardEffectsOptions {
  strength: number;
  strengthFillWidth: SharedValue<number>;
  completed: boolean;
  checkmarkScale: SharedValue<number>;
  checkmarkRotate: SharedValue<number>;
}

export function useHabitCardEffects(options: UseHabitCardEffectsOptions) {
  const {
    strength,
    strengthFillWidth,
    completed,
    checkmarkScale,
    checkmarkRotate,
  } = options;

  useEffect(() => {
    strengthFillWidth.value = withSpring(strength, springs.standard);
  }, [strength, strengthFillWidth]);

  useEffect(() => {
    checkmarkScale.value = completed ? 1 : 0;
    checkmarkRotate.value = completed ? 360 : 0;
  }, [completed, checkmarkScale, checkmarkRotate]);
}
