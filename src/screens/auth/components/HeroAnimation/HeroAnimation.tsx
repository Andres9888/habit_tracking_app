/**
 * HeroAnimation - Animated growth journey for auth screens
 */

import React, { useEffect, useCallback } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { AnimatedDot } from './AnimatedDot';
import { styles } from './HeroAnimation.styles';
import { durations } from '@/theme/animations';

const STAGES = [{ emoji: '🌱', label: 'Start' }, { emoji: '🌿', label: 'Grow' }, { emoji: '🌳', label: 'Thrive' }];

export function HeroAnimation() {
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);

  const startAnimations = useCallback(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: durations.drift,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(2, {
          duration: durations.drift,
          easing: Easing.inOut(Easing.ease),
        }),
        withDelay(durations.loop, withTiming(0, { duration: durations.loop }))
      ),
      -1,
      false
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: durations.drift }),
        withTiming(1, { duration: durations.drift })
      ),
      -1,
      true
    );
  }, [progress, scale]);

  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

  const stage0Style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [1, 0, 0]),
    transform: [
      { scale: interpolate(progress.value, [0, 0.5], [1, 0.8]) * scale.value },
    ],
  }));

  const stage1Style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.5, 1, 1.5, 2], [0, 1, 1, 0]),
    transform: [
      {
        scale:
          interpolate(progress.value, [0.5, 1, 1.5, 2], [0.8, 1, 1, 0.8]) *
          scale.value,
      },
    ],
  }));

  const stage2Style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [1.5, 2], [0, 1]),
    transform: [
      { scale: interpolate(progress.value, [1.5, 2], [0.8, 1]) * scale.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.emojiContainer}>
        <Animated.Text
          style={[styles.emoji, styles.absoluteEmoji, stage0Style]}
        >
          {STAGES[0].emoji}
        </Animated.Text>
        <Animated.Text
          style={[styles.emoji, styles.absoluteEmoji, stage1Style]}
        >
          {STAGES[1].emoji}
        </Animated.Text>
        <Animated.Text
          style={[styles.emoji, styles.absoluteEmoji, stage2Style]}
        >
          {STAGES[2].emoji}
        </Animated.Text>
      </View>
      <View style={styles.dotsContainer}>
        {STAGES.map((_, index) => (
          <AnimatedDot key={index} index={index} progress={progress} />
        ))}
      </View>
    </View>
  );
}

export default HeroAnimation;
