/**
 * HabitStrengthHistorySkeleton Component
 *
 * Loading skeleton for the Habit Strength History section.
 */

import React from 'react';
import { View } from 'react-native';

import { SkeletonLoader } from '../../SkeletonLoader/SkeletonLoader';
import { ComparisonCardSkeleton } from './ComparisonCardSkeleton';
import { GradientShimmerSkeleton } from './GradientShimmerSkeleton';
import { InsightCardSkeleton } from './InsightCardSkeleton';

export interface HabitStrengthHistorySkeletonProps {
  reduceMotion?: boolean;
}

export function HabitStrengthHistorySkeleton({
  reduceMotion = false,
}: HabitStrengthHistorySkeletonProps) {
  return (
    <View
      accessible
      accessibilityLabel='Loading your habit strength history...'
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

      {/* Comparison cards skeleton */}
      <View className='flex-row gap-2'>
        {[0, 1, 2].map((i) => (
          <ComparisonCardSkeleton
            key={i}
            index={i}
            reduceMotion={reduceMotion}
          />
        ))}
      </View>

      {/* Timeline chart skeleton */}
      <GradientShimmerSkeleton
        borderRadius={12}
        height={120}
        reduceMotion={reduceMotion}
      />

      {/* Insights row skeleton */}
      <View className='flex-row gap-2'>
        {[0, 1, 2].map((i) => (
          <InsightCardSkeleton key={i} index={i} reduceMotion={reduceMotion} />
        ))}
      </View>
    </View>
  );
}

export default HabitStrengthHistorySkeleton;
