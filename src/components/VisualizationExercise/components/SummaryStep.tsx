/**
 * SummaryStep Component
 * Shows both visualizations and allows saving the mental contrasting exercise
 */

import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Sun, CloudRain, Target, Brain, Save } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { SummaryStepProps } from '../types';

export function SummaryStep({
  habitName,
  negativeVisualization,
  onBack,
  onSave,
  positiveVisualization,
}: SummaryStepProps) {
  return (
    <Animated.View className='flex-1 gap-5' entering={FadeInDown.springify()}>
      {/* Header */}
      <View className='items-center gap-3'>
        <View className='h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600'>
          <Target className='text-white' size={32} />
        </View>
        <Text className='text-xl font-bold text-stone-900'>
          Your Visualization
        </Text>
        <Text className='px-4 text-center text-sm text-stone-500'>
          Review your mental contrasting exercise for{' '}
          <Text className='font-semibold text-violet-600'>{habitName}</Text>
        </Text>
      </View>

      {/* Visualizations */}
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <View className='gap-4 pb-4'>
          {/* Positive */}
          <View className='rounded-2xl border border-emerald-200 bg-emerald-50 p-4'>
            <View className='mb-3 flex-row items-center gap-2'>
              <Sun className='text-emerald-600' size={18} />
              <Text className='text-sm font-semibold text-emerald-800'>
                Success Vision
              </Text>
            </View>
            <Text className='text-sm leading-relaxed text-emerald-900'>
              "{positiveVisualization}"
            </Text>
          </View>

          {/* Negative */}
          <View className='rounded-2xl border border-rose-200 bg-rose-50 p-4'>
            <View className='mb-3 flex-row items-center gap-2'>
              <CloudRain className='text-rose-600' size={18} />
              <Text className='text-sm font-semibold text-rose-800'>
                Failure Consequences
              </Text>
            </View>
            <Text className='text-sm leading-relaxed text-rose-900'>
              "{negativeVisualization}"
            </Text>
          </View>

          {/* Insight */}
          <View className='rounded-2xl bg-violet-50 p-4'>
            <View className='flex-row items-start gap-2'>
              <Brain className='mt-0.5 text-violet-500' size={16} />
              <View className='flex-1'>
                <Text className='text-sm font-semibold text-violet-800'>
                  Mental Contrasting Complete
                </Text>
                <Text className='mt-1 text-xs leading-relaxed text-violet-700'>
                  By holding both visions in mind, you've created a productive
                  tension that drives action. Review these visualizations when
                  motivation dips.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Actions */}
      <View className='flex-row gap-3'>
        <Pressable
          accessibilityLabel='Go back to edit'
          accessibilityRole='button'
          className='flex-1 items-center rounded-xl border border-stone-200 bg-white py-3.5 active:bg-stone-50'
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onBack();
          }}
        >
          <Text className='text-sm font-medium text-stone-600'>Edit</Text>
        </Pressable>
        <Pressable
          accessibilityLabel='Save visualization'
          accessibilityRole='button'
          className='flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 active:opacity-90'
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onSave();
          }}
        >
          <Save className='text-white' size={18} />
          <Text className='text-sm font-semibold text-white'>Save</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
