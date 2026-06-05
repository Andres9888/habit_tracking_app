import React from 'react';
import Animated, { Easing, FadeInUp } from 'react-native-reanimated';
import { BinaryHeatmap } from '../../../components/BinaryHeatmap';
import type { Id } from '../../../../convex/_generated/dataModel';

interface YearHeatmapSectionProps {
  completedDates: Set<string>;
  habitColor: string;
  habitCreatedAt?: number;
  habitId: Id<'habits'>;
  currentStreak?: number;
  onDayPress?: (date: string, completed: boolean) => void;
  onNavigateToMonth?: (date: string) => void;
}

const anim = FadeInUp.duration(280).delay(180).easing(Easing.out(Easing.cubic));

export function YearHeatmapSection({
  completedDates,
  habitColor,
  habitCreatedAt,
  habitId,
  currentStreak = 0,
  onDayPress,
  onNavigateToMonth,
}: YearHeatmapSectionProps) {
  const handleHeatmapDayPress = (date: string, completed: boolean) => {
    onNavigateToMonth?.(date);
    onDayPress?.(date, completed);
  };

  return (
    <Animated.View entering={anim}>
      <BinaryHeatmap
        completedDates={completedDates}
        compact
        currentStreak={currentStreak}
        habitColor={habitColor}
        habitCreatedAt={habitCreatedAt}
        habitId={habitId}
        showCompletionRate
        timeRange='1y'
        title='Year Overview'
        onDayPress={handleHeatmapDayPress}
      />
    </Animated.View>
  );
}
