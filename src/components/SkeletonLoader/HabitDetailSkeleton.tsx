/* eslint-disable max-lines */
/**
 * HabitDetailSkeleton - Loading skeleton for habit detail screen
 * Matches layout: hero (icon + name + badge), strength section, calendar grid
 */
import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import type { ReduceMotionProps } from './types';

/** Hero section placeholder matching HeroSection layout */
function HeroSkeleton({ reduceMotion }: ReduceMotionProps) {
  return (
    <View className='items-center pb-4 pt-6'>
      {/* Habit icon */}
      <SkeletonLoader
        borderRadius={16}
        height={80}
        reduceMotion={reduceMotion}
        width={80}
      />
      {/* Habit name */}
      <View className='mt-3'>
        <SkeletonLoader
          borderRadius={6}
          height={22}
          reduceMotion={reduceMotion}
          width={160}
        />
      </View>
      {/* Streak badge */}
      <View className='mt-2'>
        <SkeletonLoader
          borderRadius={14}
          height={28}
          reduceMotion={reduceMotion}
          width={120}
        />
      </View>
      {/* Description */}
      <View className='mt-2'>
        <SkeletonLoader
          borderRadius={4}
          height={14}
          reduceMotion={reduceMotion}
          width={200}
        />
      </View>
    </View>
  );
}

/** Strength section placeholder */
function StrengthSectionSkeleton({ reduceMotion }: ReduceMotionProps) {
  return (
    <View
      className='rounded-2xl bg-white p-4'
      style={{
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
      }}
    >
      {/* Section divider label */}
      <View className='mb-3 flex-row items-center gap-2'>
        <View className='h-px flex-1' style={{ backgroundColor: '#e7e5e4' }} />
        <SkeletonLoader
          borderRadius={3}
          height={11}
          reduceMotion={reduceMotion}
          width={70}
        />
        <View className='h-px flex-1' style={{ backgroundColor: '#e7e5e4' }} />
      </View>

      {/* Strength ring placeholder */}
      <View className='items-center py-4'>
        <SkeletonLoader
          borderRadius={50}
          height={100}
          reduceMotion={reduceMotion}
          width={100}
        />
      </View>

      {/* Stats row */}
      <View className='flex-row justify-around'>
        {[0, 1, 2].map((i) => (
          <View key={i} className='items-center gap-1'>
            <SkeletonLoader
              borderRadius={4}
              height={20}
              reduceMotion={reduceMotion}
              width={40}
            />
            <SkeletonLoader
              borderRadius={3}
              height={10}
              reduceMotion={reduceMotion}
              width={60}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

/** Calendar grid placeholder matching MonthlyCalendarGrid layout */
function CalendarGridSkeleton({ reduceMotion }: ReduceMotionProps) {
  return (
    <View
      className='rounded-2xl bg-white p-4'
      style={{
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
      }}
    >
      {/* Section divider label */}
      <View className='mb-3 flex-row items-center gap-2'>
        <View className='h-px flex-1' style={{ backgroundColor: '#e7e5e4' }} />
        <SkeletonLoader
          borderRadius={3}
          height={11}
          reduceMotion={reduceMotion}
          width={60}
        />
        <View className='h-px flex-1' style={{ backgroundColor: '#e7e5e4' }} />
      </View>

      {/* Month nav */}
      <View className='mb-3 flex-row items-center justify-between'>
        <SkeletonLoader
          borderRadius={10}
          height={20}
          reduceMotion={reduceMotion}
          width={20}
        />
        <SkeletonLoader
          borderRadius={6}
          height={18}
          reduceMotion={reduceMotion}
          width={120}
        />
        <SkeletonLoader
          borderRadius={10}
          height={20}
          reduceMotion={reduceMotion}
          width={20}
        />
      </View>

      {/* Day headers */}
      <View className='mb-2 flex-row justify-around'>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonLoader
            key={i}
            borderRadius={3}
            height={12}
            reduceMotion={reduceMotion}
            width={20}
          />
        ))}
      </View>

      {/* Calendar grid - 5 rows of 7 */}
      {[0, 1, 2, 3, 4].map((row) => (
        <View key={row} className='mb-1 flex-row justify-around'>
          {[0, 1, 2, 3, 4, 5, 6].map((col) => (
            <SkeletonLoader
              key={col}
              borderRadius={8}
              height={32}
              reduceMotion={reduceMotion}
              width={32}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export function HabitDetailSkeleton({
  reduceMotion = false,
}: ReduceMotionProps) {
  return (
    <View
      accessible
      accessibilityLabel='Loading habit details'
      accessibilityRole='progressbar'
      className='flex-1 px-4'
      style={{ backgroundColor: '#faf9f7' }}
    >
      <HeroSkeleton reduceMotion={reduceMotion} />
      <View className='gap-4'>
        <StrengthSectionSkeleton reduceMotion={reduceMotion} />
        <CalendarGridSkeleton reduceMotion={reduceMotion} />
      </View>
    </View>
  );
}
