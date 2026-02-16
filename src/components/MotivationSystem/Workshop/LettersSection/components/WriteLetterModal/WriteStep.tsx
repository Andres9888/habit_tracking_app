/**
 * WriteStep Component
 * The writing step of the letter modal
 */

import React, { useRef } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { clsx } from 'clsx';
import { useThemeColors } from '../../../../../../theme/ThemeContext';
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
  const { colors, isDark } = useThemeColors();
  const contentRef = useRef<TextInput>(null);
  
  // Theme-aware violet accent
  const violetBg = isDark ? '#4c1d95' : '#ede9fe';
  const violetText = isDark ? '#c4b5fd' : '#7c3aed';
  const violetBorder = isDark ? '#6d28d9' : '#c4b5fd';

  return (
    <ScrollView
      className='flex-1'
      contentContainerClassName='p-4 pb-8'
      keyboardShouldPersistTaps='handled'
    >
      {/* Science callout */}
      <View 
        className='mb-4 flex-row items-start gap-2 rounded-xl p-3' 
        style={{ backgroundColor: violetBg }}
      >
        <Sparkles color={violetText} size={16} style={{ marginTop: 2 }} />
        <Text className='flex-1 text-xs leading-relaxed' style={{ color: violetText }}>
          Research shows that connecting with your future self increases
          self-control and long-term thinking. Write as if you're talking to a
          close friend.
        </Text>
      </View>

      {/* Title input */}
      <View className='mb-4'>
        <Text 
          className='mb-2 text-xs font-semibold uppercase tracking-wide' 
          style={{ color: colors.text.tertiary }}
        >
          Title (optional)
        </Text>
        <TextInput
          accessibilityLabel='Letter title'
          blurOnSubmit={false}
          className='rounded-xl px-4 py-3 text-base'
          maxLength={MAX_TITLE_LENGTH}
          placeholder='e.g., "Keep Going" or "Remember Why"'
          placeholderTextColor={colors.text.tertiary}
          returnKeyType='next'
          style={{
            backgroundColor: colors.surface,
            borderColor: isDark ? colors.gray[700] : colors.border,
            borderWidth: 2,
            color: colors.text.primary,
          }}
          value={title}
          onChangeText={onTitleChange}
          onSubmitEditing={() => contentRef.current?.focus()}
        />
        <Text className='mt-1 text-right text-xs' style={{ color: colors.text.tertiary }}>
          {title.length}/{MAX_TITLE_LENGTH}
        </Text>
      </View>

      {/* Content input */}
      <View>
        <Text 
          className='mb-2 text-xs font-semibold uppercase tracking-wide' 
          style={{ color: colors.text.tertiary }}
        >
          Your Letter
        </Text>
        <TextInput
          ref={contentRef}
          multiline
          accessibilityLabel='Letter content'
          className='min-h-[200px] rounded-xl px-4 py-3 text-base'
          maxLength={MAX_CONTENT_LENGTH}
          placeholder="Dear Future Me,

I'm writing this because..."
          placeholderTextColor={colors.text.tertiary}
          style={{
            backgroundColor: colors.surface,
            borderColor: violetBorder,
            borderWidth: 2,
            color: colors.text.primary,
          }}
          textAlignVertical='top'
          value={content}
          onChangeText={onContentChange}
        />
        <View className='mt-2 flex-row items-center justify-between'>
          <Text className='text-xs' style={{ color: colors.text.tertiary }}>
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
                  : ''
            )}
            style={
              content.length < MAX_CONTENT_LENGTH * 0.9
                ? { color: colors.text.tertiary }
                : undefined
            }
          >
            {content.length}/{MAX_CONTENT_LENGTH}
          </Text>
        </View>
      </View>

      <WritingPrompts />
    </ScrollView>
  );
}
