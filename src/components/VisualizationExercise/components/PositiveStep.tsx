/**
 * PositiveStep Component
 * Guides user through positive visualization (success outcomes)
 */

import React from 'react';
import { View, Text, TextInput } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Sun, CheckCircle2 } from 'lucide-react-native';
import { PromptList } from './PromptList';
import { NavigationButtons } from './NavigationButtons';
import type { VisualizationInputStepProps } from '../types';

const PROMPTS = [
  'How do you feel after completing this habit?',
  'What positive changes do you notice?',
  'How does success impact other areas of life?',
];

export function PositiveStep({
  onBack,
  onNext,
  value,
  onValueChange,
}: VisualizationInputStepProps) {
  return (
    <Animated.View className='flex-1 gap-5' entering={FadeInDown.springify().damping(18)}>
      <View className='items-center gap-3'>
        <View className='h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500'>
          <Sun className='text-white' size={32} />
        </View>
        <Text className='text-xl font-bold text-stone-900'>
          Visualize Success
        </Text>
        <Text className='px-4 text-center text-sm text-stone-500'>
          Close your eyes for a moment. Imagine you've achieved your goal. What
          does that look like?
        </Text>
      </View>

      <PromptList
        bgColor='bg-emerald-50'
        Icon={CheckCircle2}
        iconColor='text-emerald-500'
        prompts={PROMPTS}
        textColor='text-emerald-800'
        title='Consider these questions:'
        titleColor='text-emerald-700'
      />

      <View className='flex-1'>
        <Text className='mb-2 text-sm font-medium text-stone-700'>
          Describe your positive vision:
        </Text>
        <TextInput
          multiline
          className='flex-1 rounded-2xl border border-stone-200 bg-white p-4 text-base text-stone-800'
          placeholder='When I successfully maintain this habit, I see myself...'
          placeholderTextColor='#a8a29e'
          style={{ minHeight: 150, textAlignVertical: 'top' }}
          value={value}
          onChangeText={onValueChange}
        />
      </View>

      <NavigationButtons
        activeColor='bg-emerald-500'
        activeHoverColor='bg-emerald-600'
        canContinue={value.trim().length > 0}
        onBack={onBack}
        onNext={onNext}
      />
    </Animated.View>
  );
}
