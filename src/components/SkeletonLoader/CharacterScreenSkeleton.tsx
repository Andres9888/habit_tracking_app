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

function CharacterCardSkeleton({
  reduceMotion,
  cardBg,
  borderColor,
  shadowColor,
  shadowOpacity,
}: ReduceMotionProps & {
  cardBg: string;
  borderColor: string;
  shadowColor: string;
  shadowOpacity: number;
}) {
  return (
    <View
      className='mb-6 items-center rounded-3xl border p-6'
      style={{
        backgroundColor: cardBg,
        borderColor,
        shadowColor,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity,
        shadowRadius: 16,
      }}
    >
      {/* Avatar */}
      <SkeletonLoader
        borderRadius={40}
        height={80}
        reduceMotion={reduceMotion}
        width={80}
      />
      {/* Name */}
      <View className='mt-3'>
        <SkeletonLoader
          borderRadius={6}
          height={22}
          reduceMotion={reduceMotion}
          width={140}
        />
      </View>
      {/* Level badge */}
      <View className='mt-2'>
        <SkeletonLoader
          borderRadius={12}
          height={24}
          reduceMotion={reduceMotion}
          width={100}
        />
      </View>
      {/* XP bar */}
      <View className='mt-3 w-full'>
        <SkeletonLoader
          borderRadius={4}
          height={8}
          reduceMotion={reduceMotion}
          width='100%'
        />
      </View>
    </View>
  );
}

function AttributeRowSkeleton({
  reduceMotion,
  cardBg,
  borderColor,
  shadowColor,
  shadowOpacity,
}: ReduceMotionProps & {
  cardBg: string;
  borderColor: string;
  shadowColor: string;
  shadowOpacity: number;
}) {
  return (
    <View
      className='mb-3 overflow-hidden rounded-3xl border'
      style={{
        backgroundColor: cardBg,
        borderColor,
        shadowColor,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity,
        shadowRadius: 16,
      }}
    >
      <View className='flex-row items-center gap-3 px-6 py-5'>
        <SkeletonLoader
          borderRadius={12}
          height={40}
          reduceMotion={reduceMotion}
          width={40}
        />
        <View className='flex-1 gap-2'>
          <SkeletonLoader
            borderRadius={4}
            height={14}
            reduceMotion={reduceMotion}
            width='50%'
          />
          <SkeletonLoader
            borderRadius={4}
            height={8}
            reduceMotion={reduceMotion}
            width='100%'
          />
        </View>
        <SkeletonLoader
          borderRadius={4}
          height={18}
          reduceMotion={reduceMotion}
          width={40}
        />
      </View>
    </View>
  );
}

function AchievementRowSkeleton({
  reduceMotion,
  cardBg,
  borderColor,
  shadowColor,
  shadowOpacity,
}: ReduceMotionProps & {
  cardBg: string;
  borderColor: string;
  shadowColor: string;
  shadowOpacity: number;
}) {
  return (
    <View
      className='mb-3 flex-row items-center gap-4 rounded-3xl border px-6 py-6'
      style={{
        backgroundColor: cardBg,
        borderColor,
        shadowColor,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity,
        shadowRadius: 16,
      }}
    >
      <SkeletonLoader
        borderRadius={24}
        height={48}
        reduceMotion={reduceMotion}
        width={48}
      />
      <View className='flex-1 gap-2'>
        <SkeletonLoader
          borderRadius={4}
          height={17}
          reduceMotion={reduceMotion}
          width='65%'
        />
        <SkeletonLoader
          borderRadius={4}
          height={13}
          reduceMotion={reduceMotion}
          width='45%'
        />
      </View>
      <SkeletonLoader
        borderRadius={6}
        height={28}
        reduceMotion={reduceMotion}
        width={28}
      />
    </View>
  );
}

export function CharacterScreenSkeleton({
  reduceMotion = false,
}: ReduceMotionProps) {
  const { pageBg, cardBg, borderColor, shadowColor, shadowOpacity } =
    useSkeletonTheme();
  const cardProps = { cardBg, borderColor, shadowColor, shadowOpacity };

  return (
    <View
      accessible
      accessibilityLabel='Loading character screen'
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
