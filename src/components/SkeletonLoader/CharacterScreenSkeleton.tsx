/* eslint-disable max-lines */
/**
 * CharacterScreenSkeleton - Loading skeleton for character/gamification screen
 * Matches layout: header, character card, attributes grid, stats, achievements
 * Supports dark mode via useSkeletonTheme.
 */
import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import { useSkeletonTheme } from './useSkeletonTheme';
import type { ReduceMotionProps } from './types';
import { CharacterCardSkeleton } from './skeletons/CharacterCardSkeleton';
import { AttributeRowSkeleton } from './skeletons/AttributeRowSkeleton';
import { AchievementRowSkeleton } from './skeletons/AchievementRowSkeleton';

export function CharacterScreenSkeleton({
  reduceMotion = false,
}: ReduceMotionProps) {
  const { pageBg, cardBg, borderColor, shadowColor, shadowOpacity } =
    useSkeletonTheme();
  const cardProps = { cardBg, borderColor, shadowColor, shadowOpacity };

  return (
    <View
      accessible
      accessibilityLabel='Loading your character and achievements...'
      accessibilityRole='progressbar'
      className='flex-1 px-6 pt-16'
      style={{ backgroundColor: pageBg }}
    >
      {/* Back button + header */}
      <View className='mb-4 flex-row items-center gap-3'>
        <SkeletonLoader
          borderRadius={12}
          height={36}
          reduceMotion={reduceMotion}
          width={36}
        />
        <SkeletonLoader
          borderRadius={6}
          height={22}
          reduceMotion={reduceMotion}
          width={140}
        />
      </View>

      <CharacterCardSkeleton reduceMotion={reduceMotion} {...cardProps} />

      {/* Attributes section title */}
      <View className='mb-3'>
        <SkeletonLoader
          borderRadius={4}
          height={17}
          reduceMotion={reduceMotion}
          width={100}
        />
      </View>
      <AttributeRowSkeleton reduceMotion={reduceMotion} {...cardProps} />
      <AttributeRowSkeleton reduceMotion={reduceMotion} {...cardProps} />
      <AttributeRowSkeleton reduceMotion={reduceMotion} {...cardProps} />

      {/* Achievements section title */}
      <View className='mb-3 mt-4'>
        <SkeletonLoader
          borderRadius={4}
          height={17}
          reduceMotion={reduceMotion}
          width={160}
        />
      </View>
      <AchievementRowSkeleton reduceMotion={reduceMotion} {...cardProps} />
      <AchievementRowSkeleton reduceMotion={reduceMotion} {...cardProps} />
    </View>
  );
}
