import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import type { ReduceMotionProps } from './types';

function Row({ reduceMotion }: ReduceMotionProps) {
  return (
    <View className='flex-row items-center border-b border-stone-200 px-4 py-4'>
      <SkeletonLoader borderRadius={10} height={38} reduceMotion={reduceMotion} width={38} />
      <View className='ml-3 flex-1'>
        <SkeletonLoader borderRadius={5} height={16} reduceMotion={reduceMotion} width='65%' />
      </View>
      <SkeletonLoader borderRadius={16} height={30} reduceMotion={reduceMotion} width={50} />
    </View>
  );
}

function Section({ reduceMotion, rows = 2 }: ReduceMotionProps & { rows?: number }) {
  return (
    <View className='mb-5'>
      <SkeletonLoader borderRadius={4} height={12} reduceMotion={reduceMotion} width={130} />
      <View className='mt-2 overflow-hidden rounded-2xl bg-white'>
        {Array.from({ length: rows }).map((_, i) => (
          <Row key={i} reduceMotion={reduceMotion} />
        ))}
      </View>
    </View>
  );
}

export function SettingsModalSkeleton({ reduceMotion = false }: ReduceMotionProps) {
  return (
    <View className='flex-1 bg-stone-100 px-4 pt-14'>
      <View className='mb-7 items-center'>
        <SkeletonLoader borderRadius={8} height={22} reduceMotion={reduceMotion} width={110} />
      </View>
      <Section reduceMotion={reduceMotion} rows={2} />
      <Section reduceMotion={reduceMotion} rows={2} />
      <Section reduceMotion={reduceMotion} rows={1} />
    </View>
  );
}
