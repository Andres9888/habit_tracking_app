import React from 'react';
import { View, Text } from 'react-native';
import { Sun, CloudRain, Sparkles } from 'lucide-react-native';

export function ExplanationCards() {
  return (
    <>
      <View className='gap-3'>
        <View className='flex-row items-start gap-3 rounded-2xl bg-emerald-50 p-4'>
          <View className='h-10 w-10 items-center justify-center rounded-xl bg-emerald-100'>
            <Sun className='text-emerald-600' size={20} />
          </View>
          <View className='flex-1'>
            <Text className='text-sm font-semibold text-emerald-800'>
              Positive Visualization
            </Text>
            <Text className='mt-1 text-xs leading-relaxed text-emerald-700'>
              Imagine the best outcome. What does success look like? How will
              you feel?
            </Text>
          </View>
        </View>
        <View className='flex-row items-start gap-3 rounded-2xl bg-rose-50 p-4'>
          <View className='h-10 w-10 items-center justify-center rounded-xl bg-rose-100'>
            <CloudRain className='text-rose-600' size={20} />
          </View>
          <View className='flex-1'>
            <Text className='text-sm font-semibold text-rose-800'>
              Negative Visualization
            </Text>
            <Text className='mt-1 text-xs leading-relaxed text-rose-700'>
              Imagine failing. What are the consequences? This creates "push"
              motivation.
            </Text>
          </View>
        </View>
      </View>
      <View className='rounded-2xl border border-amber-200 bg-amber-50 p-4'>
        <View className='flex-row items-start gap-2'>
          <Sparkles className='mt-0.5 text-amber-500' size={16} />
          <Text className='flex-1 text-sm italic leading-relaxed text-amber-800'>
            "Thinking about failure is actually a very effective way to reach
            your goals... it recruits the autonomic nervous system in ways that
            support action."
          </Text>
        </View>
        <Text className='mt-2 text-right text-xs font-medium text-amber-600'>
          — Andrew Huberman
        </Text>
      </View>
    </>
  );
}
