
import React from 'react';
import { View } from 'react-native';

import type { ReduceMotionProps } from '../types';
import { SkeletonLoader } from '../SkeletonLoader';

export function AttributeRowSkeleton({ reduceMotion }: ReduceMotionProps) {
  return (
    <View
      className='mb-3 overflow-hidden rounded-3xl border border-stone-100 bg-white'
      style={{
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <View className='flex-row items-center gap-3 px-6 py-5'>
        <SkeletonLoader
          borderRadius={12}
          height={40}
          reduceMotion={reduceMotion}
          width={40}
        />
        <View className='flex-1 gap-2'>
          <SkeletonLoader
            borderRadius={4}
            height={14}
            reduceMotion={reduceMotion}
            width='50%'
          />
          <SkeletonLoader
            borderRadius={4}
            height={8}
            reduceMotion={reduceMotion}
            width='100%'
          />
        </View>
        <SkeletonLoader
          borderRadius={4}
          height={18}
          reduceMotion={reduceMotion}
          width={40}
        />
      </View>
    </View>
  );
}
