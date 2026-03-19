/**
 * TemplateListSkeleton - Skeleton for template list in CreateHabitModal
 * Matches layout: emoji icon + title/subtitle rows
 */
import React from 'react';
import { View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { SkeletonLoader } from './SkeletonLoader';
import type { ReduceMotionProps } from './types';

function TemplateItemSkeleton({ reduceMotion }: ReduceMotionProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='flex-row items-center gap-4 border-b px-4 py-3' style={{ borderColor: themeColors.border }}>
      <SkeletonLoader
        borderRadius={16}
        height={48}
        reduceMotion={reduceMotion}
        width={48}
      />
      <View className='flex-1 gap-2'>
        <SkeletonLoader
          borderRadius={4}
          height={16}
          reduceMotion={reduceMotion}
          width='65%'
        />
        <SkeletonLoader
          borderRadius={4}
          height={12}
          reduceMotion={reduceMotion}
          width='40%'
        />
      </View>
    </View>
  );
}

export function TemplateListSkeleton({
  reduceMotion = false,
}: ReduceMotionProps) {
  return (
    <View
      accessible
      accessibilityLabel='Loading habit templates...'
      accessibilityRole='progressbar'
      className='py-2'
    >
      <TemplateItemSkeleton reduceMotion={reduceMotion} />
      <TemplateItemSkeleton reduceMotion={reduceMotion} />
      <TemplateItemSkeleton reduceMotion={reduceMotion} />
      <TemplateItemSkeleton reduceMotion={reduceMotion} />
    </View>
  );
}
