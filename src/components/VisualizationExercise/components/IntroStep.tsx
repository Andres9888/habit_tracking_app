/**
 * IntroStep Component
 * Introduction screen explaining the visualization exercise
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChevronRight, Brain } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { IntroStepProps } from '../types';
import { ExplanationCards } from './ExplanationCards';

export function IntroStep({ habitName, onNext }: IntroStepProps) {
  return (
    <Animated.View
      className='flex-1 gap-6'
      entering={FadeInDown.springify().damping(18)}
    >
      <View className='items-center gap-4'>
        <View className='h-20 w-20 items-center justify-center rounded-3xl'>
          <LinearGradient
            className='absolute inset-0 rounded-3xl'
            colors={['#7c3aed', '#4f46e5']}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
          />
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
      <ExplanationCards />
      <Pressable
        accessibilityLabel='Start visualization exercise'
        accessibilityRole='button'
        className='mt-auto flex-row items-center justify-center gap-2 rounded-2xl py-4 active:opacity-90'
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onNext();
        }}
      >
        <LinearGradient
          className='absolute inset-0 rounded-2xl'
          colors={['#7c3aed', '#4f46e5']}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
        />
        <Text className='text-[15px] font-semibold text-white'>
          Begin Exercise
        </Text>
        <ChevronRight className='text-white' size={20} />
      </Pressable>
    </Animated.View>
  );
}
