/** AnimatedToggle animation logic — calm eased slide vs spring + thumb-stretch */
import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';

export type ToggleVariant = 'calm' | 'spring';

export function useAnimatedToggleMotion(
  value: boolean,
  variant: ToggleVariant,
  travel: number
) {
  const reduce = useReducedMotion();
  const stretch = useSharedValue(1);

  const p = useDerivedValue(() => {
    if (reduce) return value ? 1 : 0;
    return variant === 'spring'
      ? withSpring(value ? 1 : 0, springs.standard)
      : withTiming(value ? 1 : 0, {
          duration: 250,
          easing: Easing.out(Easing.cubic),
        });
  });

  const checkOpacity = useDerivedValue(() => {
    if (reduce) return value ? 1 : 0;
    return variant === 'spring'
      ? withTiming(value ? 1 : 0, { duration: 150 })
      : withDelay(50, withTiming(value ? 1 : 0, { duration: 150 }));
  });

  useEffect(() => {
    if (variant !== 'spring' || reduce) return;
    stretch.value = withSequence(
      withTiming(1.3, { duration: 90 }),
      withTiming(1, { duration: 90 })
    );
  }, [value, variant, reduce, stretch]);

  const knob = useAnimatedStyle(() => ({
    transform: [{ translateX: p.value * travel }, { scaleX: stretch.value }],
  }));
  const check = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
  }));

  return { p, knob, check };
}
