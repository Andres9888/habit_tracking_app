/**
 * SummaryRow Component
 * Bottom row showing trend and completed days count
 */

import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface SummaryRowProps {
  trendChange: number;
  completedDays: number;
  totalDays: number;
}

export function SummaryRow({
  trendChange,
  completedDays,
  totalDays,
}: SummaryRowProps) {
  const { colors: themeColors } = useThemeColors();
  const isPositiveTrend = trendChange > 0;
  const isNegativeTrend = trendChange < 0;

  return (
    <View className='flex-row items-center justify-between rounded-xl border bg-white/60 px-3 py-2.5' style={{ borderColor: themeColors.status.premiumLight }}>
      {/* Trend */}
      <View className='flex-row items-center gap-1.5'>
        {isPositiveTrend ? (
          <TrendingUp color={themeColors.status.success} size={16} />
        ) : isNegativeTrend ? (
          <TrendingDown color={themeColors.status.error} size={16} />
        ) : (
          <TrendingUp color={themeColors.text.tertiary} size={16} />
        )}
        <Text
          className='text-xs font-semibold'
          style={{ color: isPositiveTrend ? themeColors.status.successText : isNegativeTrend ? themeColors.status.errorText : themeColors.text.secondary }}
        >
          {isPositiveTrend ? '+' : ''}
          {trendChange}% vs last month
        </Text>
      </View>

      {/* Divider */}
      <View className='h-4 w-px' style={{ backgroundColor: themeColors.border }} />

      {/* Completed days */}
      <View className='flex-row items-center gap-1.5'>
        <CheckCircle2 color={themeColors.status.premium} size={16} />
        <Text className='text-xs font-semibold' style={{ color: themeColors.text.primary }}>
          {completedDays}/{totalDays} days
        </Text>
      </View>
    </View>
  );
}
