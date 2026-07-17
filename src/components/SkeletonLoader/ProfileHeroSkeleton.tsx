import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import { shadows } from '../../theme/spacing';
import type { ReduceMotionProps } from './types';

interface ProfileHeroSkeletonProps extends ReduceMotionProps {
  cardBg: string;
}

/** Skeleton for the settings profile hero card (avatar + identity row). */
export function ProfileHeroSkeleton({
  cardBg,
  reduceMotion = false,
}: ProfileHeroSkeletonProps) {
  return (
    <View
      className='mb-5 flex-row items-center overflow-hidden rounded-2xl px-4 py-4'
      style={{ backgroundColor: cardBg, ...shadows.card, gap: 16 }}
    >
      <SkeletonLoader
        borderRadius={32}
        height={64}
        reduceMotion={reduceMotion}
        width={64}
      />
      <View className='flex-1'>
        <SkeletonLoader
          borderRadius={6}
          height={18}
          reduceMotion={reduceMotion}
          width={140}
        />
        <SkeletonLoader
          borderRadius={5}
          height={13}
          reduceMotion={reduceMotion}
          style={{ marginTop: 8 }}
          width={180}
        />
      </View>
    </View>
  );
}
