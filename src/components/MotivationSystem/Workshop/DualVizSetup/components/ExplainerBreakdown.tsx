/**
 * ExplainerBreakdown Component
 * Body/Mind/Emotion breakdown explanation
 */

import React from 'react';
import { View, Text } from 'react-native';

export function ExplainerBreakdown() {
  return (
    <View className='mb-3 rounded-xl bg-stone-50 p-3'>
      <Text className='mb-2 text-xs font-semibold text-stone-700'>
        Visualize How You'll Feel:
      </Text>
      <View className='gap-1.5'>
        <Text className='text-xs text-stone-600'>
          <Text className='font-medium'>Body:</Text> Physical sensations (light
          vs heavy)
        </Text>
        <Text className='text-xs text-stone-600'>
          <Text className='font-medium'>Mind:</Text> Mental state (clear vs
          foggy)
        </Text>
        <Text className='text-xs text-stone-600'>
          <Text className='font-medium'>Emotion:</Text> Feelings (pride vs
          regret)
        </Text>
      </View>
    </View>
  );
}
