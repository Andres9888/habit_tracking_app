/**
 * Loading state for HabitStrengthSection
 * Shows skeleton shimmer while strength is being computed.
 * Supports dark mode via useSkeletonTheme.
 */

import React from 'react';
import { View } from 'react-native';

import { SkeletonLoader } from '../../SkeletonLoader/SkeletonLoader';
import { useSkeletonTheme } from '../../SkeletonLoader/useSkeletonTheme';

export function LoadingState() {
  const { cardBg, shadowColor, shadowOpacity } = useSkeletonTheme();
  return (
    <View
      className='rounded-2xl p-5'
      style={{
        backgroundColor: cardBg,
        shadowColor,
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity,
        shadowRadius: 8,
      }}
    >
      <View className='h-48 items-center justify-center gap-3'>
        <SkeletonLoader borderRadius={8} height={16} width={180} />
        <SkeletonLoader borderRadius={8} height={80} width='100%' />
        <SkeletonLoader borderRadius={8} height={12} width={120} />
      </View>
    </View>
  );
}
