import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import type { ReduceMotionProps } from './types';

function StatCardSkeleton({ reduceMotion }: ReduceMotionProps) {
  return (
    <View className='m-1 flex-1 rounded-2xl bg-stone-50 p-4'>
      <SkeletonLoader width='55%' height={12} borderRadius={4} reduceMotion={reduceMotion} />
      <View className='mt-2'>
        <SkeletonLoader width='75%' height={22} borderRadius={6} reduceMotion={reduceMotion} />
      </View>
      <View className='mt-2'>
        <SkeletonLoader width='40%' height={10} borderRadius={4} reduceMotion={reduceMotion} />
      </View>
    </View>
  );
}

function ChartSkeleton({ reduceMotion }: ReduceMotionProps) {
  return (
    <View className='mb-4 rounded-2xl bg-stone-50 p-4'>
      <SkeletonLoader width={140} height={16} borderRadius={6} reduceMotion={reduceMotion} />
      <View className='mt-4 flex-row items-end justify-around' style={{ height: 160 }}>
        {[0.6, 0.35, 0.75, 0.5, 0.65, 0.4, 0.7].map((v, i) => (
          <SkeletonLoader
            key={i}
            width={24}
            height={Math.max(36, Math.round(160 * v))}
            borderRadius={4}
            reduceMotion={reduceMotion}
          />
        ))}
      </View>
    </View>
  );
}

export function AnalyticsScreenSkeleton({ reduceMotion = false }: ReduceMotionProps) {
  return (
    <View className='flex-1 bg-stone-100 px-4 pt-16'>
      <SkeletonLoader width={160} height={28} borderRadius={8} reduceMotion={reduceMotion} />
      <View className='mb-4 mt-2'>
        <SkeletonLoader width={220} height={14} borderRadius={4} reduceMotion={reduceMotion} />
      </View>

      <View className='mb-4 flex-row flex-wrap'>
        <StatCardSkeleton reduceMotion={reduceMotion} />
        <StatCardSkeleton reduceMotion={reduceMotion} />
        <StatCardSkeleton reduceMotion={reduceMotion} />
        <StatCardSkeleton reduceMotion={reduceMotion} />
      </View>

      <ChartSkeleton reduceMotion={reduceMotion} />
      <ChartSkeleton reduceMotion={reduceMotion} />
    </View>
  );
}
