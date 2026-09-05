/**
 * HabitListSection Component
 * Collapsible section for habit lists (gained, lost, at-risk)
 */

import React from 'react';
import { View, Text } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { ChevronUp, ChevronDown } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '../../theme/colors';
import type { HabitChange, HabitChangeType } from './WeeklyInsightsCard.types';
import { styles } from './WeeklyInsightsCard.styles';
import { HabitItem } from './HabitItem';

interface HabitListSectionProps {
  habits: HabitChange[];
  title: string;
  type: HabitChangeType;
  Icon: LucideIcon;
  iconColor: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  isExpanded: boolean;
  onToggle: () => void;
  onHabitPress?: (habitId: string) => void;
  children?: React.ReactNode;
}

export function HabitListSection({
  habits,
  title,
  type,
  Icon,
  iconColor,
  badgeBgColor = '#D1FAE5',
  badgeTextColor = colors.success,
  isExpanded,
  onToggle,
  onHabitPress,
  children,
}: HabitListSectionProps) {
  if (habits.length === 0) return null;

  return (
    <AnimatedPressable
      // Expand/collapse toggle; no haptic anywhere else in the chain.
      animationConfig={{ enableHaptics: true }}
      accessibilityLabel={`${title}, ${habits.length} habits, ${isExpanded ? 'expanded' : 'collapsed'}`}
      accessibilityRole='button'
      accessibilityState={{ expanded: isExpanded }}
      style={styles.section}
      onPress={onToggle}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <Icon color={iconColor} size={iconSizes.medium} />
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={[styles.badge, { backgroundColor: badgeBgColor }]}>
            <Text style={[styles.badgeText, { color: badgeTextColor }]}>
              {habits.length}
            </Text>
          </View>
        </View>
        {isExpanded ? (
          <ChevronUp color={colors.text.tertiary} size={iconSizes.medium} />
        ) : (
          <ChevronDown color={colors.text.tertiary} size={iconSizes.medium} />
        )}
      </View>

      {isExpanded ? <View style={styles.sectionContent}>
          {habits.map((habit) => (
            <HabitItem
              key={habit.habitId}
              habit={habit}
              type={type}
              onPress={onHabitPress}
            />
          ))}
          {children}
        </View> : null}
    </AnimatedPressable>
  );
}
