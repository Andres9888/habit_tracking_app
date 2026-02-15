/**
 * TrendChangeBadge Component
 * Displays the change badge for monthly trend comparison
 */

import React from 'react';
import { View, Text } from 'react-native';

import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface TrendChangeBadgeProps {
  change: number;
}

export function TrendChangeBadge({ change }: TrendChangeBadgeProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  const bgClass = isPositive
    ? 'bg-emerald-50'
    : isNegative
      ? 'bg-red-50'
      : 'bg-stone-50';

  return (
    <View
      className={`mt-3 flex-row items-center justify-center gap-1.5 rounded-xl py-2.5 ${bgClass}`}
    >
      {isPositive ? (
        <>
          <TrendingUp className='text-emerald-500' size={16} />
          <Text className='text-sm font-semibold text-emerald-600'>
            +{change}% improvement
          </Text>
        </>
      ) : isNegative ? (
        <>
          <TrendingDown className='text-red-500' size={16} />
          <Text className='text-sm font-semibold text-red-600'>
            {change}% from last month
          </Text>
        </>
      ) : (
        <Text className='text-sm font-medium text-stone-500'>
          Same as last month
        </Text>
      )}
    </View>
  );
}
