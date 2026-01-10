/**
 * WritingPrompts Component
 * Displays helpful writing prompts for letter composition
 */

import React from 'react';
import { View, Text } from 'react-native';

const PROMPTS = [
  'What will you feel when you achieve this habit?',
  'What would you tell yourself on a hard day?',
  'Why did you start this journey?',
  'What are you most proud of right now?',
];

export function WritingPrompts() {
  return (
    <View className='mt-6'>
      <Text className='mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400'>
        Writing Prompts
      </Text>
      <View className='gap-2'>
        {PROMPTS.map((prompt, index) => (
          <View
            key={index}
            className='flex-row items-start gap-2 rounded-lg bg-stone-50 px-3 py-2'
          >
            <Text className='text-violet-500'>•</Text>
            <Text className='flex-1 text-xs text-stone-600'>{prompt}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
