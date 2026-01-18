import { useEffect } from 'react';
import {
  cancelAnimation,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export function useQuickStartAnimations(index: number, isSuccess: boolean) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const bgProgress = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const pulseOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    const delay = index * 500;
    pulseOpacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(0.5, { duration: 1000 }),
          withTiming(0, { duration: 1000 })
        ),
        -1,
        false
      )
    );
    pulseScale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(1.02, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        false
      )
    );

    return () => {
      cancelAnimation(pulseOpacity);
      cancelAnimation(pulseScale);
    };
  }, [index, pulseOpacity, pulseScale]);

  useEffect(() => {
    if (isSuccess) {
      bgProgress.value = withSpring(2, { damping: 12 });
      checkScale.value = withSpring(1, { damping: 10, stiffness: 200 });
      scale.value = withSequence(
        withSpring(1.12, { damping: 8 }),
        withSpring(1, { damping: 12 })
      );
    } else {
      bgProgress.value = withTiming(0, { duration: 300 });
      checkScale.value = withTiming(0, { duration: 200 });
    }
  }, [isSuccess, bgProgress, checkScale, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      bgProgress.value,
      [0, 1, 2],
      ['#ffffff', '#fafaf9', '#dcfce7']
    ),
    borderColor: interpolateColor(
      bgProgress.value,
      [0, 1, 2],
      ['#e7e5e4', '#d6d3d1', '#86efac']
    ),
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const pulseRingStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: checkScale.value,
    transform: [{ scale: checkScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: isSuccess ? 0 : 1,
  }));

  return {
    animatedStyle,
    bgProgress,
    checkmarkStyle,
    contentStyle,
    pulseRingStyle,
    rotation,
    scale,
  };
}
