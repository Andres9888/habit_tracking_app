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
import { useThemeColors } from '@/theme/ThemeContext';

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
  const { colors: themeColors } = useThemeColors();
  const [reduceMotion, setReduceMotion] = useState(false);
  const { bestDay, worstDay, maxRate } = useDayStats(dayStats);
  const trendChange = thisMonthRate - lastMonthRate;

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch((error) => {
        if (__DEV__) console.warn('Error checking reduce motion setting:', error);
        setReduceMotion(false);
      });
  }, []);

  return (
    <View
      accessible
      accessibilityLabel={`This month: ${completedDays} of ${totalDays} days completed, ${thisMonthRate}% success rate`}
      className='overflow-hidden rounded-2xl shadow-sm'
      style={{ shadowColor: themeColors.border }}
    >
      {/* Gradient Background */}
      <LinearGradient
        className='absolute inset-0'
        colors={['rgba(245, 243, 255, 0.3)', '#ffffff', 'rgba(239, 246, 255, 0.3)']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      />
      <View className='absolute inset-0 rounded-2xl border' style={{ borderColor: themeColors.status.premiumLight }} />

      <View className='p-4'>
        {/* Header with See All */}
        <View className='mb-3 flex-row items-center justify-between'>
          <View className='flex-row items-center gap-2'>
            <View className='h-7 w-7 items-center justify-center rounded-lg' style={{ backgroundColor: themeColors.status.premiumLight }}>
              <BarChart3 color={themeColors.status.premium} size={14} />
            </View>
            <Text className='text-sm font-semibold' style={{ color: themeColors.text.primary }}>
              This Month
            </Text>
          </View>
          <Pressable
            accessibilityLabel='See all analytics'
            accessibilityRole='button'
            className='flex-row items-center gap-0.5 active:opacity-70'
            onPress={onSeeAllPress}
          >
            <Text className='text-xs font-medium' style={{ color: themeColors.status.premiumText }}>See All</Text>
            <ChevronRight color={themeColors.status.premium} size={14} />
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
                day.rate < (bestDay?.rate ?? 100)
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
