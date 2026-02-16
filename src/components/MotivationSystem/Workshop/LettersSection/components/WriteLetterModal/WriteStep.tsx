/**
 * WriteStep Component
 * The writing step of the letter modal
 */

import React, { useRef } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { clsx } from 'clsx';
import {
  MAX_CONTENT_LENGTH,
  MAX_TITLE_LENGTH,
} from '../../LettersSection.constants';
import { WritingPrompts } from './WritingPrompts';

interface WriteStepProps {
  title: string;
  content: string;
  onTitleChange: (text: string) => void;
  onContentChange: (text: string) => void;
}

export function WriteStep({
  title,
  content,
  onTitleChange,
  onContentChange,
}: WriteStepProps) {
  const contentRef = useRef<TextInput>(null);

  return (
    <ScrollView
      className='flex-1'
      contentContainerClassName='p-4 pb-8'
      keyboardShouldPersistTaps='handled'
    >
      {/* Science callout */}
      <View className='mb-4 flex-row items-start gap-2 rounded-xl bg-violet-50 p-3'>
        <Sparkles className='mt-0.5 text-violet-500' size={16} />
        <Text className='flex-1 text-xs leading-relaxed text-violet-700'>
          Research shows that connecting with your future self increases
          self-control and long-term thinking. Write as if you're talking to a
          close friend.
        </Text>
      </View>

      {/* Title input */}
      <View className='mb-4'>
        <Text className='mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400'>
          Title (optional)
        </Text>
        <TextInput
          accessibilityLabel='Letter title'
          blurOnSubmit={false}
          className='rounded-xl border-2 border-stone-200 bg-white px-4 py-3 text-base text-stone-800'
          maxLength={MAX_TITLE_LENGTH}
          placeholder='e.g., "Keep Going" or "Remember Why"'
          placeholderTextColor='#a8a29e'
          returnKeyType='next'
          value={title}
          onChangeText={onTitleChange}
          onSubmitEditing={() => contentRef.current?.focus()}
        />
        <Text className='mt-1 text-right text-xs text-stone-400'>
          {title.length}/{MAX_TITLE_LENGTH}
        </Text>
      </View>

      {/* Content input */}
      <View>
        <Text className='mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400'>
          Your Letter
        </Text>
        <TextInput
          ref={contentRef}
          multiline
          accessibilityLabel='Letter content'
          className='min-h-[200px] rounded-xl border-2 border-violet-200 bg-white px-4 py-3 text-base text-stone-800'
          maxLength={MAX_CONTENT_LENGTH}
          placeholder="Dear Future Me,

I'm writing this because..."
          placeholderTextColor='#a8a29e'
          textAlignVertical='top'
          value={content}
          onChangeText={onContentChange}
        />
        <View className='mt-2 flex-row items-center justify-between'>
          <Text className='text-xs text-stone-400'>
            {content.length < 10
              ? `${10 - content.length} more characters needed`
              : ''}
          </Text>
          <Text
            className={clsx(
              'text-xs font-semibold',
              content.length >= MAX_CONTENT_LENGTH
                ? 'text-rose-500'
                : content.length >= MAX_CONTENT_LENGTH * 0.9
                  ? 'text-amber-500'
                  : 'text-stone-400'
            )}
          >
            {content.length}/{MAX_CONTENT_LENGTH}
          </Text>
        </View>
      </View>

      <WritingPrompts />
    </ScrollView>
  );
}
