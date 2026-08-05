/**
 * MomentumMeterSkeleton - Loading skeleton for momentum meter
 */
import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import { useSkeletonTheme } from './useSkeletonTheme';
import type { ReduceMotionProps } from './types';

export function MomentumMeterSkeleton({
  reduceMotion = false,
}: ReduceMotionProps) {
  const { surfaceBg } = useSkeletonTheme();
  return (
    <View
      className='flex-row items-center gap-4 rounded-2xl px-4 py-3'
      style={{ backgroundColor: surfaceBg }}
    >
      <SkeletonLoader
        borderRadius={28}
        height={56}
        reduceMotion={reduceMotion}
        width={56}
      />
      <View className='flex-1 gap-2'>
        <SkeletonLoader
          borderRadius={6}
          height={18}
          reduceMotion={reduceMotion}
          width='60%'
        />
        <SkeletonLoader
          borderRadius={4}
          height={14}
          reduceMotion={reduceMotion}
          width='80%'
        />
        <SkeletonLoader
          borderRadius={4}
          height={6}
          reduceMotion={reduceMotion}
          width='100%'
        />
      </View>
    </View>
  );
}
