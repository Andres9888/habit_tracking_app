/** Shared expand/collapse animation hook for accordion components */

import { useCallback, useEffect, useRef } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { ANIMATION_DURATIONS } from '@/constants/animations';

interface UseExpandAnimationProps {
  defaultExpanded: boolean;
  reduceMotion: boolean;
  contentHeight: number;
  hasContentMeasured: boolean;
}

export function useExpandAnimation({
  defaultExpanded,
  reduceMotion,
  contentHeight,
  hasContentMeasured,
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
      const duration = reduceMotion ? 0 : ANIMATION_DURATIONS.STANDARD;
      const targetValue = newExpanded ? 1 : 0;
      const chevronTarget = newExpanded ? 180 : 0;

      expandProgress.value = withTiming(targetValue, {
        duration,
        easing: Easing.out(Easing.ease),
      });

      chevronRotation.value = withTiming(chevronTarget, {
        duration,
        easing: Easing.out(Easing.ease),
      });
    },
    [reduceMotion, expandProgress, chevronRotation]
  );

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      expandProgress.value,
      [0, 1],
      [0, contentHeight]
    );
    return {
      height: hasContentMeasured ? height : 'auto',
      opacity: expandProgress.value,
      overflow: 'hidden',
    };
  });

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${Math.round(chevronRotation.value)}deg` }],
  }));

  return { animateToggle, chevronAnimatedStyle, contentAnimatedStyle };
}
