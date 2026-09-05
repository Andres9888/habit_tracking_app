/**
 * HabitsPageSkeleton - Full-page loading skeleton for habits page
 * Mirrors the real layout: CalendarTimeline header + habit card list.
 */
import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HabitCardSkeleton } from './HabitCardSkeleton';
import { CalendarTimelineSkeleton } from './CalendarTimelineSkeleton';
import type { ReduceMotionProps } from './types';
import { durations } from '@/theme/animations';

const CARD_INDICES = [0, 1, 2];

export function HabitsPageSkeleton({
  reduceMotion = false,
}: ReduceMotionProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      accessible
      accessibilityLabel='Loading your habits...'
      accessibilityRole='progressbar'
      className='flex-1'
    >
      <View style={{ paddingTop: insets.top }}>
        <CalendarTimelineSkeleton reduceMotion={reduceMotion} />
      </View>
      <View className='mt-2 gap-0 px-6'>
        {CARD_INDICES.map((index) => (
          <Animated.View
            key={index}
            entering={
              reduceMotion
                ? undefined
                : FadeIn.duration(durations.moderate).delay(index * 60)
            }
          >
            <HabitCardSkeleton reduceMotion={reduceMotion} />
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
