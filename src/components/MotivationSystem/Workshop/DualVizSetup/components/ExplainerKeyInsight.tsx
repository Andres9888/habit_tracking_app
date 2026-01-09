/**
 * ExplainerKeyInsight Component
 * Key insight section: "Fear moves you 2x better"
 */

import React from 'react';
import { View, Text } from 'react-native';

export function ExplainerKeyInsight() {
  return (
    <View className='mb-4 rounded-xl bg-gradient-to-r from-rose-50 to-amber-50 p-3'>
      <Text className='text-sm font-semibold text-rose-800'>
        Fear moves you 2x better
      </Text>
      <Text className='mt-1 text-xs leading-relaxed text-rose-700'>
        When you're unmotivated, visualizing{' '}
        <Text className='font-bold'>failure</Text> is more effective than
        visualizing success. Loss aversion makes avoiding pain 2x more
        motivating than seeking pleasure.
      </Text>
    </View>
  );
}
