/**
 * HabitCardSkeleton - Loading skeleton for habit cards
 * Supports dark mode via useSkeletonTheme.
 */
import React from 'react';
import { View } from 'react-native';
import { shadows } from '../../theme/spacing';
import { SkeletonLoader } from './SkeletonLoader';
import { useSkeletonTheme } from './useSkeletonTheme';
import type { ReduceMotionProps } from './types';

export function HabitCardSkeleton({ reduceMotion = false }: ReduceMotionProps) {
  const { surfaceBg, borderColor, shadowColor, shadowOpacity } = useSkeletonTheme();
  return (
    <View
      className='mb-5 overflow-hidden rounded-3xl p-5'
      style={{
        ...shadows.card,
        backgroundColor: surfaceBg,
        shadowColor,
        shadowOpacity,
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
      <View className='mb-4 h-[1px]' style={{ backgroundColor: borderColor }} />
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
