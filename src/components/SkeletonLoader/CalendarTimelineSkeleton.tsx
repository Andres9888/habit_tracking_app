/**
 * CalendarTimelineSkeleton - Loading skeleton for calendar timeline
 * Matches the CalendarTimeline layout: centered date pill + 7-day ring strip.
 */
import React from 'react';
import { View } from 'react-native';
import { WEEK_STRIP_HORIZONTAL_PADDING } from '../../constants/weekStripLayout';
import { SkeletonLoader } from './SkeletonLoader';
import { useSkeletonTheme } from './useSkeletonTheme';
import type { ReduceMotionProps } from './types';

const DAY_INDICES = [0, 1, 2, 3, 4, 5, 6];
const STRIP_PADDING = { paddingHorizontal: WEEK_STRIP_HORIZONTAL_PADDING };

export function CalendarTimelineSkeleton({
  reduceMotion = false,
}: ReduceMotionProps) {
  const { surfaceBg } = useSkeletonTheme();
  return (
    <View className='pb-4 pt-2' style={{ backgroundColor: surfaceBg }}>
      {/* WeekNavRow — centered date pill */}
      <View className='mb-3 items-center' style={STRIP_PADDING}>
        <SkeletonLoader
          borderRadius={20}
          height={28}
          reduceMotion={reduceMotion}
          width={140}
        />
      </View>
      {/* DayStrip — 7 day cells with label + ring */}
      <View
        className='flex-row items-start justify-between'
        style={STRIP_PADDING}
      >
        {DAY_INDICES.map((i) => (
          <View key={i} className='flex-1 items-center gap-0.5'>
            <SkeletonLoader
              borderRadius={4}
              height={14}
              reduceMotion={reduceMotion}
              width={28}
            />
            <SkeletonLoader
              borderRadius={22}
              height={44}
              reduceMotion={reduceMotion}
              width={44}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
