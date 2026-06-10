/**
 * StrengthSkeleton
 *
 * Loading placeholder shown while habit strength is being calculated.
 * Mirrors the real section's rough layout (header, hero, chart, stats).
 */

import React from 'react';
import { View } from 'react-native';

import { useThemeColors } from '@/theme/ThemeContext';
import { shadows } from '@/theme/spacing';

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { SkeletonLoader } from '../SkeletonLoader/SkeletonLoader';

export const StrengthSkeleton = React.memo(function StrengthSkeleton() {
  const { colors: themeColors } = useThemeColors();
  const reduceMotion = useReduceMotion();

  return (
    <View
      accessible
      accessibilityLabel='Calculating habit strength'
      accessibilityRole='progressbar'
      className='rounded-2xl p-5'
      style={[{ backgroundColor: themeColors.card }, shadows.card]}
    >
      <View className='mb-4 flex-row items-center justify-between'>
        <SkeletonLoader borderRadius={6} height={20} reduceMotion={reduceMotion} width={140} />
        <SkeletonLoader borderRadius={999} height={28} reduceMotion={reduceMotion} width={120} />
      </View>
      <View className='mb-5 flex-row items-end gap-3'>
        <SkeletonLoader borderRadius={8} height={44} reduceMotion={reduceMotion} width={120} />
        <SkeletonLoader borderRadius={6} height={14} reduceMotion={reduceMotion} width={80} />
      </View>
      <SkeletonLoader borderRadius={12} height={120} reduceMotion={reduceMotion} />
      <View className='mt-4 flex-row gap-3'>
        <SkeletonLoader borderRadius={6} height={40} reduceMotion={reduceMotion} width='30%' />
        <SkeletonLoader borderRadius={6} height={40} reduceMotion={reduceMotion} width='30%' />
        <SkeletonLoader borderRadius={6} height={40} reduceMotion={reduceMotion} width='30%' />
      </View>
    </View>
  );
});
