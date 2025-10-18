/**
 * Proof-of-Concept Component to Test NativeWind Configuration
 * This component tests various NativeWind utilities to ensure proper setup
 */
import React from 'react';
import { Text, View } from 'react-native';

export function NativeWindTest() {
  return (
    <View className='flex-1 items-center justify-center bg-slate-100 p-4'>
      <View className='mb-4 rounded-lg border border-slate-200 bg-white p-6 shadow-md'>
        <Text className='mb-2 text-2xl font-bold text-slate-900'>
          NativeWind Test
        </Text>
        <Text className='text-sm text-slate-600'>
          If you can see styled text with proper spacing, colors, and shadows,
          NativeWind is working correctly! ✅
        </Text>
      </View>

      <View className='flex-row gap-2'>
        <View className='rounded-md bg-green-500 px-4 py-2'>
          <Text className='font-medium text-white'>Success</Text>
        </View>
        <View className='rounded-md bg-blue-500 px-4 py-2'>
          <Text className='font-medium text-white'>Primary</Text>
        </View>
        <View className='rounded-md bg-red-500 px-4 py-2'>
          <Text className='font-medium text-white'>Danger</Text>
        </View>
      </View>
    </View>
  );
}

export default NativeWindTest;
