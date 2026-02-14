/**
 * FrequencySelector Component
 * Toggle between daily and weekly delivery frequency
 */

import { triggerHaptic } from '@/utils/haptics';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { clsx } from 'clsx';
import type { FrequencySelectorProps } from './types';

export function FrequencySelector({
  frequency,
  onSelect,
}: FrequencySelectorProps) {
  return (
    <View className='flex-row gap-2'>
      <Pressable
        accessibilityLabel='Daily delivery'
        accessibilityRole='radio'
        accessibilityState={{ selected: frequency === 'daily' }}
        className={clsx(
          'flex-1 flex-row items-center justify-center gap-2 rounded-xl border-2 py-3',
          frequency === 'daily'
            ? 'border-amber-500 bg-amber-50'
            : 'border-stone-200 bg-white'
        )}
        onPress={() => {
          triggerHaptic('tap');
          onSelect('daily');
        }}
      >
        <Calendar
          className={
            frequency === 'daily' ? 'text-amber-600' : 'text-stone-400'
          }
          size={18}
        />
        <Text
          className={clsx(
            'font-medium',
            frequency === 'daily' ? 'text-amber-700' : 'text-stone-600'
          )}
        >
          Every Day
        </Text>
      </Pressable>

      <Pressable
        accessibilityLabel='Weekly delivery'
        accessibilityRole='radio'
        accessibilityState={{ selected: frequency === 'weekly' }}
        className={clsx(
          'flex-1 flex-row items-center justify-center gap-2 rounded-xl border-2 py-3',
          frequency === 'weekly'
            ? 'border-amber-500 bg-amber-50'
            : 'border-stone-200 bg-white'
        )}
        onPress={() => {
          triggerHaptic('tap');
          onSelect('weekly');
        }}
      >
        <Calendar
          className={
            frequency === 'weekly' ? 'text-amber-600' : 'text-stone-400'
          }
          size={18}
        />
        <Text
          className={clsx(
            'font-medium',
            frequency === 'weekly' ? 'text-amber-700' : 'text-stone-600'
          )}
        >
          Custom Days
        </Text>
      </Pressable>
    </View>
  );
}

export default FrequencySelector;
