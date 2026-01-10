/**
 * CalendarTimelineSkeleton - Loading skeleton for calendar timeline
 */
import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import type { ReduceMotionProps } from './types';

export function CalendarTimelineSkeleton({
  reduceMotion = false,
}: ReduceMotionProps) {
  return (
    <View
      className='rounded-2xl pb-3 pt-1'
      style={{ backgroundColor: '#fafaf9' }}
    >
      <View className='mb-3 flex-row items-center justify-between px-2'>
        <SkeletonLoader
          borderRadius={12}
          height={24}
          reduceMotion={reduceMotion}
          width={24}
        />
        <SkeletonLoader
          borderRadius={6}
          height={20}
          reduceMotion={reduceMotion}
          width={120}
        />
        <SkeletonLoader
          borderRadius={12}
          height={24}
          reduceMotion={reduceMotion}
          width={24}
        />
      </View>
      <View className='flex-row items-start justify-between'>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} className='flex-1 items-center gap-1'>
            <SkeletonLoader
              borderRadius={4}
              height={14}
              reduceMotion={reduceMotion}
              width={28}
            />
            <SkeletonLoader
              borderRadius={11}
              height={36}
              reduceMotion={reduceMotion}
              width={36}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
