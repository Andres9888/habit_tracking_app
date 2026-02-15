/**
 * useIconAnimation - Hook for icon bounce animation on viz type change
 */

import { useEffect } from 'react';

import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

import type { VizType } from './types';
import { SPRING_BOUNCY } from './constants';

interface UseIconAnimationProps {
  vizType: VizType;
  reduceMotion: boolean;
}

export function useIconAnimation({
  vizType,
  reduceMotion,
}: UseIconAnimationProps) {
  const iconScale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;

    iconScale.value = withSequence(
      withSpring(1.2, SPRING_BOUNCY),
      withSpring(1, SPRING_BOUNCY)
    );
  }, [vizType, reduceMotion, iconScale]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return { iconAnimatedStyle };
}
