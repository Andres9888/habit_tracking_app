/**
 * StreakEmptyState - Shown when no streak records exist
 */

import React from 'react';
import { View, Text } from 'react-native';

export function StreakEmptyState() {
  return (
    <View
      accessibilityLabel='No streak records yet.'
      className='mt-3 items-center rounded-xl border border-stone-200 bg-white p-4'
    >
      <Text className='text-sm text-stone-400'>
        Complete 2+ consecutive days to start tracking streaks
      </Text>
    </View>
  );
}
