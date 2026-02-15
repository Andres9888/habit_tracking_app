/**
 * ExplainerProtocol Component
 * Protocol explanation: when to use success vs failure visualization
 */

import React from 'react';
import { View, Text } from 'react-native';

import { Sparkles, AlertTriangle } from 'lucide-react-native';

export function ExplainerProtocol() {
  return (
    <>
      <Text className='mb-3 text-sm leading-relaxed text-stone-600'>
        This protocol uses{' '}
        <Text className='font-semibold text-stone-800'>context-aware</Text>{' '}
        visualization to optimize motivation:
      </Text>

      <View className='mb-4 gap-3'>
        <View className='flex-row gap-3'>
          <View className='h-8 w-8 items-center justify-center rounded-lg bg-emerald-100'>
            <Sparkles className='text-emerald-600' size={16} />
          </View>
          <View className='flex-1'>
            <Text className='font-semibold text-emerald-700'>
              Feeling Motivated?
            </Text>
            <Text className='text-xs text-stone-500'>
              Visualize SUCCESS → Amplify your drive
            </Text>
          </View>
        </View>
        <View className='flex-row gap-3'>
          <View className='h-8 w-8 items-center justify-center rounded-lg bg-rose-100'>
            <AlertTriangle className='text-rose-500' size={16} />
          </View>
          <View className='flex-1'>
            <Text className='font-semibold text-rose-700'>Not Motivated?</Text>
            <Text className='text-xs text-stone-500'>
              Visualize FAILURE → Fear drives action
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}
