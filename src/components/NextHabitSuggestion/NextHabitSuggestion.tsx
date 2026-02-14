/* eslint-disable max-lines */
/**
 * NextHabitSuggestion Component
 * Shows the next incomplete habit to focus on
 * Reduces decision fatigue by highlighting one habit at a time
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from './styles';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ArrowRight, Zap } from 'lucide-react-native';
import type { NextHabitSuggestionProps } from './types';
import { CompletedState } from './CompletedState';
import { HabitContent } from './HabitContent';

export function NextHabitSuggestion({
  habit,
  onPress,
  completedCount,
  totalCount,
}: NextHabitSuggestionProps) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  // Subtle pulsing glow
  React.useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1500 }),
        withTiming(0.3, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  // All habits complete
  if (!habit) {
    return <CompletedState totalCount={totalCount} />;
  }

  return (
    <Pressable
      onPress={() => onPress?.(habit)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <HabitContent
        habit={habit}
        completedCount={completedCount}
        totalCount={totalCount}
        cardStyle={cardStyle}
        glowStyle={glowStyle}
        glowOpacity={glowOpacity}
      />
    </Pressable>
  );
}

export default NextHabitSuggestion;
