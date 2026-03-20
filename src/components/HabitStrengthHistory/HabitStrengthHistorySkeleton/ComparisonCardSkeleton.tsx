/**
 * ComparisonCardSkeleton Component
 *
 * Skeleton hint for a single comparison card.
 */

import React from 'react';
import { View } from 'react-native';

import { SkeletonLoader } from '../../SkeletonLoader/SkeletonLoader';
import { useSkeletonTheme } from '../../SkeletonLoader/useSkeletonTheme';

interface ComparisonCardSkeletonProps {
  index: number;
  reduceMotion?: boolean;
}

export function ComparisonCardSkeleton({
  index,
  reduceMotion = false,
}: ComparisonCardSkeletonProps) {
  const { surfaceBg } = useSkeletonTheme();
  return (
    <View
      className='flex-1 items-center rounded-xl p-3'
      style={{ backgroundColor: surfaceBg }}
      testID={`skeleton-card-${index}`}
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
  );
}
