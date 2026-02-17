/**
 * QuickWinsSection - Displays micro-habits (2-5 min duration)
 *
 * Based on the 2-minute rule from James Clear's Atomic Habits.
 * Quick wins help users build momentum with easy-to-complete habits.
 */

import React, { memo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { Habit } from '../../types';

interface QuickWinsSectionProps {
  /** List of micro-habits (duration <= 5 min) */
  microHabits: Habit[];
  /** Render function for individual habit cards */
  renderHabitItem: (habit: Habit, index: number) => React.ReactNode;
}

export const QuickWinsSection = memo(function QuickWinsSection({
  microHabits,
  renderHabitItem,
}: QuickWinsSectionProps) {
  const { colors: themeColors, isDark } = useThemeColors();

  if (microHabits.length === 0) {
    return null;
  }

  return (
    <Animated.View entering={FadeInDown.duration(280).springify().damping(18)}>
      {/* Section header */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingVertical: 16,
          paddingBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: '700',
            color: themeColors.text.primary,
            marginBottom: 4,
          }}
        >
          ⚡ Quick wins
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: themeColors.text.tertiary,
          }}
        >
          Easy micro-habits to build momentum
        </Text>
      </View>

      {/* Habits list */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          gap: 12,
        }}
      >
        {microHabits.map((habit, index) => renderHabitItem(habit, index))}
      </ScrollView>

      {/* Bottom border */}
      <View
        style={{
          height: 1,
          backgroundColor: isDark ? themeColors.border : '#E5E7EB',
          marginHorizontal: 24,
          marginTop: 16,
        }}
      />
    </Animated.View>
  );
});
