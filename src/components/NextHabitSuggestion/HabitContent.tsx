import React from 'react';
import { View, Text } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { ArrowRight, Zap } from 'lucide-react-native';
import type { ViewStyle } from 'react-native';
import type { NextHabitSuggestionProps } from './types';
import { styles } from './styles';

interface HabitContentProps {
  habit: NonNullable<NextHabitSuggestionProps['habit']>;
  completedCount: number;
  totalCount: number;
  cardStyle: AnimatedStyle<ViewStyle>;
  glowStyle: AnimatedStyle<ViewStyle>;
}

export function HabitContent({
  habit,
  completedCount,
  totalCount,
  cardStyle,
  glowStyle,
}: HabitContentProps) {
  if (!habit) return null;
  return (
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
  );
}
