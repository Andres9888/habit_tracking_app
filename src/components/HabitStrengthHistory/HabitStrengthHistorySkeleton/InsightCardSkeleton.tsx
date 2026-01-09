/**
 * InsightCardSkeleton Component
 *
 * Skeleton placeholder for a single insight card.
 */

import React from 'react';
import { View } from 'react-native';

import { SkeletonLoader } from '../../SkeletonLoader/SkeletonLoader';

interface InsightCardSkeletonProps {
  index: number;
  reduceMotion?: boolean;
}

export function InsightCardSkeleton({
  index,
  reduceMotion = false,
}: InsightCardSkeletonProps) {
  return (
    <View
      className='flex-1 flex-row items-center gap-2 rounded-lg bg-stone-50 px-3 py-2.5'
      testID={`skeleton-insight-${index}`}
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
  );
}
