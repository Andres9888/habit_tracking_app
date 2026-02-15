/**
 * PerfectBadge - Celebration badge shown when user has 100% completion rate
 */

import React from 'react';
import { View, Text } from 'react-native';

import { Sparkles } from 'lucide-react-native';

export function PerfectBadge() {
  return (
    <View
      accessible
      accessibilityLabel='Perfect streak! You have completed every day since starting this habit'
      className='mt-1.5 flex-row items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5'
      testID='perfect-badge'
    >
      <Sparkles color='#d97706' size={10} />
      <Text className='text-[10px] font-bold text-amber-700'>Perfect!</Text>
    </View>
  );
}
