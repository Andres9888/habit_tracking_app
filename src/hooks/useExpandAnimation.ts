/** Shared expand/collapse animation hook for accordion components */

import { useEffect } from 'react';
import {
  Extrapolation,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import {
  durations,
  enterEasing,
  exitEasing,
  springs,
} from '@/theme/animations';

interface UseExpandAnimationProps {
  defaultExpanded: boolean;
  reduceMotion: boolean;
  contentHeight: number;
  hasContentMeasured: boolean;
  motion?: 'spring' | 'timing';
}

export function useExpandAnimation({
  defaultExpanded,
  reduceMotion,
  contentHeight,
  hasContentMeasured,
  motion = 'timing',
}: UseExpandAnimationProps) {
  const progress = useSharedValue(defaultExpanded ? 1 : 0);

  useEffect(() => {
    const target = defaultExpanded ? 1 : 0;

    if (reduceMotion) {
      progress.value = target;
      return;
    }

    if (motion === 'timing') {
      progress.value = withTiming(target, {
        duration: defaultExpanded ? durations.enter : durations.transition,
        easing: defaultExpanded ? enterEasing : exitEasing,
      });
      return;
    }

    progress.value = withSpring(target, springs.gentle);
  }, [defaultExpanded, motion, progress, reduceMotion]);

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const clampedHeight = interpolate(
      progress.value,
      [0, 1],
      [0, contentHeight],
      Extrapolation.CLAMP
    );

    return {
      height: !hasContentMeasured && defaultExpanded ? 'auto' : clampedHeight,
      opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
      overflow: 'hidden',
    };
  });

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(
          progress.value,
          [0, 1],
          [0, 180],
          Extrapolation.CLAMP
        )}deg`,
      },
    ],
  }));

  return { chevronAnimatedStyle, contentAnimatedStyle };
}
