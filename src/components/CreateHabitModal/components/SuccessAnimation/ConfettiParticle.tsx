/**
 * ConfettiParticle Component
 *
 * Individual animated confetti particle with falling animation
 */

import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';

import type { ConfettiParticleProps } from './types';

export const ConfettiParticle = ({
  color,
  delay,
  left,
}: ConfettiParticleProps) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const randomX = (Math.random() - 0.5) * 100;
    const duration = 1500 + Math.random() * 500;

    Animated.parallel([
      Animated.timing(translateY, {
        delay,
        duration,
        toValue: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        delay,
        duration,
        toValue: randomX,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        delay,
        duration,
        toValue: Math.random() * 360,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        delay: delay + duration - 300,
        duration: 300,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, rotate, translateX, translateY]);

  return (
    <Animated.View
      className='absolute h-3 w-3'
      style={{
        backgroundColor: color,
        borderRadius: 2,
        left: `${left}%`,
        opacity,
        top: 0,
        transform: [
          { translateY },
          { translateX },
          {
            rotate: rotate.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            }),
          },
        ],
      }}
    />
  );
};
