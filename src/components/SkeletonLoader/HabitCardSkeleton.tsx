/**
 * HabitCardSkeleton - Loading skeleton for habit cards
 */
import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import type { ReduceMotionProps } from './types';

export function HabitCardSkeleton({ reduceMotion = false }: ReduceMotionProps) {
  return (
    <View
      className='mb-5 overflow-hidden rounded-3xl p-5'
      style={{
        backgroundColor: '#fafaf9',
        elevation: 4,
        shadowColor: '#44403c',
        shadowOffset: { height: 6, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <View className='mb-4 flex-row items-center gap-3'>
        <SkeletonLoader
          borderRadius={12}
          height={44}
          reduceMotion={reduceMotion}
          width={44}
        />
        <View className='flex-1 gap-2'>
          <SkeletonLoader
            borderRadius={6}
            height={18}
            reduceMotion={reduceMotion}
            width='70%'
          />
          <SkeletonLoader
            borderRadius={4}
            height={12}
            reduceMotion={reduceMotion}
            width='40%'
          />
        </View>
        <SkeletonLoader
          borderRadius={20}
          height={28}
          reduceMotion={reduceMotion}
          width={60}
        />
      </View>
      <View className='mb-4 h-[1px]' style={{ backgroundColor: '#e7e5e4' }} />
      <View className='flex-row items-center justify-between'>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonLoader
            key={i}
            borderRadius={9}
            height={36}
            reduceMotion={reduceMotion}
            width={36}
          />
        ))}
      </View>
    </View>
  );
}
