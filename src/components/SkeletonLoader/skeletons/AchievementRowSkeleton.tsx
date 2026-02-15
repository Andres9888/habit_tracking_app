
import React from 'react';
import { View } from 'react-native';

import type { ReduceMotionProps } from '../types';
import { SkeletonLoader } from '../SkeletonLoader';

export function AchievementRowSkeleton({ reduceMotion }: ReduceMotionProps) {
  return (
    <View
      className='mb-3 flex-row items-center gap-4 rounded-3xl border border-stone-100 bg-white px-6 py-6'
      style={{
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <SkeletonLoader
        borderRadius={24}
        height={48}
        reduceMotion={reduceMotion}
        width={48}
      />
      <View className='flex-1 gap-2'>
        <SkeletonLoader
          borderRadius={4}
          height={17}
          reduceMotion={reduceMotion}
          width='65%'
        />
        <SkeletonLoader
          borderRadius={4}
          height={13}
          reduceMotion={reduceMotion}
          width='45%'
        />
      </View>
      <SkeletonLoader
        borderRadius={6}
        height={28}
        reduceMotion={reduceMotion}
        width={28}
      />
    </View>
  );
}
