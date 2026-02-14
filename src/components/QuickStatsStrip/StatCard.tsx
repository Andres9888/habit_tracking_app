/**
 * StatCard - Individual stat display with animated counting
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../theme';
import { useCountAnimation } from './useCountAnimation';
import type { StatCardProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

  return (
    <AnimatedPressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={`${label}: ${targetValue}${suffix}`}
      accessibilityRole='button'
      className={`flex-1 items-center rounded-xl p-3`}
      style={[
        animatedStyle,
        {
          backgroundColor: colors.card,
          shadowColor: isDark ? '#000' : colors.gray[300],
          shadowOffset: { width: 0, height: 1 },
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
        className={`text-2xl font-bold ${color}`}
      >
        {displayValue}
        {suffix}
      </Text>
      <View accessibilityElementsHidden className='flex-row items-center gap-1'>
        <Text className='text-xs'>{emoji}</Text>
        <Text className='text-xs' style={{ color: colors.text.tertiary }}>
          {label}
        </Text>
      </View>
    </AnimatedPressable>
  );
}
