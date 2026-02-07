/**
 * ConfettiParticle - Single animated confetti piece for celebration
 */

import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import type { ConfettiParticleProps } from '../TemplateScienceModal.types';
import { borderRadius } from '../../../theme/spacing';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ConfettiParticle = ({
  color,
  delay,
  startX,
}: ConfettiParticleProps) => {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(startX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 8 }));
    translateY.value = withDelay(
      delay,
      withTiming(Math.round(SCREEN_HEIGHT * 0.4), {
        duration: 2000,
        easing: Easing.out(Easing.quad),
      })
    );
    translateX.value = withDelay(
      delay,
      withTiming(Math.round(startX + (Math.random() - 0.5) * 200), {
        duration: 2000,
      })
    );
    rotate.value = withDelay(
      delay,
      withTiming(Math.round(Math.random() * 720 - 360), { duration: 2000 })
    );
    opacity.value = withDelay(delay + 1500, withTiming(0, { duration: 500 }));
  }, [delay, opacity, rotate, scale, startX, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${Math.round(rotate.value)}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.confettiParticle,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  confettiParticle: {
    borderRadius: borderRadius.xs,
    height: 12,
    position: 'absolute',
    width: 12,
  },
});
