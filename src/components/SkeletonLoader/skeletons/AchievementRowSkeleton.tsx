import React from 'react';
import { View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { shadows } from '@/theme/spacing';
import { SkeletonLoader } from '../SkeletonLoader';
import type { ReduceMotionProps } from '../types';

export function AchievementRowSkeleton({ reduceMotion }: ReduceMotionProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View
      className='mb-3 flex-row items-center gap-4 rounded-3xl border px-6 py-6'
      style={{
        borderColor: themeColors.border,
        backgroundColor: themeColors.card,
        ...shadows.floatingActionButton,
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
