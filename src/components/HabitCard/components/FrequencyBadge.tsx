/**
 * FrequencyBadge Component
 *
 * Displays the habit frequency as a small badge under the habit name.
 * Shows labels like "3x/week", "MWF only", "Every 3 days", etc.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { Habit } from '../../../features/habits/types';
import type { FrequencyConfig } from '../../../../convex/habits/frequency';
import {
  parseFrequencyConfig,
  getFrequencyLabel,
} from '../../../../convex/habits/frequency';
import { styles } from '../HabitCard.styles';

interface FrequencyBadgeProps {
  habit: Habit;
}

/**
 * Parse frequency from habit document
 * Handles both new frequencyConfig field and legacy frequency/daysOfWeek fields
 */
function getHabitFrequencyConfig(habit: Habit): FrequencyConfig {
  // Try new frequencyConfig field first
  if (habit.frequencyConfig) {
    return parseFrequencyConfig(habit.frequencyConfig);
  }

  // Fall back to legacy fields
  if (habit.frequency === 'custom' && habit.daysOfWeek && habit.daysOfWeek.length > 0) {
    return {
      type: 'days',
      daysOfWeek: habit.daysOfWeek as any,
    };
  }

  // Default to daily
  return { type: 'daily' };
}

/**
 * FrequencyBadge component
 */
export function FrequencyBadge({ habit }: FrequencyBadgeProps) {
  const { colors: themeColors } = useThemeColors();
  const frequencyConfig = getHabitFrequencyConfig(habit);
  const label = getFrequencyLabel(frequencyConfig);

  // Don't show badge for daily habits (most common case)
  if (frequencyConfig.type === 'daily') {
    return null;
  }

  return (
    <View style={styles.frequencyBadgeContainer}>
      <Text
        style={[
          styles.frequencyBadgeText,
          {
            color: themeColors.text.tertiary,
            backgroundColor: themeColors.text.tertiary + '15', // 15% opacity
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default FrequencyBadge;
