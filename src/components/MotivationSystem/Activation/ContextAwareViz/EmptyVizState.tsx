/**
 * EmptyVizState - Shown when no visualization data is available
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles, AlertTriangle } from 'lucide-react-native';
import { clsx } from 'clsx';

import type { VizType } from './types';

interface EmptyVizStateProps {
  type: VizType;
  compact: boolean;
}

export function EmptyVizState({ type, compact }: EmptyVizStateProps) {
  const isSuccess = type === 'success';

  if (compact) {
    return (
      <View className='items-center justify-center py-4'>
        <Text
          className={clsx(
            'text-center text-sm italic',
            isSuccess ? 'text-emerald-500' : 'text-rose-500'
          )}
        >
          {isSuccess
            ? 'Set up success visualization in the Motivation tab'
            : 'Set up failure visualization in the Motivation tab'}
        </Text>
      </View>
    );
  }

  return (
    <View className='items-center justify-center py-6'>
      <View
        className={clsx(
          'mb-3 h-12 w-12 items-center justify-center rounded-full',
          isSuccess ? 'bg-emerald-100' : 'bg-rose-100'
        )}
      >
        {isSuccess ? (
          <Sparkles className='text-emerald-500' size={24} />
        ) : (
          <AlertTriangle className='text-rose-500' size={24} />
        )}
      </View>
      <Text className='mb-1 text-center text-sm font-medium text-stone-600'>
        No visualization set up yet
      </Text>
      <Text className='text-center text-xs text-stone-500'>
        Add it in the Motivation tab to see it here
      </Text>
    </View>
  );
}
