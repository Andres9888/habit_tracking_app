/**
 * InitializeHabitStrengthSkeleton - Skeleton for habit strength initialization loading
 * Replaces the ActivityIndicator spinner when habits are loading
 */
import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';

export function InitializeHabitStrengthSkeleton() {
  return (
    <View
      accessible
      accessibilityLabel='Loading your habits and strength data...'
      accessibilityRole='progressbar'
      className='items-center justify-center p-4'
    >
      <SkeletonLoader borderRadius={12} height={24} width={24} />
      <View className='mt-3 gap-2'>
        <SkeletonLoader borderRadius={4} height={14} width={180} />
        <SkeletonLoader borderRadius={4} height={14} width={140} />
      </View>
    </View>
  );
}
