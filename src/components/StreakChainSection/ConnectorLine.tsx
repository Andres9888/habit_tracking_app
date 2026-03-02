/**
 * ConnectorLine Component
 * Animated connector between day circles in the streak chain
 */

import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  cancelAnimation,
} from 'react-native-reanimated';
import type { ConnectorLineProps } from './types';
import { springs } from '@/theme/animations';

export function ConnectorLine({ active, index }: ConnectorLineProps) {
  const scaleX = useSharedValue(0);

  useEffect(() => {
    scaleX.value = withDelay(index * 35 + 15, withSpring(1, springs.standard));

    return () => {
      cancelAnimation(scaleX);
    };
  }, [index, scaleX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scaleX.value }],
  }));

  return (
    <Animated.View
      className={`absolute top-5 h-1.5 rounded-full ${active ? 'bg-emerald-300' : 'bg-stone-200'}`}
      style={[{ left: '55%', right: '-55%' }, animatedStyle]}
    />
  );
}
