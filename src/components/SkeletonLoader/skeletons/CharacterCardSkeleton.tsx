import React from 'react';
import { View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { shadows } from '@/theme/spacing';
import { SkeletonLoader } from '../SkeletonLoader';
import type { ReduceMotionProps } from '../types';

export function CharacterCardSkeleton({ reduceMotion }: ReduceMotionProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View
      className='mb-6 items-center rounded-3xl border p-6'
      style={{
        borderColor: themeColors.border,
        backgroundColor: themeColors.card,
        ...shadows.floatingActionButton,
      }}
    >
      <SkeletonLoader
        borderRadius={40}
        height={80}
        reduceMotion={reduceMotion}
        width={80}
      />
      <View className='mt-3'>
        <SkeletonLoader
          borderRadius={6}
          height={22}
          reduceMotion={reduceMotion}
          width={140}
        />
      </View>
      <View className='mt-2'>
        <SkeletonLoader
          borderRadius={12}
          height={24}
          reduceMotion={reduceMotion}
          width={100}
        />
      </View>
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
