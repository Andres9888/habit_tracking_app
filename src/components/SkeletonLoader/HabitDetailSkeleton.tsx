import React from 'react';
import { View } from 'react-native';
import type { ReduceMotionProps } from './types';
import {
  HeaderSection,
  ChartSection,
  CalendarSection,
} from './skeletonSections';

export function HabitDetailSkeleton({
  reduceMotion = false,
}: ReduceMotionProps) {
  return (
    <View
      accessible
      accessibilityLabel='Loading habit details'
      accessibilityRole='progressbar'
      className='flex-1 bg-stone-100 px-4 pt-6'
    >
      <HeaderSection reduceMotion={reduceMotion} />
      <ChartSection reduceMotion={reduceMotion} />
      <CalendarSection reduceMotion={reduceMotion} />
    </View>
  );
}
