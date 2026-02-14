/**
 * QuickStatsCards - Completion rate with trend + Best vs Current streak
 * Premium stat cards with entrance animations
 */
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  computeBestStreak,
  computeCompletionTrend,
  type TrendDirection,
} from '../utils/streakStats';
import { computeCurrentStreakFromDates } from '../../../utils/streak';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

const CARD_SHADOW = {
  elevation: 4,
  shadowColor: '#1c1917',
  shadowOffset: { height: 4, width: 0 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
};

function TrendArrow({ direction }: { direction: TrendDirection }) {
  if (direction === 'up') return <Text className='text-lg text-emerald-500'>↑</Text>;
  if (direction === 'down') return <Text className='text-lg text-red-400'>↓</Text>;
  return <Text className='text-lg text-stone-300'>→</Text>;
}

interface QuickStatsCardsProps {
  completedDates: Set<string>;
  baseDelay?: number;
}

export function QuickStatsCards({
  completedDates,
  baseDelay = 120,
}: QuickStatsCardsProps) {
  const now = useMemo(() => new Date(), []);

  const currentStreak = useMemo(
    () => computeCurrentStreakFromDates(completedDates, now),
    [completedDates, now]
  );

  const bestStreak = useMemo(
    () => computeBestStreak(completedDates),
    [completedDates]
  );

  const trend = useMemo(
    () => computeCompletionTrend(completedDates, now),
    [completedDates, now]
  );

  const completionPct = Math.round(trend.currentRate * 100);
  const deltaPct = Math.round(trend.delta * 100);

  return (
    <View className='flex-row gap-3'>
      {/* Completion Rate Card */}
      <Animated.View
        className='flex-1 rounded-2xl bg-white p-4'
        entering={anim(baseDelay)}
        style={CARD_SHADOW}
      >
        <Text className='text-[13px] font-semibold tracking-wider text-stone-400'>
          THIS WEEK
        </Text>
        <View className='mt-2 flex-row items-end gap-1'>
          <Text className='text-[34px] font-bold leading-none text-stone-900'>
            {completionPct}%
          </Text>
          <TrendArrow direction={trend.direction} />
        </View>
        <Text className='mt-1 text-[13px] text-stone-400'>
          {trend.direction === 'up'
            ? `+${deltaPct}% vs last week`
            : trend.direction === 'down'
              ? `-${deltaPct}% vs last week`
              : 'Same as last week'}
        </Text>
      </Animated.View>

      {/* Streak Comparison Card */}
      <Animated.View
        className='flex-1 rounded-2xl bg-white p-4'
        entering={anim(baseDelay + 60)}
        style={CARD_SHADOW}
      >
        <Text className='text-[13px] font-semibold tracking-wider text-stone-400'>
          STREAKS
        </Text>
        <View className='mt-2 flex-row items-end gap-1'>
          <Text className='text-[34px] font-bold leading-none text-stone-900'>
            {currentStreak}
          </Text>
          <Text className='mb-1 text-[17px] font-medium text-stone-400'>
            / {bestStreak}
          </Text>
        </View>
        <Text className='mt-1 text-[13px] text-stone-400'>
          {currentStreak >= bestStreak && bestStreak > 0
            ? '🔥 New personal best!'
            : `Best: ${bestStreak} days`}
        </Text>
      </Animated.View>
    </View>
  );
}
