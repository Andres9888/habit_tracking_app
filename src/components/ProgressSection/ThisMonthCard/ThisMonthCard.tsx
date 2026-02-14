/**
 * ThisMonthCard Component
 *
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Use `ProgressSectionConsolidated` from `../ProgressSectionConsolidated` instead.
 *
 * Section 3: Combines Best Days chart + Monthly Trend.
 * Features:
 * - Animated bar chart (7 days, staggered animation)
 * - Best day highlighted (emerald), worst day highlighted (amber)
 * - Summary row: "+X% vs last month" + "Y/Z days completed"
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, AccessibilityInfo } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { BarChart3, ChevronRight } from 'lucide-react-native';

import type { ThisMonthCardProps } from '../types';
import { useDayStats } from './useDayStats';
import { DayBar } from './DayBar';
import { SummaryRow } from './SummaryRow';

export function ThisMonthCard({
  dayStats,
  thisMonthRate,
  lastMonthRate,
  completedDays,
  totalDays,
  onSeeAllPress,
}: ThisMonthCardProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const { bestDay, worstDay, maxRate } = useDayStats(dayStats);
  const trendChange = thisMonthRate - lastMonthRate;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  return (
    <View
      accessible
      accessibilityLabel={`This month: ${completedDays} of ${totalDays} days completed, ${thisMonthRate}% success rate`}
      className='overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50'
    >
      {/* Gradient Background */}
      <LinearGradient
        colors={['rgba(245, 243, 255, 0.3)', '#ffffff', 'rgba(239, 246, 255, 0.3)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className='absolute inset-0'
      />
      <View className='absolute inset-0 rounded-2xl border border-violet-500/20' />

      <View className='p-4'>
        {/* Header with See All */}
        <View className='mb-3 flex-row items-center justify-between'>
          <View className='flex-row items-center gap-2'>
            <View className='h-7 w-7 items-center justify-center rounded-lg bg-violet-100'>
              <BarChart3 className='text-violet-500' size={14} />
            </View>
            <Text className='text-sm font-semibold text-stone-600'>
              This Month
            </Text>
          </View>
          <Pressable
            accessibilityLabel='See all analytics'
            accessibilityRole='button'
            className='flex-row items-center gap-0.5 active:opacity-70'
            onPress={onSeeAllPress}
          >
            <Text className='text-xs font-medium text-violet-600'>See All</Text>
            <ChevronRight className='text-violet-400' size={14} />
          </Pressable>
        </View>

        {/* Bar Chart */}
        <Animated.View
          className='mb-4 flex-row items-end justify-between px-1'
          entering={FadeIn.delay(100)}
        >
          {dayStats.map((day, index) => (
            <DayBar
              key={day.dayIndex}
              dayStats={day}
              index={index}
              isBest={bestDay?.dayIndex === day.dayIndex}
              isWorst={
                worstDay?.dayIndex === day.dayIndex &&
                day.rate < (bestDay?.rate || 100)
              }
              maxRate={maxRate}
              reduceMotion={reduceMotion}
            />
          ))}
        </Animated.View>

        {/* Summary Row */}
        <SummaryRow
          completedDays={completedDays}
          totalDays={totalDays}
          trendChange={trendChange}
        />
      </View>
    </View>
  );
}

export default ThisMonthCard;
