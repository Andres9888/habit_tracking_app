/**
 * ExplainerKeyInsight Component
 * Key insight section: "Fear moves you 2x better"
 */

import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function ExplainerKeyInsight() {
  return (
    <View className='mb-4 rounded-xl p-3'>
      <LinearGradient
        className='absolute inset-0 rounded-xl'
        colors={['#fff1f2', '#fffbeb']}
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
      />
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
