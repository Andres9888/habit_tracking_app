/**
 * IntroStep Component
 * Introduction screen explaining the visualization exercise
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Sun,
  CloudRain,
  Sparkles,
  ChevronRight,
  Brain,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { IntroStepProps } from '../types';

export function IntroStep({ habitName, onNext }: IntroStepProps) {
  return (
    <Animated.View className='flex-1 gap-6' entering={FadeInDown.springify().damping(18)}>
      {/* Header */}
      <View className='items-center gap-4'>
        <View className='h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600'>
          <Brain className='text-white' size={40} />
        </View>
        <Text className='text-center text-2xl font-bold tracking-tight text-stone-900'>
          Visualization Exercise
        </Text>
        <Text className='px-4 text-center text-base text-stone-500'>
          Science-backed technique to boost your motivation for{' '}
          <Text className='font-semibold text-violet-600'>{habitName}</Text>
        </Text>
      </View>

      {/* Explanation Cards */}
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

      {/* Huberman Quote */}
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

      {/* Start Button */}
      <Pressable
        accessibilityLabel='Start visualization exercise'
        accessibilityRole='button'
        className='mt-auto flex-row items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 active:opacity-90'
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onNext();
        }}
      >
        <Text className='text-[15px] font-semibold text-white'>
          Begin Exercise
        </Text>
        <ChevronRight className='text-white' size={20} />
      </Pressable>
    </Animated.View>
  );
}
