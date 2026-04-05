/**
 * TrendBadge Component
 *
 * Animated badge showing the trend direction and percentage change.
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import type { TrendStyle } from './types';
import { iconSizes } from '@/theme/iconSizes';

interface TrendBadgeProps {
  trendStyle: TrendStyle;
  rateChange: number;
}

export function TrendBadge({ trendStyle, rateChange }: TrendBadgeProps) {
  const TrendIcon = trendStyle.icon;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <View
        className='flex-row items-center gap-1 rounded-full px-2 py-1'
        style={{ backgroundColor: trendStyle.bgColor }}
      >
        <TrendIcon color={trendStyle.textColor} size={iconSizes.small} />
        <Text className='text-xs font-semibold' style={{ color: trendStyle.textColor }}>
          {rateChange > 0 ? '+' : ''}
          {rateChange}%
        </Text>
      </View>
    </Animated.View>
  );
}
