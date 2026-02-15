import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
<<<<<<< HEAD
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
=======
import Animated, { FadeInDown } from 'react-native-reanimated';
>>>>>>> 618ea1d3 (ui: polish home screen widgets — dark mode, consistent cards, animations)
import { ArrowRight, Zap } from 'lucide-react-native';
import type { ViewStyle } from 'react-native';
import type { NextHabitSuggestionProps } from './types';
import { createStyles } from './styles';
import { useThemeColors } from '../../theme/ThemeContext';

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
<<<<<<< HEAD
  if (!habit) return null;
=======
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

>>>>>>> 618ea1d3 (ui: polish home screen widgets — dark mode, consistent cards, animations)
  return (
    <Animated.View
      entering={FadeInDown.duration(280).springify().damping(18)}
      style={[styles.container, cardStyle]}
    >
      <Animated.View style={[styles.glow, glowStyle]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.badge}>
<<<<<<< HEAD
            <Zap color='#f59e0b' size={12} strokeWidth={2.5} />
=======
            <Zap color={isDark ? '#fbbf24' : '#f59e0b'} size={12} strokeWidth={2.5} />
>>>>>>> 618ea1d3 (ui: polish home screen widgets — dark mode, consistent cards, animations)
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
<<<<<<< HEAD
          <ArrowRight color='#a8a29e' size={20} />
=======
          <ArrowRight color={colors.text.tertiary} size={20} />
>>>>>>> 618ea1d3 (ui: polish home screen widgets — dark mode, consistent cards, animations)
        </View>
      </View>
    </Animated.View>
  );
}
