import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import { ProfileHeroSkeleton } from './ProfileHeroSkeleton';
import { useSkeletonTheme } from './useSkeletonTheme';
import type { ReduceMotionProps } from './types';

function ToggleRowSkeleton({
  reduceMotion,
  borderColor,
}: ReduceMotionProps & { borderColor: string }) {
  return (
    <View
      className='flex-row items-center px-4 py-4'
      style={{ borderBottomWidth: 1, borderBottomColor: borderColor }}
    >
      <SkeletonLoader
        borderRadius={10}
        height={38}
        reduceMotion={reduceMotion}
        width={38}
      />
      <View className='ml-3 flex-1'>
        <SkeletonLoader
          borderRadius={5}
          height={16}
          reduceMotion={reduceMotion}
          width='65%'
        />
      </View>
      <SkeletonLoader
        borderRadius={16}
        height={30}
        reduceMotion={reduceMotion}
        width={50}
      />
    </View>
  );
}

function SectionSkeleton({
  reduceMotion,
  rows = 2,
  cardBg,
  borderColor,
}: ReduceMotionProps & { rows?: number; cardBg: string; borderColor: string }) {
  return (
    <View className='mb-5'>
      <SkeletonLoader
        borderRadius={4}
        height={12}
        reduceMotion={reduceMotion}
        width={130}
      />
      <View
        className='mt-2 overflow-hidden rounded-2xl'
        style={{ backgroundColor: cardBg }}
      >
        {Array.from({ length: rows }).map((_, i) => (
          <ToggleRowSkeleton
            key={i}
            borderColor={borderColor}
            reduceMotion={reduceMotion}
          />
        ))}
      </View>
    </View>
  );
}

export function SettingsModalSkeleton({
  reduceMotion = false,
}: ReduceMotionProps) {
  const { pageBg, cardBg, borderColor } = useSkeletonTheme();
  return (
    <View className='flex-1 px-4 pt-2' style={{ backgroundColor: pageBg }}>
      <ProfileHeroSkeleton cardBg={cardBg} reduceMotion={reduceMotion} />
      <SectionSkeleton
        borderColor={borderColor}
        cardBg={cardBg}
        reduceMotion={reduceMotion}
        rows={2}
      />
      <SectionSkeleton
        borderColor={borderColor}
        cardBg={cardBg}
        reduceMotion={reduceMotion}
        rows={2}
      />
      <SectionSkeleton
        borderColor={borderColor}
        cardBg={cardBg}
        reduceMotion={reduceMotion}
        rows={1}
      />
    </View>
  );
}
