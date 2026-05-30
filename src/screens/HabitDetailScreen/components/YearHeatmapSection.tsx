import React from 'react';
import Animated, { Easing, FadeInUp } from 'react-native-reanimated';
import { BinaryHeatmap } from '../../../components/BinaryHeatmap';
import type { Id } from '../../../../convex/_generated/dataModel';

interface YearHeatmapSectionProps {
  completedDates: Set<string>;
  habitColor: string;
  habitCreatedAt?: number;
  habitId: Id<'habits'>;
  onDayPress?: (date: string, completed: boolean) => void;
}

const anim = FadeInUp.duration(280).delay(180).easing(Easing.out(Easing.cubic));

export function YearHeatmapSection({
  completedDates,
  habitColor,
  habitCreatedAt,
  habitId,
  onDayPress,
}: YearHeatmapSectionProps) {
  return (
    <Animated.View className='mb-4' entering={anim}>
      <BinaryHeatmap
        completedDates={completedDates}
        currentStreak={0}
        habitColor={habitColor}
        habitCreatedAt={habitCreatedAt}
        habitId={habitId}
        showCompletionRate
        timeRange='1y'
        title='Year Overview'
        onDayPress={onDayPress}
      />
    </Animated.View>
  );
}
