import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Target } from 'lucide-react-native';

interface WOOPReminderProps {
  obstacle: string;
  plan: string;
}

/**
 * WOOPReminder - IF-THEN implementation intention
 */
export function WOOPReminder({ obstacle, plan }: WOOPReminderProps) {
  return (
    <View className='rounded-2xl p-4'>
      <LinearGradient
        colors={['#fffbeb', '#ecfdf5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className='absolute inset-0 rounded-2xl'
      />
      <View className='mb-2 flex-row items-center gap-2'>
        <View className='h-8 w-8 items-center justify-center rounded-lg bg-amber-100'>
          <Target className='text-amber-600' size={16} />
        </View>
        <Text className='font-semibold text-stone-800'>Your Plan</Text>
      </View>
      <Text className='text-sm leading-5 text-stone-700'>
        <Text className='font-medium text-amber-700'>If </Text>
        {obstacle}
        <Text className='font-medium text-emerald-700'> → then </Text>
        {plan}
      </Text>
    </View>
  );
}
