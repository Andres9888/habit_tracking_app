/**
 * EmptyVizState Component
 * Shown when no visualization data is available
 */

import React from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

export function EmptyVizState() {
  return (
    <View className='items-center justify-center py-6'>
      <View className='mb-3 h-12 w-12 items-center justify-center rounded-full bg-rose-100'>
        <AlertTriangle className='text-rose-500' size={24} />
      </View>
      <Text className='mb-2 text-center text-sm font-medium text-stone-600'>
        Imagine how you'll feel if you skip
      </Text>
      <Text className='text-center text-xs text-stone-500'>
        Add failure visualization in the Motivation tab
      </Text>
    </View>
  );
}
