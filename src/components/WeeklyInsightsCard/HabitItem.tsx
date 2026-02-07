/**
 * HabitItem Component
 * Displays a single habit with change indicator
 */

import type { ComponentProps } from 'react';
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { colors } from '../../theme/colors';
import type { HabitChange, HabitChangeType } from './WeeklyInsightsCard.types';
import { habitItemStyles as styles } from './HabitItem.styles';

/** Valid Ionicons icon name */
type IconName = ComponentProps<typeof Ionicons>['name'];

interface HabitItemProps {
  habit: HabitChange;
  type: HabitChangeType;
  onPress?: (habitId: string) => void;
}

function getChangeIcon(type: HabitChangeType): {
  color: string;
  name: IconName;
} {
  if (type === 'gained') return { color: colors.success, name: 'trending-up' };
  if (type === 'lost') return { color: colors.error, name: 'trending-down' };
  return { color: colors.warning[500], name: 'warning' };
}

function getAccessibilityLabel(
  habit: HabitChange,
  type: HabitChangeType
): string {
  const status =
    type === 'gained' ? 'improved' : type === 'lost' ? 'declined' : 'at risk';
  const base = `${habit.emoji} ${habit.name}, ${status}`;
  if (type === 'risk') return base;
  const sign = habit.percentageChange > 0 ? '+' : '';
  return `${base}, ${sign}${Math.round(habit.percentageChange)}% change`;
}

export function HabitItem({ habit, type, onPress }: HabitItemProps) {
  const icon = getChangeIcon(type);

  return (
    <AnimatedPressable
      accessibilityHint='Opens habit detail'
      accessibilityLabel={getAccessibilityLabel(habit, type)}
      accessibilityRole='button'
      style={styles.habitItem}
      onPress={() => onPress?.(habit.habitId)}
    >
      <View style={styles.habitItemLeft}>
        <Text style={styles.habitEmoji}>{habit.emoji}</Text>
        <View style={styles.habitInfo}>
          <Text numberOfLines={1} style={styles.habitName}>
            {habit.name}
          </Text>
          <Text style={styles.habitStats}>
            {type === 'risk'
              ? `Only ${habit.thisWeek} completions • ${habit.currentStreak} day streak`
              : `${habit.thisWeek} vs ${habit.lastWeek} last week`}
          </Text>
        </View>
      </View>

      <View style={styles.habitItemRight}>
        <Ionicons color={icon.color} name={icon.name} size={20} />
        {type !== 'risk' && (
          <Text
            style={[
              styles.changePercentage,
              { color: type === 'gained' ? colors.success : colors.error },
            ]}
          >
            {habit.percentageChange > 0 ? '+' : ''}
            {Math.round(habit.percentageChange)}%
          </Text>
        )}
      </View>
    </AnimatedPressable>
  );
}
