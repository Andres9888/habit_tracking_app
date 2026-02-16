/**
 * StatsRow Component
 *
 * Displays statistics row below the heatmap with frequency, streak, and settings button.
 *
 * UX Improvements:
 * - Theme-aware colors for dark mode visibility
 */

import React, { memo } from 'react';
import { View, Text } from 'react-native';

import type { StatsRowProps } from './types';
import { styles } from './StatsRow.styles';
import { useHeatmapColors } from './themeAwareColors';

export const StatsRow = memo(function StatsRow({
  frequency,
  currentStreak,
  habitColor,
  onSettingsPress,
}: StatsRowProps) {
  const colors = useHeatmapColors();

  return (
    <View
      accessible
      accessibilityLabel={`Habit frequency: ${frequency}. Current streak: ${currentStreak}`}
      accessibilityRole='text'
      style={styles.container}
    >
      <Text style={[styles.frequency, { color: colors.textSecondary }]}>
        {frequency}
      </Text>

      <View style={styles.streakContainer}>
        <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
          Streak:
        </Text>
        <View
          style={[
            styles.streakBadge,
            {
              backgroundColor: habitColor,
              marginLeft: 4,
            },
          ]}
        >
          <Text
            style={[
              styles.streakNumber,
              {
                color: getTextColorForBackground(habitColor),
              },
            ]}
          >
            {currentStreak}
          </Text>
        </View>
      </View>

      {onSettingsPress && (
        <Text
          accessible
          accessibilityLabel='Settings'
          accessibilityRole='button'
          style={[styles.frequency, { color: colors.textPrimary }]}
          onPress={onSettingsPress}
        >
          ⚙️
        </Text>
      )}
    </View>
  );
});

/**
 * Determine appropriate text color based on background color
 */
function getTextColorForBackground(backgroundColor: string): string {
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5 ? '#FFFFFF' : '#000000';
}

export default StatsRow;
