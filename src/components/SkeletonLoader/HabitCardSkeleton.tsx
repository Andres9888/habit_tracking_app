/**
 * HabitCardSkeleton - Loading skeleton for habit cards
 * Matches DraggableHabitCard layout: accent strip + header + divider + chain.
 */
import React from 'react';
import { View } from 'react-native';
import { shadows } from '../../theme/spacing';
import { SkeletonLoader, SKELETON_COLORS_LIGHT, SKELETON_COLORS_DARK } from './SkeletonLoader';
import { useSkeletonTheme } from './useSkeletonTheme';
import type { ReduceMotionProps } from './types';

const DAY_INDICES = [0, 1, 2, 3, 4, 5, 6];

export function HabitCardSkeleton({ reduceMotion = false }: ReduceMotionProps) {
  const { surfaceBg, borderColor, shadowColor, shadowOpacity, isDark } =
    useSkeletonTheme();
  const skeletonBase = isDark
    ? SKELETON_COLORS_DARK.base
    : SKELETON_COLORS_LIGHT.base;
  return (
    <View
      className='mb-5 flex-row overflow-hidden rounded-3xl'
      style={{
        ...shadows.card,
        backgroundColor: surfaceBg,
        borderColor,
        borderWidth: 1,
        shadowColor,
        shadowOpacity,
      }}
    >
      {/* Left accent strip (4px, matches ACCENT_TARGET_WIDTH) */}
      <View
        className='self-stretch rounded-bl-3xl rounded-tl-3xl'
        style={{ backgroundColor: skeletonBase, width: 4 }}
      />
      <View className='flex-1'>
        {/* CardHeader: icon + title + chevron */}
        <View className='mb-3 flex-row items-center px-3 pt-4'>
          <SkeletonLoader
            borderRadius={12}
            height={36}
            reduceMotion={reduceMotion}
            width={36}
          />
          <View className='ml-3 flex-1 gap-1.5'>
            <SkeletonLoader
              borderRadius={6}
              height={18}
              reduceMotion={reduceMotion}
              width='65%'
            />
            <SkeletonLoader
              borderRadius={4}
              height={12}
              reduceMotion={reduceMotion}
              width='35%'
            />
          </View>
          <SkeletonLoader
            borderRadius={9}
            height={18}
            reduceMotion={reduceMotion}
            width={18}
          />
        </View>
        {/* Divider */}
        <View
          className='mx-3 mb-3 h-[1.5px] rounded-full'
          style={{ backgroundColor: borderColor }}
        />
        {/* Chain visualizer: 7 day toggles */}
        <View className='flex-row items-center justify-between pb-5 pl-3 pr-4'>
          {DAY_INDICES.map((i) => (
            <SkeletonLoader
              key={i}
              borderRadius={10}
              height={44}
              reduceMotion={reduceMotion}
              width={44}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
