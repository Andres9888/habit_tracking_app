/**
 * useHabitCardEffects — Syncs React props → Reanimated shared values.
 *
 * Two effects:
 * 1. **Strength fill** — When `strength` prop changes, spring-animates the fill width.
 * 2. **Checkmark state** — When `completed` changes, snaps scale/rotate to target
 *    (no animation here; celebration animations are triggered separately by gestures).
 */

import { useEffect } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { withSpring } from 'react-native-reanimated';

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
    strengthFillWidth.value = withSpring(strength, {
      damping: 15,
      stiffness: 100,
    });
  }, [strength, strengthFillWidth]);

  useEffect(() => {
    checkmarkScale.value = completed ? 1 : 0;
    checkmarkRotate.value = completed ? 360 : 0;
  }, [completed, checkmarkScale, checkmarkRotate]);
}
