/**
 * Loading state for HabitStrengthSection
 * Shows calculating indicator while strength is being computed
 */
import React from 'react';
import { Text, View } from 'react-native';

export function LoadingState() {
  return (
    <View className='rounded-2xl bg-white p-5 shadow-sm'>
      <View className='h-48 items-center justify-center'>
        <Text className='text-stone-400'>Calculating strength...</Text>
      </View>
    </View>
  );
}
