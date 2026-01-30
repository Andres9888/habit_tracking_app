/**
 * HeroAnimation - Animated growth journey for auth screens
 * Shows habit growth: seed → sprout → tree
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

const STAGES = [
  { emoji: '🌱', label: 'Start' },
  { emoji: '🌿', label: 'Grow' },
  { emoji: '🌳', label: 'Thrive' },
];

export function HeroAnimation() {
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Continuous progress through stages
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withDelay(1000, withTiming(0, { duration: 1000 }))
      ),
      -1,
      false
    );

    // Subtle breathing animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const stage0Style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [1, 0, 0]),
    transform: [
      { scale: interpolate(progress.value, [0, 0.5], [1, 0.8]) * scale.value },
    ],
  }));

  const stage1Style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.5, 1, 1.5, 2], [0, 1, 1, 0]),
    transform: [
      { scale: interpolate(progress.value, [0.5, 1, 1.5, 2], [0.8, 1, 1, 0.8]) * scale.value },
    ],
  }));

  const stage2Style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [1.5, 2], [0, 1]),
    transform: [
      { scale: interpolate(progress.value, [1.5, 2], [0.8, 1]) * scale.value },
    ],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.emojiContainer, containerStyle]}>
        <Animated.Text style={[styles.emoji, styles.absoluteEmoji, stage0Style]}>
          {STAGES[0].emoji}
        </Animated.Text>
        <Animated.Text style={[styles.emoji, styles.absoluteEmoji, stage1Style]}>
          {STAGES[1].emoji}
        </Animated.Text>
        <Animated.Text style={[styles.emoji, styles.absoluteEmoji, stage2Style]}>
          {STAGES[2].emoji}
        </Animated.Text>
      </Animated.View>

      {/* Progress dots */}
      <View style={styles.dotsContainer}>
        {STAGES.map((stage, index) => (
          <AnimatedDot key={index} index={index} progress={progress} />
        ))}
      </View>
    </View>
  );
}

function AnimatedDot({ index, progress }: { index: number; progress: Animated.SharedValue<number> }) {
  const dotStyle = useAnimatedStyle(() => {
    const isActive = progress.value >= index && progress.value < index + 1;
    return {
      backgroundColor: isActive ? '#22c55e' : '#e7e5e4',
      transform: [{ scale: isActive ? 1.2 : 1 }],
    };
  });

  return <Animated.View style={[styles.dot, dotStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emojiContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f4',
    borderRadius: 60,
  },
  emoji: {
    fontSize: 64,
  },
  absoluteEmoji: {
    position: 'absolute',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default HeroAnimation;
