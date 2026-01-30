/**
 * useStatsGridAnimations Hook
 *
 * Handles entrance animation for the StatsGrid container.
 */

import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Springs } from '../../constants/motion';

interface UseStatsGridAnimationsArgs {
  reduceMotion: boolean;
}

/**
 * Container entrance animation for StatsGrid
 */
export function useStatsGridAnimations({
  reduceMotion,
}: UseStatsGridAnimationsArgs) {
  const containerScale = useSharedValue(reduceMotion ? 1 : 0.95);

  useEffect(() => {
    if (reduceMotion) {
      containerScale.value = 1;
      return;
    }
    containerScale.value = withSpring(1, Springs.gentle);
  }, [reduceMotion, containerScale]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));

  return { containerStyle };
}
