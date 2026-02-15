/**
 * StatCard - Individual statistic card with animation
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export interface StatCardProps {
  bgColor: string;
  delay: number;
  icon: React.ReactNode;
  iconBgColor: string;
  label: string;
  suffix?: string;
  value: number | string;
  valueColor: string;
}

export function StatCard({
  bgColor,
  delay,
  icon,
  iconBgColor,
  label,
  suffix,
  value,
  valueColor,
}: StatCardProps) {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 18, stiffness: 150 })
    );
  }, [delay, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      className={`flex-1 rounded-xl p-4 ${bgColor}`}
      style={animatedStyle}
    >
      <View
        className={`mb-3 h-10 w-10 items-center justify-center rounded-full ${iconBgColor}`}
      >
        {icon}
      </View>
      <Text className={`text-3xl font-bold ${valueColor}`}>
        {value}
        {suffix && <Text className='text-xl'>{suffix}</Text>}
      </Text>
      <Text className='mt-1 text-xs font-medium text-stone-500'>{label}</Text>
    </Animated.View>
  );
}
