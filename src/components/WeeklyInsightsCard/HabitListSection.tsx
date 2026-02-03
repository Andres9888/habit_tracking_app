/**
 * HabitListSection Component
 * Collapsible section for habit lists (gained, lost, at-risk)
 */

import type { ComponentProps } from 'react';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import type { HabitChange, HabitChangeType } from './WeeklyInsightsCard.types';
import { styles } from './WeeklyInsightsCard.styles';
import { HabitItem } from './HabitItem';

/** Valid Ionicons icon name */
type IconName = ComponentProps<typeof Ionicons>['name'];

interface HabitListSectionProps {
  habits: HabitChange[];
  title: string;
  type: HabitChangeType;
  iconName: IconName;
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
  iconName,
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
    <TouchableOpacity
      accessibilityLabel={`${title}, ${habits.length} habits, ${isExpanded ? 'expanded' : 'collapsed'}`}
      accessibilityRole='button'
      accessibilityState={{ expanded: isExpanded }}
      activeOpacity={0.7}
      style={styles.section}
      onPress={onToggle}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <Ionicons color={iconColor} name={iconName} size={20} />
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={[styles.badge, { backgroundColor: badgeBgColor }]}>
            <Text style={[styles.badgeText, { color: badgeTextColor }]}>
              {habits.length}
            </Text>
          </View>
        </View>
        <Ionicons
          color={colors.text.tertiary}
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
        />
      </View>

      {isExpanded && (
        <View style={styles.sectionContent}>
          {habits.map((habit) => (
            <HabitItem
              key={habit.habitId}
              habit={habit}
              type={type}
              onPress={onHabitPress}
            />
          ))}
          {children}
        </View>
      )}
    </TouchableOpacity>
  );
}
