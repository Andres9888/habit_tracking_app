import React, { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import { HapticPatterns } from '../../../utils/haptics';
import { streakStyles } from '../HabitCard.streakStyles';

const STREAK_SPRING = springs.standard;
const BOUNCE_SPRING = springs.celebration;

export function AnimatedStreakText({
  children,
  streak,
}: {
  children: React.ReactNode;
  streak: number;
}) {
  const scale = useSharedValue(1);
  const prevStreak = useRef(streak);

  useEffect(() => {
    const isIncrement = streak > prevStreak.current;
    if (prevStreak.current !== streak && streak > 0) {
      if (isIncrement) void HapticPatterns.streak();
      scale.value = withSequence(
        withSpring(1.15, BOUNCE_SPRING),
        withSpring(1, STREAK_SPRING)
      );
    }
    prevStreak.current = streak;
  }, [streak, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

interface BestStreakBadgeProps {
  backgroundColor: string;
  borderColor: string;
  currentStreak: number;
  textColor: string;
}

export function BestStreakBadge({
  backgroundColor,
  borderColor,
  currentStreak,
  textColor,
}: BestStreakBadgeProps) {
  return (
    <View
      style={[streakStyles.bestStreakBadge, { backgroundColor, borderColor }]}
    >
      <Text style={streakStyles.bestStreakIcon}>🏅</Text>
      <Text style={[streakStyles.bestStreakText, { color: textColor }]}>
        {currentStreak >= 7 ? 'New Record!' : `Best: ${currentStreak}`}
      </Text>
    </View>
  );
}
