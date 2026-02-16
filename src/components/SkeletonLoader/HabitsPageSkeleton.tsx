/**
 * HabitsPageSkeleton - Full-page loading skeleton for habits page
 */
import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SkeletonLoader } from './SkeletonLoader';
import { HabitCardSkeleton } from './HabitCardSkeleton';
import { CalendarTimelineSkeleton } from './CalendarTimelineSkeleton';
import { MomentumMeterSkeleton } from './MomentumMeterSkeleton';
import type { ReduceMotionProps } from './types';

export function HabitsPageSkeleton({
  reduceMotion = false,
}: ReduceMotionProps) {
  return (
    <View
      accessible
      accessibilityLabel='Loading your habits...'
      accessibilityRole='progressbar'
      className='flex-1 gap-3 px-4 pt-16'
    >
      <View className='gap-3'>
        <View className='flex-row items-center justify-between'>
          <SkeletonLoader
            borderRadius={24}
            height={48}
            reduceMotion={reduceMotion}
            width={130}
          />
          <View className='flex-row gap-3'>
            <SkeletonLoader
              borderRadius={18}
              height={36}
              reduceMotion={reduceMotion}
              width={100}
            />
            <SkeletonLoader
              borderRadius={18}
              height={36}
              reduceMotion={reduceMotion}
              width={36}
            />
          </View>
        </View>
        <MomentumMeterSkeleton reduceMotion={reduceMotion} />
      </View>
      <CalendarTimelineSkeleton reduceMotion={reduceMotion} />
      <View className='mt-2 gap-0'>
        {[0, 1, 2].map((index) => (
          <Animated.View
            key={index}
            entering={reduceMotion ? undefined : FadeIn.duration(300).delay(index * 60)}
          >
            <HabitCardSkeleton reduceMotion={reduceMotion} />
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
