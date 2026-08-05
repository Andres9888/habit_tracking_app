import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import { shadows } from '../../theme/spacing';
import type { ReduceMotionProps } from './types';

interface ProfileHeroSkeletonProps extends ReduceMotionProps {
  borderColor: string;
  cardBg: string;
}

/** Skeleton for the settings profile hero card (avatar + stats strip). */
export function ProfileHeroSkeleton({
  borderColor,
  cardBg,
  reduceMotion = false,
}: ProfileHeroSkeletonProps) {
  return (
    <View
      className='mb-5 overflow-hidden rounded-2xl'
      style={{ backgroundColor: cardBg, ...shadows.card }}
    >
      <View className='items-center px-4 pb-1 pt-5'>
        <SkeletonLoader
          borderRadius={36}
          height={72}
          reduceMotion={reduceMotion}
          width={72}
        />
        <SkeletonLoader
          borderRadius={6}
          height={18}
          reduceMotion={reduceMotion}
          style={{ marginTop: 12 }}
          width={140}
        />
      </View>
      <View
        className='flex-row px-2 py-4'
        style={{ borderTopColor: borderColor, borderTopWidth: 1 }}
      >
        {[0, 1, 2].map((index) => (
          <View key={index} className='flex-1 items-center'>
            <SkeletonLoader
              borderRadius={6}
              height={18}
              reduceMotion={reduceMotion}
              width={18}
            />
            <SkeletonLoader
              borderRadius={6}
              height={22}
              reduceMotion={reduceMotion}
              style={{ marginTop: 6 }}
              width={28}
            />
            <SkeletonLoader
              borderRadius={4}
              height={12}
              reduceMotion={reduceMotion}
              style={{ marginTop: 6 }}
              width={52}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
