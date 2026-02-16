/**
 * ComparisonStats Component
 *
 * Displays this week vs last week comparison statistics.
 * Uses semantic theme colors for full dark-mode support.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

import type { WeekOverWeekTrend } from '../../../utils/trendCalculations';

interface ComparisonStatsProps {
  trend: WeekOverWeekTrend;
}

export function ComparisonStats({ trend }: ComparisonStatsProps) {
  const {
    thisWeekCompleted,
    thisWeekTotal,
    thisWeekRate,
    lastWeekCompleted,
    lastWeekRate,
  } = trend;
  const { colors, isDark } = useThemeColors();

  // Theme-aware accent colors for "This Week" highlight
  const thisWeekBg = isDark ? 'rgba(5, 150, 105, 0.15)' : '#ECFDF5'; // emerald-50 equivalent
  const thisWeekLabel = isDark ? '#6EE7B7' : '#047857'; // emerald-300 / emerald-700
  const thisWeekValue = isDark ? '#A7F3D0' : '#064E3B'; // emerald-200 / emerald-900
  const thisWeekSub = isDark ? '#6EE7B7' : '#059669'; // emerald-300 / emerald-600

  return (
    <View className='mb-3 flex-row items-center gap-4'>
      {/* This Week */}
      <View
        accessibilityLabel={`This week: ${thisWeekCompleted} of ${thisWeekTotal}, ${thisWeekRate} percent`}
        className='flex-1 rounded-xl p-3'
        style={{ backgroundColor: thisWeekBg }}
      >
        <Text className='mb-1 text-xs font-medium' style={{ color: thisWeekLabel }}>
          This Week
        </Text>
        <View className='flex-row items-baseline gap-1'>
          <Text className='text-xl font-bold' style={{ color: thisWeekValue }}>
            {thisWeekCompleted}
          </Text>
          <Text className='text-xs' style={{ color: thisWeekSub }}>
            / {thisWeekTotal}
          </Text>
        </View>
        <Text className='mt-0.5 text-xs' style={{ color: thisWeekSub }}>
          {thisWeekRate}%
        </Text>
      </View>

      {/* VS Indicator */}
      <View className='items-center'>
        <Text
          className='text-xs font-medium'
          style={{ color: colors.text.tertiary }}
        >
          vs
        </Text>
      </View>

      {/* Last Week */}
      <View
        accessibilityLabel={`Last week: ${lastWeekCompleted} of 7, ${lastWeekRate} percent`}
        className='flex-1 rounded-xl p-3'
        style={{ backgroundColor: colors.gray[50] }}
      >
        <Text className='mb-1 text-xs' style={{ color: colors.text.tertiary }}>
          Last Week
        </Text>
        <View className='flex-row items-baseline gap-1'>
          <Text
            className='text-xl font-bold'
            style={{ color: colors.text.primary }}
          >
            {lastWeekCompleted}
          </Text>
          <Text className='text-xs' style={{ color: colors.text.tertiary }}>
            / 7
          </Text>
        </View>
        <Text
          className='mt-0.5 text-xs'
          style={{ color: colors.text.tertiary }}
        >
          {lastWeekRate}%
        </Text>
      </View>
    </View>
  );
}
