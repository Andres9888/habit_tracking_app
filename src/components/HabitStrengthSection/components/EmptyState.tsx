/**
 * Empty state for HabitStrengthSection
 * Shows when user has no completions yet
 */
import React from 'react';
import { Text, View } from 'react-native';

export function EmptyState() {
  return (
    <View className='rounded-2xl bg-white p-5 shadow-sm'>
      <Text className='mb-2 text-lg font-bold text-stone-800'>
        Habit Strength
      </Text>
      <View className='items-center justify-center py-8'>
        <Text className='mb-2 text-4xl'>🌱</Text>
        <Text className='text-center text-stone-500'>
          Complete your first day to start building strength!
        </Text>
      </View>
    </View>
  );
}
