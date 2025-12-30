/**
 * StatsRow Component
 *
 * Displays habit statistics in a row format below the heatmap:
 * - Frequency badge (e.g., "Daily", "Weekly")
 * - Streak badge with fire icon showing current streak count
 * - Settings button for habit configuration
 *
 * This component follows the design spec:
 * - Frequency badge: bg-stone-100 text-stone-900
 * - Streak badge: bg-habit-color-50 text-habit-color with fire icon
 * - Settings button: 36x36px circular
 */

import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useReducedMotion,
} from 'react-native-reanimated';
import { Settings, Flame } from 'lucide-react-native';

import type { StatsRowProps } from './types';
import { COLORS, FOCUS } from './constants';

/**
 * Configuration for the stats row
 */
const STATS_CONFIG = {
  /** Badge border radius */
  BADGE_BORDER_RADIUS: 8,

  /** Badge horizontal padding */
  BADGE_PADDING_X: 12,

  /** Badge vertical padding */
  BADGE_PADDING_Y: 6,

  /** Icon size for flame */
  FLAME_ICON_SIZE: 14,

  /** Press scale factor */
  PRESS_SCALE: 0.95,

  /** Settings button dimensions */
  SETTINGS_BUTTON_SIZE: 36,

  /** Icon size for settings */
  SETTINGS_ICON_SIZE: 18,
  /** Spring config for press animation */
  SPRING_CONFIG: {
    damping: 15,
    stiffness: 400,
  },
} as const;

/**
 * Animated Pressable for press feedback
 */
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Utility to generate a lighter shade of a hex color (for badge background)
 * Creates a 50-level color (very light tint)
 */
function getHabitColor50(hexColor: string): string {
  // Parse hex to RGB
  const hex = hexColor.replace('#', '');
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);

  // Blend with white at 90% to create a very light tint (like Tailwind's 50 level)
  const blendFactor = 0.9;
  const newR = Math.round(r + (255 - r) * blendFactor);
  const newG = Math.round(g + (255 - g) * blendFactor);
  const newB = Math.round(b + (255 - b) * blendFactor);

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * StatsRow - Displays frequency badge, streak count, and settings button
 *
 * Layout:
 * [Frequency Badge] [🔥 Streak Badge]           [⚙️ Settings]
 *
 * The streak badge dynamically colors based on the habit's accent color,
 * creating a cohesive visual theme with the heatmap above.
 */
export const StatsRow = memo(function StatsRow({
  frequency,
  currentStreak,
  habitColor,
  onSettingsPress,
}: StatsRowProps) {
  const shouldReduceMotion = useReducedMotion();
  const settingsScale = useSharedValue(1);

  // Handle settings button press in/out
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

  // Animated style for settings button
  const settingsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: settingsScale.value }],
  }));

  // Dynamic streak badge colors
  const streakBadgeBackground = getHabitColor50(habitColor);

  // Format streak text
  const streakText =
    currentStreak === 1 ? '1 day streak' : `${currentStreak} day streak`;

  return (
    <View
      accessible
      accessibilityLabel='Habit statistics'
      accessibilityRole='none'
      style={styles.container}
    >
      {/* Left side: badges */}
      <View style={styles.badgesContainer}>
        {/* Frequency badge */}
        <View
          accessible
          accessibilityLabel={`Frequency: ${frequency}`}
          accessibilityRole='text'
          style={styles.frequencyBadge}
        >
          <Text style={styles.frequencyText}>{frequency}</Text>
        </View>

        {/* Streak badge */}
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

      {/* Right side: settings button */}
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

const styles = StyleSheet.create({
  badgesContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  } as ViewStyle,
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 4,
  } as ViewStyle,
  frequencyBadge: {
    backgroundColor: '#f5f5f4', // stone-100
    borderRadius: STATS_CONFIG.BADGE_BORDER_RADIUS,
    paddingHorizontal: STATS_CONFIG.BADGE_PADDING_X,
    paddingVertical: STATS_CONFIG.BADGE_PADDING_Y,
  } as ViewStyle,
  frequencyText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 12,
    fontWeight: '600',
  } as TextStyle,
  settingsButton: {
    alignItems: 'center',
    backgroundColor: '#f5f5f4', // stone-100
    borderRadius: STATS_CONFIG.SETTINGS_BUTTON_SIZE / 2,
    height: STATS_CONFIG.SETTINGS_BUTTON_SIZE,
    justifyContent: 'center',
    width: STATS_CONFIG.SETTINGS_BUTTON_SIZE,
    ...(Platform.OS === 'web'
      ? {
          cursor: 'pointer',
        }
      : {}),
  } as ViewStyle,
  streakBadge: {
    alignItems: 'center',
    borderRadius: STATS_CONFIG.BADGE_BORDER_RADIUS,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: STATS_CONFIG.BADGE_PADDING_X,
    paddingVertical: STATS_CONFIG.BADGE_PADDING_Y,
  } as ViewStyle,
  streakText: {
    fontSize: 12,
    fontWeight: '600',
  } as TextStyle,
  // Web-specific focus styles for keyboard navigation
  webFocus: {
    outlineColor: FOCUS.RING_COLOR,
    outlineOffset: FOCUS.RING_OFFSET,
    outlineStyle: 'solid',
    outlineWidth: FOCUS.RING_WIDTH,
  } as ViewStyle,
});

export default StatsRow;
