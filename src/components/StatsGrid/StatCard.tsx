/**
 * StatCard - Individual statistic card with animation
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';

export interface StatCardProps {
  bgColor: string;
  bgStyle?: Record<string, string>;
  delay: number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconBgStyle?: Record<string, string>;
  label: string;
  suffix?: string;
  value: number | string;
  valueColor: string;
  valueStyle?: Record<string, string>;
}

export function StatCard({
  bgColor,
  bgStyle,
  delay,
  icon,
  iconBgColor,
  iconBgStyle,
  label,
  suffix,
  value,
  valueColor,
  valueStyle,
}: StatCardProps) {
  const { colors: themeColors } = useThemeColors();
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    scale.value = withDelay(
      delay,
      withSpring(1, springs.standard)
    );
  }, [delay, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      className={`flex-1 rounded-xl p-4 ${bgColor}`}
      style={[animatedStyle, bgStyle]}
    >
      <View
        className={`mb-3 h-10 w-10 items-center justify-center rounded-full ${iconBgColor}`}
        style={iconBgStyle}
      >
        {icon}
      </View>
      <Text className={`text-3xl font-bold ${valueColor}`} style={valueStyle}>
        {value}
        {suffix ? <Text className='text-xl'>{suffix}</Text> : null}
      </Text>
      <Text className='mt-1 text-xs font-medium' style={{ color: themeColors.text.secondary }}>{label}</Text>
    </Animated.View>
  );
}
