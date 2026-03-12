import React from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BinaryHeatmap } from '../../../components/BinaryHeatmap';
import { useThemeColors } from '../../../theme';
import { shadows } from '../../../theme/spacing';
import type { Id } from '../../../../convex/_generated/dataModel';

interface YearHeatmapSectionProps {
  completedDates: Set<string>;
  habitColor: string;
  habitCreatedAt?: number;
  habitId: Id<'habits'>;
  onDayPress?: (date: string, completed: boolean) => void;
}

const anim = FadeInUp.duration(280).delay(180).springify().damping(18);

export function YearHeatmapSection({
  completedDates,
  habitColor,
  habitCreatedAt,
  habitId,
  onDayPress,
}: YearHeatmapSectionProps) {
  const { colors, isDark } = useThemeColors();
  const cardBg = isDark ? colors.card : '#FFFFFF';

  return (
    <Animated.View
      className='mb-3 overflow-hidden rounded-2xl'
      entering={anim}
      style={{ backgroundColor: cardBg, ...shadows.card }}
    >
      <BinaryHeatmap
        completedDates={completedDates}
        currentStreak={0}
        habitColor={habitColor}
        habitCreatedAt={habitCreatedAt}
        habitId={habitId}
        showCompletionRate={false}
        timeRange='1y'
        title='Year Overview'
        onDayPress={onDayPress}
      />
    </Animated.View>
  );
}
