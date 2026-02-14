/**
 * NextHabitSuggestion Component
 * Shows the next incomplete habit to focus on
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
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
import { styles } from './NextHabitSuggestion.styles';
import { CompletedState } from './CompletedState';

export function NextHabitSuggestion({
  habit,
  onPress,
  completedCount,
  totalCount,
}: NextHabitSuggestionProps) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

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

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));

  if (!habit) return <CompletedState totalCount={totalCount} />;

  return (
    <Pressable
      onPress={() => onPress?.(habit)}
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <Animated.View style={[styles.container, cardStyle]}>
        <Animated.View style={[styles.glow, glowStyle]} />
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.badge}>
              <Zap color='#f59e0b' size={12} strokeWidth={2.5} />
              <Text style={styles.badgeText}>Focus on</Text>
            </View>
            <Text style={styles.progress}>
              {completedCount}/{totalCount}
            </Text>
          </View>
          <View style={styles.habitRow}>
            <Text style={styles.habitIcon}>{habit.icon || '📝'}</Text>
            <View style={styles.habitInfo}>
              <Text numberOfLines={1} style={styles.habitName}>
                {habit.name}
              </Text>
              <Text style={styles.habitHint}>Tap to mark complete</Text>
            </View>
            <ArrowRight color='#a8a29e' size={20} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default NextHabitSuggestion;
