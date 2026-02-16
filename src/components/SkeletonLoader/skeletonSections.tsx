import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import type { ReduceMotionProps } from './types';

export function HeaderSection({ reduceMotion }: ReduceMotionProps) {
  return (
    <View className='items-center pb-4'>
      <SkeletonLoader
        borderRadius={16}
        height={80}
        reduceMotion={reduceMotion}
        width={80}
      />
      <View className='mt-3'>
        <SkeletonLoader
          borderRadius={6}
          height={22}
          reduceMotion={reduceMotion}
          width={160}
        />
      </View>
      <View className='mt-2'>
        <SkeletonLoader
          borderRadius={14}
          height={28}
          reduceMotion={reduceMotion}
          width={120}
        />
      </View>
    </View>
  );
}

export function ChartSection({ reduceMotion }: ReduceMotionProps) {
  return (
    <View className='mb-4 rounded-2xl bg-white p-4'>
      <SkeletonLoader
        borderRadius={4}
        height={14}
        reduceMotion={reduceMotion}
        width={140}
      />
      <View className='mt-3'>
        <SkeletonLoader
          borderRadius={12}
          height={150}
          reduceMotion={reduceMotion}
          width='100%'
        />
      </View>
      <View className='mt-4 flex-row justify-between'>
        {[0, 1, 2].map((i) => (
          <View key={i} className='items-center'>
            <SkeletonLoader
              borderRadius={4}
              height={20}
              reduceMotion={reduceMotion}
              width={42}
            />
            <View className='mt-1'>
              <SkeletonLoader
                borderRadius={4}
                height={10}
                reduceMotion={reduceMotion}
                width={62}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function CalendarSection({ reduceMotion }: ReduceMotionProps) {
  return (
    <View className='rounded-2xl bg-white p-4'>
      <SkeletonLoader
        borderRadius={4}
        height={14}
        reduceMotion={reduceMotion}
        width={120}
      />
      <View className='mt-3 flex-row justify-around'>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonLoader
            key={i}
            borderRadius={3}
            height={12}
            reduceMotion={reduceMotion}
            width={20}
          />
        ))}
      </View>
      {[0, 1, 2, 3, 4].map((row) => (
        <View key={row} className='mt-2 flex-row justify-around'>
          {[0, 1, 2, 3, 4, 5, 6].map((col) => (
            <SkeletonLoader
              key={col}
              borderRadius={8}
              height={34}
              reduceMotion={reduceMotion}
              width={34}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
