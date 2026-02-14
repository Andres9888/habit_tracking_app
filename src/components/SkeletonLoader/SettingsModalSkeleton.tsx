import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import type { ReduceMotionProps } from './types';

function Row({ reduceMotion }: ReduceMotionProps) {
  return (
    <View className='flex-row items-center border-b border-stone-200 px-4 py-4'>
      <SkeletonLoader width={38} height={38} borderRadius={10} reduceMotion={reduceMotion} />
      <View className='ml-3 flex-1'>
        <SkeletonLoader width='65%' height={16} borderRadius={5} reduceMotion={reduceMotion} />
      </View>
      <SkeletonLoader width={50} height={30} borderRadius={16} reduceMotion={reduceMotion} />
    </View>
  );
}

function Section({ reduceMotion, rows = 2 }: ReduceMotionProps & { rows?: number }) {
  return (
    <View className='mb-5'>
      <SkeletonLoader width={130} height={12} borderRadius={4} reduceMotion={reduceMotion} />
      <View className='mt-2 overflow-hidden rounded-2xl bg-white'>
        {Array.from({ length: rows }).map((_, i) => (
          <View key={i}>
            <Row reduceMotion={reduceMotion} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function SettingsModalSkeleton({ reduceMotion = false }: ReduceMotionProps) {
  return (
    <View className='flex-1 bg-stone-100 px-4 pt-14'>
      <View className='mb-7 items-center'>
        <SkeletonLoader width={110} height={22} borderRadius={8} reduceMotion={reduceMotion} />
      </View>
      <Section reduceMotion={reduceMotion} rows={2} />
      <Section reduceMotion={reduceMotion} rows={2} />
      <Section reduceMotion={reduceMotion} rows={1} />
    </View>
  );
}
