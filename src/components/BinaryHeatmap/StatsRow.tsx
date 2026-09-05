/**
 * StatsRow Component
 *
 * Displays habit statistics in a row format below the heatmap.
 */

import React, { memo } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import { Settings } from 'lucide-react-native';

import { usePressAnimation } from '@/hooks/usePressAnimation';
import type { StatsRowProps } from './types';
import { COLORS } from './constants';
import { useThemedStatsStyles } from './StatsRow.styles';
import { StreakBadge } from './StreakBadge';

const SETTINGS_ICON_SIZE = 18;
const PressableBase = Animated.createAnimatedComponent(Pressable);

export const StatsRow = memo(function StatsRow({
  frequency,
  currentStreak,
  habitColor,
  onSettingsPress,
}: StatsRowProps) {
  const styles = useThemedStatsStyles();
  const {
    animatedStyle: settingsAnimatedStyle,
    pressHandlers: settingsPressHandlers,
  } = usePressAnimation();

  return (
    <View
      accessible
      accessibilityLabel='Habit statistics'
      accessibilityRole='none'
      style={styles.container}
    >
      <View style={styles.badgesContainer}>
        <View
          accessible
          accessibilityLabel={`Frequency: ${frequency}`}
          accessibilityRole='text'
          style={styles.frequencyBadge}
        >
          <Text style={styles.frequencyText}>{frequency}</Text>
        </View>
        {currentStreak > 0 ? <StreakBadge currentStreak={currentStreak} habitColor={habitColor} /> : null}
      </View>
      {onSettingsPress ? <PressableBase
          accessible
          accessibilityHint='Opens habit settings and options'
          accessibilityLabel='Habit settings'
          accessibilityRole='button'
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          style={({ focused }: { focused: boolean }) => [
            styles.settingsButton,
            settingsAnimatedStyle,
            Platform.OS === 'web' && focused && styles.webFocus,
          ]}
          testID='stats-row-settings-button'
          onPress={onSettingsPress}
          {...settingsPressHandlers}
        >
          <Settings
            color={COLORS.TEXT_SECONDARY}
            size={SETTINGS_ICON_SIZE}
            strokeWidth={2}
            testID='settings-icon'
          />
        </PressableBase> : null}
    </View>
  );
});

export default StatsRow;
