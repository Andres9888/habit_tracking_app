import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { FloatingParticleProps } from '../HabitsEmptyState.types';

export function FloatingParticle({
  delay,
  emoji,
  duration = 3000,
}: FloatingParticleProps) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.6, { duration: 500 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 12 }));

    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-12, { duration: duration / 2 }),
          withTiming(0, { duration: duration / 2 })
        ),
        -1,
        true
      )
    );

    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(6, { duration: duration / 3 }),
          withTiming(-6, { duration: duration / 3 }),
          withTiming(0, { duration: duration / 3 })
        ),
        -1,
        true
      )
    );

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(translateX);
      cancelAnimation(opacity);
      cancelAnimation(scale);
    };
  }, [delay, duration, translateY, translateX, opacity, scale]);

  const particleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.Text className='text-lg' style={particleStyle}>
      {emoji}
    </Animated.Text>
  );
}
