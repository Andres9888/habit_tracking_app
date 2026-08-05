/**
 * TrendBadge - Shows weekly change indicator
 */

import React from 'react';
import { View, Text } from 'react-native';

interface TrendBadgeProps {
  weeklyChange: number;
}

export function TrendBadge({ weeklyChange }: TrendBadgeProps) {
  if (weeklyChange === 0) return null;

  const isPositive = weeklyChange > 0;
  const bgColor = isPositive ? '#dcfce7' : '#fee2e2'; // green-100 : red-100
  const textColor = isPositive ? '#16a34a' : '#dc2626'; // green-600 : red-600
  const prefix = isPositive ? '+' : '';

  return (
    <View
      accessibilityLabel={`${isPositive ? 'Up' : 'Down'} ${Math.abs(weeklyChange)} percent`}
      className='absolute -right-1 -top-1 rounded-full px-1'
      style={{ backgroundColor: bgColor }}
    >
      <Text className='text-[10px] font-semibold' style={{ color: textColor }}>
        {prefix}
        {weeklyChange}%
      </Text>
    </View>
  );
}
