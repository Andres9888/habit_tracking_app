/**
 * HabitStrengthHistorySkeleton Component
 *
 * Loading skeleton for the Habit Strength History section.
 * Displays shimmer placeholders matching the layout of the actual content.
 */

import React from 'react';
import { View } from 'react-native';

import { SkeletonLoader } from '../SkeletonLoader/SkeletonLoader';

interface HabitStrengthHistorySkeletonProps {
  reduceMotion?: boolean;
}

export function HabitStrengthHistorySkeleton({
  reduceMotion = false,
}: HabitStrengthHistorySkeletonProps) {
  return (
    <View
      accessible
      accessibilityLabel='Loading habit strength history'
      className='gap-4'
      testID='habit-strength-history-skeleton'
    >
      {/* Header skeleton */}
      <View className='flex-row items-center justify-between'>
        <SkeletonLoader
          borderRadius={6}
          height={20}
          reduceMotion={reduceMotion}
          width={140}
        />
        <SkeletonLoader
          borderRadius={10}
          height={20}
          reduceMotion={reduceMotion}
          width={20}
        />
      </View>

      {/* Comparison cards skeleton (3 cards) */}
      <View className='flex-row gap-2'>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            className='flex-1 items-center rounded-xl bg-stone-50 p-3'
          >
            <SkeletonLoader
              borderRadius={28}
              height={56}
              reduceMotion={reduceMotion}
              width={56}
            />
            <View className='mt-2 w-full items-center gap-1'>
              <SkeletonLoader
                borderRadius={4}
                height={12}
                reduceMotion={reduceMotion}
                width={40}
              />
              <SkeletonLoader
                borderRadius={4}
                height={12}
                reduceMotion={reduceMotion}
                width={60}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Timeline chart skeleton */}
      <SkeletonLoader
        borderRadius={12}
        height={120}
        reduceMotion={reduceMotion}
        width='100%'
      />

      {/* Insights row skeleton (3 cards) */}
      <View className='flex-row gap-2'>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            className='flex-1 flex-row items-center gap-2 rounded-lg bg-stone-50 px-3 py-2.5'
          >
            <SkeletonLoader
              borderRadius={9}
              height={18}
              reduceMotion={reduceMotion}
              width={18}
            />
            <View className='flex-1 gap-1'>
              <SkeletonLoader
                borderRadius={4}
                height={14}
                reduceMotion={reduceMotion}
                width={40}
              />
              <SkeletonLoader
                borderRadius={3}
                height={10}
                reduceMotion={reduceMotion}
                width={50}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default HabitStrengthHistorySkeleton;
