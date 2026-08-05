/**
 * InsightCard - Individual insight display card with icon, value, and label.
 * Extracted from StrengthInsightsRow for better modularity.
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';

const FADE_IN_DURATION = 400;

export interface InsightCardProps {
  /** Icon component to display */
  icon: React.ReactNode;
  /** Primary value to display */
  value: string;
  /** Label text below the value */
  label: string;
  /** Color for the value text */
  valueColor?: string;
  /** Animation delay in ms */
  animationDelay?: number;
  /** Accessibility label for the card */
  accessibilityLabel: string;
}

export function InsightCard({
  icon,
  value,
  label,
  valueColor = '#44403c', // stone-700
  animationDelay = 0,
  accessibilityLabel,
}: InsightCardProps) {
  const { colors: themeColors } = useThemeColors();
  const shouldReduceMotion = useReducedMotion();

  return (
    <Animated.View
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='text'
      className='flex-1 flex-row items-center gap-2 rounded-lg px-3 py-2.5'
      style={{ backgroundColor: themeColors.background }}
      entering={
        shouldReduceMotion
          ? undefined
          : FadeIn.delay(animationDelay).duration(FADE_IN_DURATION)
      }
    >
      <View className='items-center justify-center'>{icon}</View>
      <View className='flex-1'>
        <Text
          className='text-sm font-bold'
          numberOfLines={1}
          style={{ color: valueColor }}
        >
          {value}
        </Text>
        <Text className='text-xs' numberOfLines={1} style={{ color: themeColors.text.secondary }}>
          {label}
        </Text>
      </View>
    </Animated.View>
  );
}
