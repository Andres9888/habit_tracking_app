/**
 * Empty state components for StrengthTimelineChart
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface EmptyStateProps {
  height: number;
}

export function NoDataState({ height }: EmptyStateProps) {
  return (
    <View
      accessible
      accessibilityLabel='Strength timeline chart - No data available yet'
      className='items-center justify-center rounded-xl bg-stone-50 p-4'
      style={{ height }}
    >
      <Text className='text-sm text-stone-400'>
        Building your strength history...
      </Text>
    </View>
  );
}

export function BuildingHistoryState({ height }: EmptyStateProps) {
  return (
    <Animated.View
      accessible
      accessibilityLabel='Strength timeline chart - Building history'
      className='items-center justify-center rounded-xl bg-stone-50 p-4'
      entering={FadeIn.duration(400)}
      style={{ height }}
    >
      <Text className='text-center text-sm text-stone-500'>
        Keep going! Your strength chart will appear after a week of tracking.
      </Text>
    </Animated.View>
  );
}
