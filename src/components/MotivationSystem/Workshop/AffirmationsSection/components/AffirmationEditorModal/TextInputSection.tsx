/**
 * TextInputSection Component
 * Text input field for affirmation text
 */

import React from 'react';
import { View, Text, TextInput } from 'react-native';

import { clsx } from 'clsx';

import { MAX_TEXT_LENGTH } from '../../AffirmationsSection.constants';

interface TextInputSectionProps {
  text: string;
  onChangeText: (text: string) => void;
}

export function TextInputSection({
  text,
  onChangeText,
}: TextInputSectionProps) {
  return (
    <View className='mb-4'>
      <Text className='mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400'>
        Your Affirmation
      </Text>
      <TextInput
        autoFocus
        multiline
        accessibilityLabel='Affirmation text'
        className='min-h-[100px] rounded-xl border-2 border-amber-200 bg-white px-4 py-3 text-base text-stone-800'
        maxLength={MAX_TEXT_LENGTH}
        placeholder="e.g., 'I am capable of achieving my goals'"
        placeholderTextColor='#a8a29e'
        textAlignVertical='top'
        value={text}
        onChangeText={onChangeText}
      />
      <View className='mt-2 flex-row items-center justify-between'>
        <Text className='text-xs text-stone-400'>
          {text.length < 3 ? `${3 - text.length} more characters needed` : ''}
        </Text>
        <Text
          className={clsx(
            'text-xs font-semibold',
            text.length >= MAX_TEXT_LENGTH
              ? 'text-rose-500'
              : text.length >= MAX_TEXT_LENGTH * 0.9
                ? 'text-amber-500'
                : 'text-stone-400'
          )}
        >
          {text.length}/{MAX_TEXT_LENGTH}
        </Text>
      </View>
    </View>
  );
}
