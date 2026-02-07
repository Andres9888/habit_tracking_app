import React from 'react';
import { View, Text, Animated } from 'react-native';
import type { ProgressColors, MotivationalMessage } from './types';

interface StandardMeterProps {
  percentage: number;
  completedToday: number;
  totalHabits: number;
  colors: ProgressColors;
  message: MotivationalMessage;
  celebrationScale: Animated.Value;
  glowOpacity: Animated.Value;
  flameScale: Animated.Value;
  progressWidth: Animated.AnimatedInterpolation<string | number>;
}

export function StandardMeter({
  percentage,
  completedToday,
  totalHabits,
  colors,
  message,
  celebrationScale,
  glowOpacity,
  flameScale,
  progressWidth,
}: StandardMeterProps) {
  return (
    <Animated.View
      className='flex-row items-center gap-4 rounded-2xl px-4 py-3'
      style={{
        backgroundColor: colors.bg,
        elevation: percentage === 100 ? 4 : 0,
        shadowColor: percentage === 100 ? colors.glow : 'transparent',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: percentage === 100 ? 0.4 : 0,
        shadowRadius: 16,
        transform: [{ scale: celebrationScale }],
      }}
    >
      {/* Progress ring */}
      <View className='relative'>
        <View
          className='h-14 w-14 items-center justify-center rounded-full border-4'
          style={{ backgroundColor: 'transparent', borderColor: '#ffffff' }}
        >
          <View
            className='h-10 w-10 items-center justify-center rounded-full'
            style={{
              backgroundColor: percentage > 0 ? colors.fill : '#e7e5e4',
            }}
          >
            <Animated.Text
              className='text-lg'
              style={{ transform: [{ scale: flameScale }] }}
            >
              {message.emoji}
            </Animated.Text>
          </View>
        </View>
        <View
          className='absolute -bottom-1 -right-1 items-center justify-center rounded-full px-1.5 py-0.5'
          style={{ backgroundColor: colors.fill, minWidth: 28 }}
        >
          <Text className='text-[13px] font-bold text-white'>
            {percentage}%
          </Text>
        </View>
      </View>

      {/* Text content */}
      <View className='flex-1'>
        <Text className='text-[17px] font-bold' style={{ color: colors.text }}>
          {message.text}
        </Text>
        <Text className='mt-0.5 text-[13px] font-medium text-stone-500'>
          {completedToday} of {totalHabits} habits done
        </Text>
        <View className='mt-2'>
          <View
            className='h-1.5 overflow-hidden rounded-full'
            style={{ backgroundColor: '#ffffff' }}
          >
            <Animated.View
              className='h-full rounded-full'
              style={{ backgroundColor: colors.fill, width: progressWidth }}
            />
          </View>
        </View>
      </View>

      {/* Celebration sparkles */}
      {percentage === 100 && (
        <Animated.View style={{ opacity: glowOpacity }}>
          <Text className='text-2xl'>🎉</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}
