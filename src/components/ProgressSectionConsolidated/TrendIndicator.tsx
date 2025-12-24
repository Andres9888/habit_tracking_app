/**
 * TrendIndicator Component
 *
 * Shows weekly trend direction with icon and value.
 * Used in HeroStrengthSection to display strength change.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

interface TrendIndicatorProps {
  weeklyChange: number;
}

/**
 * TrendIndicator - Shows weekly trend direction with icon and value
 */
export function TrendIndicator({ weeklyChange }: TrendIndicatorProps) {
  if (weeklyChange > 0) {
    return (
      <View
        accessibilityLabel={`Up ${weeklyChange} percent this week`}
        accessibilityRole='text'
        className='flex-row items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5'
      >
        <TrendingUp className='text-emerald-600' size={12} />
        <Text className='text-xs font-medium text-emerald-600'>
          +{weeklyChange}%
        </Text>
      </View>
    );
  }

  if (weeklyChange < 0) {
    return (
      <View
        accessibilityLabel={`Down ${Math.abs(weeklyChange)} percent this week`}
        accessibilityRole='text'
        className='flex-row items-center gap-1 rounded-full bg-red-50 px-2 py-0.5'
      >
        <TrendingDown className='text-red-600' size={12} />
        <Text className='text-xs font-medium text-red-600'>
          {weeklyChange}%
        </Text>
      </View>
    );
  }

  return (
    <View
      accessibilityLabel='Stable this week'
      accessibilityRole='text'
      className='flex-row items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5'
    >
      <Minus className='text-stone-500' size={12} />
      <Text className='text-xs font-medium text-stone-500'>Stable</Text>
    </View>
  );
}

export default TrendIndicator;
