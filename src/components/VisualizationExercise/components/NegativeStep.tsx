/**
 * NegativeStep Component
 * Guides user through negative visualization (failure consequences)
 * Based on Tim Ferriss "Fear Setting" and Stoic premeditatio malorum
 */

import React from 'react';
import { View, Text, TextInput } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CloudRain, AlertTriangle, Lightbulb } from 'lucide-react-native';
import { PromptList } from './PromptList';
import { NavigationButtons } from './NavigationButtons';
import type { VisualizationInputStepProps } from '../types';

const PROMPTS = [
  'What happens if you quit this habit?',
  'How will you feel 6 months from now?',
  'What opportunities will you miss?',
];

export function NegativeStep({
  onBack,
  onNext,
  value,
  onValueChange,
}: VisualizationInputStepProps) {
  return (
    <Animated.View className='flex-1 gap-5' entering={FadeInDown.springify().damping(18)}>
      <View className='items-center gap-3'>
        <View className='h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-red-500'>
          <CloudRain className='text-white' size={32} />
        </View>
        <Text className='text-xl font-bold text-stone-900'>
          Visualize Failure
        </Text>
        <Text className='px-4 text-center text-sm text-stone-500'>
          Now imagine you've given up on this habit. What are the consequences?
          Be honest.
        </Text>
      </View>

      <PromptList
        bgColor='bg-rose-50'
        Icon={AlertTriangle}
        iconColor='text-rose-500'
        prompts={PROMPTS}
        textColor='text-rose-800'
        title='Consider these questions:'
        titleColor='text-rose-700'
      />

      <View className='flex-row items-start gap-2 rounded-xl bg-amber-50 p-3'>
        <Lightbulb className='mt-0.5 text-amber-500' size={16} />
        <Text className='flex-1 text-xs leading-relaxed text-amber-800'>
          <Text className='font-semibold'>Why this works: </Text>
          Fear of loss is neurologically twice as powerful as desire for gain.
        </Text>
      </View>

      <View className='flex-1'>
        <Text className='mb-2 text-sm font-medium text-stone-700'>
          Describe the consequences:
        </Text>
        <TextInput
          multiline
          className='flex-1 rounded-2xl border border-stone-200 bg-white p-4 text-base text-stone-800'
          placeholder='If I give up on this habit, I will experience...'
          placeholderTextColor='#a8a29e'
          style={{ minHeight: 150, textAlignVertical: 'top' }}
          value={value}
          onChangeText={onValueChange}
        />
      </View>

      <NavigationButtons
        activeColor='bg-rose-500'
        activeHoverColor='bg-rose-600'
        canContinue={value.trim().length > 0}
        onBack={onBack}
        onNext={onNext}
      />
    </Animated.View>
  );
}
