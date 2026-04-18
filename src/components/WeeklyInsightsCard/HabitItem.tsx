/**
 * HabitItem Component
 * Displays a single habit with change indicator
 */

import React from 'react';
import { View, Text } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '../../theme/colors';
import type { HabitChange, HabitChangeType } from './WeeklyInsightsCard.types';
import { habitItemStyles as styles } from './HabitItem.styles';

interface HabitItemProps {
  habit: HabitChange;
  type: HabitChangeType;
  onPress?: (habitId: string) => void;
}

function getChangeIcon(type: HabitChangeType): {
  color: string;
  Icon: LucideIcon;
} {
  if (type === 'gained') return { color: colors.success, Icon: TrendingUp };
  if (type === 'lost') return { color: colors.error, Icon: TrendingDown };
  return { color: colors.warning[500], Icon: AlertTriangle };
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
  const { color: iconColor, Icon } = getChangeIcon(type);

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
        <Icon color={iconColor} size={iconSizes.medium} />
        {type === 'risk' ? null : <Text
            style={[
              styles.changePercentage,
              { color: type === 'gained' ? colors.success : colors.error },
            ]}
          >
            {habit.percentageChange > 0 ? '+' : ''}
            {Math.round(habit.percentageChange)}%
          </Text>}
      </View>
    </AnimatedPressable>
  );
}
