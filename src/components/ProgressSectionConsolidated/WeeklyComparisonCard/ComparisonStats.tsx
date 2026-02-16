/**
 * ComparisonStats Component
 *
 * Displays this week vs last week comparison statistics.
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
  const { colors } = useThemeColors();

  return (
    <View className='mb-3 flex-row items-center gap-4'>
      {/* This Week */}
      <View className='flex-1 rounded-xl bg-lime-50 p-3'>
        <Text className='mb-1 text-xs text-lime-700'>This Week</Text>
        <View className='flex-row items-baseline gap-1'>
          <Text className='text-xl font-bold text-lime-900'>
            {thisWeekCompleted}
          </Text>
          <Text className='text-xs text-lime-600'>/ {thisWeekTotal}</Text>
        </View>
        <Text className='mt-0.5 text-xs text-lime-600'>{thisWeekRate}%</Text>
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
        <Text className='text-xs font-medium' style={{ color: colors.text.tertiary }}>vs</Text>
      <View className='flex-1 rounded-xl p-3' style={{ backgroundColor: colors.gray[50] }}>
        <Text className='mb-1 text-xs' style={{ color: colors.text.tertiary }}>Last Week</Text>
          <Text className='text-xl font-bold' style={{ color: colors.text.primary }}>
          <Text className='text-xs' style={{ color: colors.text.tertiary }}>/ 7</Text>
        <Text className='mt-0.5 text-xs' style={{ color: colors.text.tertiary }}>{lastWeekRate}%</Text>
      </View>
    </View>
  );
}
