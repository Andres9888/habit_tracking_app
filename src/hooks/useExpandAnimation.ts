/** Shared expand/collapse animation hook for accordion components */

import { useCallback, useEffect, useRef } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { durations, enterEasing, springs } from '@/theme/animations';

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
  motion = 'spring',
}: UseExpandAnimationProps) {
  const expandProgress = useSharedValue(defaultExpanded ? 1 : 0);
  const chevronRotation = useSharedValue(defaultExpanded ? 180 : 0);
  const isUserToggle = useRef(false);

  // Sync shared values when defaultExpanded changes externally (e.g. async preference load)
  useEffect(() => {
    if (isUserToggle.current) {
      isUserToggle.current = false;
      return;
    }
    expandProgress.value = defaultExpanded ? 1 : 0;
    chevronRotation.value = defaultExpanded ? 180 : 0;
  }, [defaultExpanded, expandProgress, chevronRotation]);

  const animateToggle = useCallback(
    (newExpanded: boolean) => {
      isUserToggle.current = true;
      const targetValue = newExpanded ? 1 : 0;
      const chevronTarget = newExpanded ? 180 : 0;

      if (reduceMotion) {
        expandProgress.value = targetValue;
        chevronRotation.value = chevronTarget;
        return;
      }

      if (motion === 'timing') {
        const config = {
          duration: durations.enter,
          easing: enterEasing,
        };
        expandProgress.value = withTiming(targetValue, config);
        chevronRotation.value = withTiming(chevronTarget, config);
        return;
      }

      expandProgress.value = withSpring(targetValue, springs.gentle);
      chevronRotation.value = withSpring(chevronTarget, springs.gentle);
    },
    [reduceMotion, motion, expandProgress, chevronRotation]
  );

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      expandProgress.value,
      [0, 1],
      [0, contentHeight]
    );
    return {
      height: hasContentMeasured ? height : defaultExpanded ? 'auto' : 0,
      opacity: expandProgress.value,
      overflow: 'hidden',
    };
  });

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${Math.round(chevronRotation.value)}deg` }],
  }));

  return { animateToggle, chevronAnimatedStyle, contentAnimatedStyle };
}
