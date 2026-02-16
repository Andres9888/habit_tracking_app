/**
 * HabitEditSkeleton - Loading skeleton shown while habit data loads in the edit modal.
 * Matches the edit form layout: header, name input, emoji/color pickers, reminder toggle.
 */
import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { useSkeletonTheme } from '../../components/SkeletonLoader/useSkeletonTheme';

export function HabitEditSkeleton() {
  const { pageBg, cardBg } = useSkeletonTheme();
  return (
    <View
      accessible
      accessibilityLabel='Loading habit editor...'
      accessibilityRole='progressbar'
      className='flex-1 px-5 pt-6'
      style={{ backgroundColor: pageBg }}
    >
      {/* Header: Cancel / Title / Save */}
      <View className='mb-6 flex-row items-center justify-between'>
        <SkeletonLoader borderRadius={6} height={18} width={60} />
        <SkeletonLoader borderRadius={6} height={22} width={100} />
        <SkeletonLoader borderRadius={6} height={18} width={50} />
      </View>

      {/* Name input */}
      <View className='mb-6'>
        <SkeletonLoader borderRadius={4} height={13} width={80} />
        <View className='mt-2'>
          <SkeletonLoader borderRadius={12} height={48} width='100%' />
        </View>
      </View>

      {/* Emoji picker */}
      <View className='mb-6'>
        <SkeletonLoader borderRadius={4} height={13} width={50} />
        <View className='mt-2 flex-row gap-3'>
          {[0, 1, 2, 3, 4].map((i) => (
            <SkeletonLoader key={i} borderRadius={14} height={48} width={48} />
          ))}
        </View>
      </View>

      {/* Color picker */}
      <View className='mb-6'>
        <SkeletonLoader borderRadius={4} height={13} width={45} />
        <View className='mt-2 flex-row gap-3'>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <SkeletonLoader key={i} borderRadius={20} height={40} width={40} />
          ))}
        </View>
      </View>

      {/* Reminder toggle */}
      <View
        className='flex-row items-center justify-between rounded-2xl p-4'
        style={{ backgroundColor: cardBg }}
      >
        <SkeletonLoader borderRadius={4} height={16} width={120} />
        <SkeletonLoader borderRadius={16} height={30} width={50} />
      </View>

      {/* Danger zone */}
      <View className='mt-8 flex-row gap-3'>
        <View className='flex-1'>
          <SkeletonLoader borderRadius={12} height={44} />
        </View>
        <View className='flex-1'>
          <SkeletonLoader borderRadius={12} height={44} />
        </View>
      </View>
    </View>
  );
}
