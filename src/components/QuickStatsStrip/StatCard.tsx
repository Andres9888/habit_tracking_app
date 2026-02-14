/**
 * StatCard - Individual stat display with animated counting
 * Theme-aware with dark mode support
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../theme/ThemeContext';
import { useCountAnimation } from './useCountAnimation';
import type { StatCardProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Maps Tailwind-style color classes to semantic theme colors.
 * Falls back to the raw class for forwards compatibility.
 */
function resolveColor(
  colorClass: string,
  isDark: boolean
): string {
  const map: Record<string, string> = {
    'text-orange-500': isDark ? '#fb923c' : '#f97316',
    'text-violet-500': isDark ? '#a78bfa' : '#8b5cf6',
    'text-emerald-700': isDark ? '#34d399' : '#047857',
  };
  return map[colorClass] ?? (isDark ? '#e5e7eb' : '#1c1917');
}

export function StatCard({
  accessibilityHint,
  animationKey,
  color,
  delay,
  emoji,
  label,
  onPress,
  reduceMotion,
  suffix = '',
  targetValue,
}: StatCardProps) {
  const { colors, isDark } = useThemeColors();
  const scale = useSharedValue(1);
  const displayValue = useCountAnimation({
    animationKey,
    delay,
    reduceMotion,
    targetValue,
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const resolvedColor = resolveColor(color, isDark);

  return (
    <AnimatedPressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={`${label}: ${targetValue}${suffix}`}
      accessibilityRole='button'
      style={[
        animatedStyle,
        {
          alignItems: 'center',
          backgroundColor: colors.card,
          borderRadius: 12,
          flex: 1,
          padding: 12,
          shadowColor: isDark ? '#000' : colors.gray[300],
          shadowOffset: { height: 1, width: 0 },
          shadowOpacity: isDark ? 0.3 : 0.15,
          shadowRadius: 3,
          elevation: 2,
        },
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text
        accessibilityElementsHidden
        style={{
          color: resolvedColor,
          fontSize: 24,
          fontWeight: '700',
        }}
      >
        {displayValue}
        {suffix}
      </Text>
      <View
        accessibilityElementsHidden
        style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
      >
        <Text style={{ fontSize: 12 }}>{emoji}</Text>
        <Text style={{ fontSize: 12, color: colors.text.tertiary }}>
          {label}
        </Text>
      </View>
    </AnimatedPressable>
  );
}
