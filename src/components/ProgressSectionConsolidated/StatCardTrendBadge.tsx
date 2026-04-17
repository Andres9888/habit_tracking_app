/**
 * StatCardTrendBadge - Trend badge for StatCard component
 */

import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

interface StatCardTrendBadgeProps {
  showTrend?: boolean;
  trend?: number;
  statId: string;
}

export const StatCardTrendBadge = React.memo(function StatCardTrendBadge({
  showTrend,
  trend,
  statId,
}: StatCardTrendBadgeProps) {
  if (!showTrend || trend === undefined || trend === 0) {
    return null;
  }

  const isPositive = trend > 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  const color = isPositive ? '#16a34a' : '#dc2626'; // green-600 : red-600
  const bgColor = isPositive ? '#dcfce7' : '#fee2e2'; // green-100 : red-100
  const prefix = isPositive ? '+' : '';
  const label = statId === 'monthly' ? '' : '%';

  return (
    <View
      accessibilityLabel={`${isPositive ? 'Up' : 'Down'} ${Math.abs(trend)}${label}`}
      className='ml-1 flex-row items-center rounded-full px-1.5 py-0.5'
      style={{ backgroundColor: bgColor }}
    >
      <Icon color={color} size={iconSizes.micro} />
      <Text className='ml-0.5 text-xs font-medium' style={{ color }}>
        {prefix}
        {trend}
        {label}
      </Text>
    </View>
  );
});
