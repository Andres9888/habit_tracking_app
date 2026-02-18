import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from '../SkeletonLoader';
import type { ReduceMotionProps } from '../types';

export function CharacterCardSkeleton({ reduceMotion }: ReduceMotionProps) {
  return (
    <View
      className='mb-6 items-center rounded-3xl border border-stone-100 bg-white p-6'
      style={{
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <SkeletonLoader
        borderRadius={40}
        height={80}
        reduceMotion={reduceMotion}
        width={80}
      />
      <View className='mt-3'>
        <SkeletonLoader
          borderRadius={6}
          height={22}
          reduceMotion={reduceMotion}
          width={140}
        />
      </View>
      <View className='mt-2'>
        <SkeletonLoader
          borderRadius={12}
          height={24}
          reduceMotion={reduceMotion}
          width={100}
        />
      </View>
      <View className='mt-3 w-full'>
        <SkeletonLoader
          borderRadius={4}
          height={8}
          reduceMotion={reduceMotion}
          width='100%'
        />
      </View>
    </View>
  );
}
