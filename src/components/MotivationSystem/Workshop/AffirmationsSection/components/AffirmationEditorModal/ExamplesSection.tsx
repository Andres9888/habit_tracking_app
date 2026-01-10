/**
 * ExamplesSection Component
 * Example affirmations for inspiration
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MessageSquareQuote } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { EXAMPLE_AFFIRMATIONS } from '../../AffirmationsSection.constants';

interface ExamplesSectionProps {
  onSelectExample: (example: string) => void;
}

export function ExamplesSection({ onSelectExample }: ExamplesSectionProps) {
  return (
    <View className='mt-2'>
      <Text className='mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400'>
        Examples for Inspiration
      </Text>
      <View className='gap-2'>
        {EXAMPLE_AFFIRMATIONS.map((example, index) => (
          <Pressable
            key={index}
            className='flex-row items-start gap-2 rounded-lg bg-stone-50 px-3 py-2'
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelectExample(example);
            }}
          >
            <MessageSquareQuote className='mt-0.5 text-amber-400' size={14} />
            <Text className='flex-1 text-sm italic text-stone-600'>
              "{example}"
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
