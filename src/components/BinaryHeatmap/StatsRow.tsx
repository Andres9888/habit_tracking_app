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
import { Settings } from 'lucide-react-native';

import { springs } from '@/theme/animations';
import type { StatsRowProps } from './types';
import { COLORS } from './constants';
import { useThemedStatsStyles } from './StatsRow.styles';
import { StreakBadge } from './StreakBadge';

const PRESS_SCALE = 0.95;
const SETTINGS_ICON_SIZE = 18;
const SPRING_CONFIG = springs.standard;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const StatsRow = memo(function StatsRow({
  frequency,
  currentStreak,
  habitColor,
  onSettingsPress,
}: StatsRowProps) {
  const styles = useThemedStatsStyles();
  const shouldReduceMotion = useReducedMotion();
  const settingsScale = useSharedValue(1);

  const handleSettingsPressIn = useCallback(() => {
    if (!shouldReduceMotion) {
      settingsScale.value = withSpring(PRESS_SCALE, SPRING_CONFIG);
    }
  }, [settingsScale, shouldReduceMotion]);

  const handleSettingsPressOut = useCallback(() => {
    if (!shouldReduceMotion) {
      settingsScale.value = withSpring(1, SPRING_CONFIG);
    }
  }, [settingsScale, shouldReduceMotion]);

  const settingsAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: settingsScale.value ?? 1 }],
    };
  });

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
      {onSettingsPress ? <AnimatedPressable
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
            size={SETTINGS_ICON_SIZE}
            strokeWidth={2}
            testID='settings-icon'
          />
        </AnimatedPressable> : null}
    </View>
  );
});

export default StatsRow;
