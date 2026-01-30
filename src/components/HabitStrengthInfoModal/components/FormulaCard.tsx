/**
 * FormulaCard Component
 *
 * Displays the habit strength formula.
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface FormulaCardProps {
  delay: number;
}

export function FormulaCard({ delay }: FormulaCardProps) {
  return (
    <Animated.View
      className='rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4'
      entering={FadeInDown.delay(delay).duration(400)}
    >
      <View className='mb-3 flex-row items-center gap-2'>
        <Ionicons color='#6366F1' name='calculator-outline' size={18} />
        <Text className='text-sm font-semibold text-indigo-700'>
          The Formula
        </Text>
      </View>
      <View className='gap-2'>
        <View className='flex-row items-center gap-2'>
          <View className='h-2 w-2 rounded-full bg-emerald-500' />
          <Text className='flex-1 font-mono text-xs text-stone-700'>
            Complete: strength + (1 - strength) × 0.05
          </Text>
        </View>
        <View className='flex-row items-center gap-2'>
          <View className='h-2 w-2 rounded-full bg-rose-400' />
          <Text className='flex-1 font-mono text-xs text-stone-700'>
            Miss: strength × 0.95
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default FormulaCard;
