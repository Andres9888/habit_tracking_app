/**
 * StatsRow Component
 *
 * Displays habit statistics in a row format below the heatmap.
 */

import React, { memo, useCallback } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useReducedMotion,
} from 'react-native-reanimated';
import { Settings, Flame } from 'lucide-react-native';

import type { StatsRowProps } from './types';
import { COLORS } from './constants';
import { styles } from './StatsRow.styles';
import { getHabitColor50, formatStreakText } from './StatsRow.helpers';

const STATS_CONFIG = {
  FLAME_ICON_SIZE: 14,
  PRESS_SCALE: 0.95,
  SETTINGS_ICON_SIZE: 18,
  SPRING_CONFIG: { damping: 15, stiffness: 400 },
} as const;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const StatsRow = memo(function StatsRow({
  frequency,
  currentStreak,
  habitColor,
  onSettingsPress,
}: StatsRowProps) {
  const shouldReduceMotion = useReducedMotion();
  const settingsScale = useSharedValue(1);

  const handleSettingsPressIn = useCallback(() => {
    if (!shouldReduceMotion) {
      settingsScale.value = withSpring(
        STATS_CONFIG.PRESS_SCALE,
        STATS_CONFIG.SPRING_CONFIG
      );
    }
  }, [settingsScale, shouldReduceMotion]);

  const handleSettingsPressOut = useCallback(() => {
    if (!shouldReduceMotion) {
      settingsScale.value = withSpring(1, STATS_CONFIG.SPRING_CONFIG);
    }
  }, [settingsScale, shouldReduceMotion]);

  const settingsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: settingsScale.value }],
  }));

  const streakBadgeBackground = getHabitColor50(habitColor);
  const streakText = formatStreakText(currentStreak);

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
        {currentStreak > 0 && (
          <View
            accessible
            accessibilityLabel={`Current streak: ${streakText}`}
            accessibilityRole='text'
            style={[
              styles.streakBadge,
              { backgroundColor: streakBadgeBackground },
            ]}
          >
            <Flame
              color={habitColor}
              size={STATS_CONFIG.FLAME_ICON_SIZE}
              strokeWidth={2.5}
              testID='streak-flame-icon'
            />
            <Text style={[styles.streakText, { color: habitColor }]}>
              {streakText}
            </Text>
          </View>
        )}
      </View>
      {onSettingsPress && (
        <AnimatedPressable
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
          onPressIn={handleSettingsPressIn}
          onPressOut={handleSettingsPressOut}
        >
          <Settings
            color={COLORS.TEXT_SECONDARY}
            size={STATS_CONFIG.SETTINGS_ICON_SIZE}
            strokeWidth={2}
            testID='settings-icon'
          />
        </AnimatedPressable>
      )}
    </View>
  );
});

export default StatsRow;
