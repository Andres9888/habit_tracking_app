/**
 * TrendBadge Component
 *
 * Animated badge showing the trend direction and percentage change.
 * Uses inline style colors for full dark-mode support.
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useIsDark } from '../../../theme/ThemeContext';

import type { TrendStyle } from './types';

interface TrendBadgeProps {
  trendStyle: TrendStyle;
  rateChange: number;
}

export function TrendBadge({ trendStyle, rateChange }: TrendBadgeProps) {
  const TrendIcon = trendStyle.icon;
  const isDark = useIsDark();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bgColor = isDark ? trendStyle.bgColorDark : trendStyle.bgColorLight;
  const textColor = isDark ? trendStyle.textColorDark : trendStyle.textColorLight;
  const iconColor = isDark ? trendStyle.iconColorDark : trendStyle.iconColorLight;

  return (
    <Animated.View style={animatedStyle}>
      <View
        className='flex-row items-center gap-1 rounded-full px-2 py-1'
        style={{ backgroundColor: bgColor }}
      >
        <TrendIcon color={iconColor} size={12} />
        <Text className='text-xs font-semibold' style={{ color: textColor }}>
          {rateChange > 0 ? '+' : ''}
          {rateChange}%
        </Text>
      </View>
    </Animated.View>
  );
}
