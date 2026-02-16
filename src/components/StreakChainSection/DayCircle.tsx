/**
 * DayCircle Component
 * Individual day indicator in the 7-day streak chain
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { Check, Zap } from 'lucide-react-native';
import type { DayCircleProps } from './types';

export function DayCircle({
  completed,
  index,
  isToday,
  label,
  todayCompleted,
}: DayCircleProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    const delay = index * 35;
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 18, stiffness: 150 })
    );
    opacity.value = withDelay(delay, withTiming(1, { duration: 120 }));

    if (isToday && !todayCompleted) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }

    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      cancelAnimation(pulse);
    };
  }, [index, isToday, todayCompleted, scale, opacity, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        scale:
          isToday && !todayCompleted ? scale.value * pulse.value : scale.value,
      },
    ],
  }));

  const circleClass = completed
    ? 'bg-emerald-500'
    : isToday
      ? 'border-2 border-amber-400 bg-amber-50'
      : 'bg-stone-100';

  const labelColor = isToday
    ? 'text-amber-600'
    : completed
      ? 'text-emerald-600'
      : 'text-stone-400';

  const a11yLabel = isToday
    ? `${label}, today${todayCompleted ? ', completed' : ', not yet completed'}`
    : `${label}${completed ? ', completed' : ', not completed'}`;

  return (
    <Animated.View
      accessible
      accessibilityLabel={a11yLabel}
      accessibilityRole="image"
      className='flex-1 items-center'
      style={animatedStyle}
    >
      <View
        className={`mb-1.5 h-10 w-10 items-center justify-center rounded-full ${circleClass}`}
      >
        {completed ? (
          <Check className='text-white' size={20} strokeWidth={3} />
        ) : isToday ? (
          <Zap className='text-amber-500' fill='#f59e0b' size={18} />
        ) : null}
      </View>
      <Text className={`text-[10px] font-medium ${labelColor}`}>{label}</Text>
    </Animated.View>
  );
}
