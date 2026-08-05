import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

interface UseOfflineBannerAnimationsParams {
  isProcessing: boolean;
  isOnline: boolean;
  reduceMotion: boolean;
}

export const useOfflineBannerAnimations = ({
  isProcessing,
  isOnline,
  reduceMotion,
}: UseOfflineBannerAnimationsParams) => {
  const expandProgress = useSharedValue(0);
  const spinProgress = useSharedValue(0);
  const pulseProgress = useSharedValue(0);

  // Spinner animation when processing
  useEffect(() => {
    spinProgress.value =
      isProcessing && !reduceMotion
        ? withRepeat(withTiming(1, { duration: 1000 }), -1, false)
        : 0;
  }, [isProcessing, reduceMotion, spinProgress]);

  // Pulse animation for offline indicator
  useEffect(() => {
    pulseProgress.value =
      !isOnline && !reduceMotion
        ? withRepeat(withTiming(1, { duration: 2000 }), -1, true)
        : 0;
  }, [isOnline, reduceMotion, pulseProgress]);

  const expandAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      expandProgress.value,
      [0, 1],
      [0, 120],
      Extrapolation.CLAMP
    ),
    opacity: expandProgress.value,
  }));

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${Math.round(interpolate(expandProgress.value, [0, 1], [0, 180]))}deg`,
      },
    ],
  }));

  const spinAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${Math.round(spinProgress.value * 360)}deg` }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      pulseProgress.value,
      [0, 0.5, 1],
      [1, 0.5, 1],
      Extrapolation.CLAMP
    ),
  }));

  return {
    chevronAnimatedStyle,
    expandAnimatedStyle,
    expandProgress,
    pulseAnimatedStyle,
    spinAnimatedStyle,
  };
};
