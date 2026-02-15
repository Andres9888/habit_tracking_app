/**
 * ChangeIndicator Component
 *
 * Shows the change from previous period with trend icon.
 */

import React from 'react';
import { View, Text } from 'react-native';

import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface ChangeIndicatorProps {
  change: number | null;
}

export function ChangeIndicator({ change }: ChangeIndicatorProps) {
  if (change === null) return null;

  return (
    <View className='mt-3 flex-row items-center justify-center border-t border-stone-100 pt-3'>
      {change >= 0 ? (
        <TrendingUp className='mr-1 text-emerald-500' size={14} />
      ) : (
        <TrendingDown className='mr-1 text-amber-500' size={14} />
      )}
      <Text
        className={`text-xs font-medium ${
          change >= 0 ? 'text-emerald-600' : 'text-amber-600'
        }`}
      >
        {change >= 0 ? '+' : ''}
        {change}% vs last period
      </Text>
    </View>
  );
}
