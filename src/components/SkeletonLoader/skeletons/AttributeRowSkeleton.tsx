import React from 'react';
import { View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { shadows } from '@/theme/spacing';
import { SkeletonLoader } from '../SkeletonLoader';
import type { ReduceMotionProps } from '../types';

export function AttributeRowSkeleton({ reduceMotion }: ReduceMotionProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View
      className='mb-3 overflow-hidden rounded-3xl border'
      style={{
        borderColor: themeColors.border,
        backgroundColor: themeColors.card,
        ...shadows.floatingActionButton,
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
