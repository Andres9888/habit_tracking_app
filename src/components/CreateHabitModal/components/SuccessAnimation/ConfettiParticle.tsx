/**
 * ConfettiParticle Component
 *
 * Individual animated confetti particle with falling animation
 * Uses react-native-reanimated (migrated from legacy Animated)
 */

import { useEffect } from 'react';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import type { ConfettiParticleProps } from './types';

export const ConfettiParticle = ({
  color,
  delay,
  left,
}: ConfettiParticleProps) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const randomX = (Math.random() - 0.5) * 100;
    const duration = 1500 + Math.random() * 500;

    translateY.value = withDelay(delay, withTiming(400, { duration }));
    translateX.value = withDelay(delay, withTiming(randomX, { duration }));
    rotate.value = withDelay(
      delay,
      withTiming(Math.random() * 360, { duration })
    );
    opacity.value = withDelay(
      delay + duration - 300,
      withTiming(0, { duration: 300 })
    );
  }, [delay, opacity, rotate, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Reanimated.View
      className='absolute h-3 w-3'
      style={[
        {
          backgroundColor: color,
          borderRadius: 2,
          left: `${left}%`,
          top: 0,
        },
        animatedStyle,
      ]}
    />
  );
};
