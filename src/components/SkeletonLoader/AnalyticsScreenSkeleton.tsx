import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import type { ReduceMotionProps } from './types';

function StatCardSkeleton({ reduceMotion }: ReduceMotionProps) {
  return (
    <View className='m-1 flex-1 rounded-2xl bg-stone-50 p-4'>
      <SkeletonLoader
        borderRadius={4}
        height={12}
        reduceMotion={reduceMotion}
        width='55%'
      />
      <View className='mt-2'>
        <SkeletonLoader
          borderRadius={6}
          height={22}
          reduceMotion={reduceMotion}
          width='75%'
        />
      </View>
      <View className='mt-2'>
        <SkeletonLoader
          borderRadius={4}
          height={10}
          reduceMotion={reduceMotion}
          width='40%'
        />
      </View>
    </View>
  );
}

function ChartSkeleton({ reduceMotion }: ReduceMotionProps) {
  return (
    <View className='mb-4 rounded-2xl bg-stone-50 p-4'>
      <SkeletonLoader
        borderRadius={6}
        height={16}
        reduceMotion={reduceMotion}
        width={140}
      />
      <View
        className='mt-4 flex-row items-end justify-around'
        style={{ height: 160 }}
      >
        {[0.6, 0.35, 0.75, 0.5, 0.65, 0.4, 0.7].map((v, i) => (
          <SkeletonLoader
            key={i}
            borderRadius={4}
            height={Math.max(36, Math.round(160 * v))}
            reduceMotion={reduceMotion}
            width={24}
          />
        ))}
      </View>
    </View>
  );
}

export function AnalyticsScreenSkeleton({
  reduceMotion = false,
}: ReduceMotionProps) {
  return (
    <View className='flex-1 bg-stone-100 px-4 pt-16'>
      <SkeletonLoader
        borderRadius={8}
        height={28}
        reduceMotion={reduceMotion}
        width={160}
      />
      <View className='mb-4 mt-2'>
        <SkeletonLoader
          borderRadius={4}
          height={14}
          reduceMotion={reduceMotion}
          width={220}
        />
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
