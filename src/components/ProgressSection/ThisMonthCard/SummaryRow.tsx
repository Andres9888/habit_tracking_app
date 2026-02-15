/**
 * SummaryRow Component
 * Bottom row showing trend and completed days count
 */

import React from 'react';
import { View, Text } from 'react-native';

import { TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react-native';

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
  const isPositiveTrend = trendChange > 0;
  const isNegativeTrend = trendChange < 0;

  return (
    <View className='flex-row items-center justify-between rounded-xl border border-violet-100 bg-white/60 px-3 py-2.5'>
      {/* Trend */}
      <View className='flex-row items-center gap-1.5'>
        {isPositiveTrend ? (
          <TrendingUp className='text-emerald-500' size={16} />
        ) : isNegativeTrend ? (
          <TrendingDown className='text-red-500' size={16} />
        ) : (
          <TrendingUp className='text-stone-400' size={16} />
        )}
        <Text
          className={`text-xs font-semibold ${
            isPositiveTrend
              ? 'text-emerald-600'
              : isNegativeTrend
                ? 'text-red-600'
                : 'text-stone-500'
          }`}
        >
          {isPositiveTrend ? '+' : ''}
          {trendChange}% vs last month
        </Text>
      </View>

      {/* Divider */}
      <View className='h-4 w-px bg-stone-200' />

      {/* Completed days */}
      <View className='flex-row items-center gap-1.5'>
        <CheckCircle2 className='text-violet-500' size={16} />
        <Text className='text-xs font-semibold text-stone-600'>
          {completedDays}/{totalDays} days
        </Text>
      </View>
    </View>
  );
}
