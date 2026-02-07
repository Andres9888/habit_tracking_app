/**
 * WeeklySummaryCard Component
 *
 * A celebratory summary card shown at the end of the week.
 */

import { View, Pressable, Animated } from 'react-native';
import { format, parseISO } from 'date-fns';
import { shadows } from '../../theme/spacing';
import type { WeeklySummaryCardProps } from './types';
import { useWeeklySummaryStats } from './useWeeklySummaryStats';
import { useWeeklySummaryAnimations } from './useWeeklySummaryAnimations';
import { getMotivationalMessage, getColorScheme } from './utils';
import {
  CardHeader,
  CompletionRateDisplay,
  StatsGrid,
  BestDayCard,
  StreakHighlight,
} from './components';

export function WeeklySummaryCard({
  weekStats,
  currentStreak = 0,
  reduceMotion = false,
  visible = true,
  onViewDetails,
}: WeeklySummaryCardProps) {
  const stats = useWeeklySummaryStats(weekStats);
  const colors = getColorScheme(stats.completionRate);
  const message = getMotivationalMessage(stats.completionRate);
  const bestDayLabel = stats.bestDay
    ? format(parseISO(stats.bestDay.date), 'EEEE')
    : null;

  const { fadeAnim, slideAnim, celebrationScale, starRotationInterpolate } =
    useWeeklySummaryAnimations({
      completionRate: stats.completionRate,
      reduceMotion,
      visible,
    });

  if (!visible || weekStats.length === 0) return null;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: celebrationScale }],
      }}
    >
      <Pressable
        accessibilityLabel={`Weekly summary: ${stats.completionRate}% completion rate`}
        accessibilityRole='button'
        className='overflow-hidden rounded-3xl'
        style={{
          ...shadows.modal,
          backgroundColor: colors.bg,
          shadowColor: colors.accent,
          shadowOffset: { height: 8, width: 0 },
          shadowOpacity: 0.15,
        }}
        onPress={onViewDetails}
      >
        <CardHeader
          colors={colors}
          starRotation={starRotationInterpolate}
          onViewDetails={onViewDetails}
        />
        <View className='px-5 py-4'>
          <CompletionRateDisplay
            colors={colors}
            completionRate={stats.completionRate}
            messageText={message.text}
          />
          <StatsGrid
            colors={colors}
            perfectDays={stats.perfectDays}
            totalCompleted={stats.totalCompleted}
            totalPossible={stats.totalPossible}
          />
          {bestDayLabel && stats.bestDayRate > 0 && (
            <BestDayCard
              colors={colors}
              dayLabel={bestDayLabel}
              rate={stats.bestDayRate}
            />
          )}
          <StreakHighlight streak={currentStreak} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default WeeklySummaryCard;
