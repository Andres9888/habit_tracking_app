/**
 * InlineEmojiInput Component
 */

import { useRef, useCallback } from 'react';
import { Animated, Text, TextInput, View, Keyboard } from 'react-native';
import { useInputAnimations } from './useInputAnimations';
import { MAX_LENGTH, getValidationColor } from './constants';
import { EmojiBox } from './EmojiBox';
import type { InlineEmojiInputProps } from './types';

export const InlineEmojiInput = ({
  emoji,
  color,
  value,
  onChange,
  onFocus,
  onEmojiPress,
  autoFocus,
}: InlineEmojiInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const {
    charCount,
    isNearLimit,
    validation,
    validationOpacity,
    validationTranslateY,
    emojiScale,
    emojiBoxScale,
    triggerSelection,
    handleEmojiBoxPressIn,
    handleEmojiBoxPressOut,
  } = useInputAnimations(value, emoji);

  const handleEmojiBoxPress = useCallback(() => {
    triggerSelection();
    Keyboard.dismiss();
    onEmojiPress();
  }, [triggerSelection, onEmojiPress]);

  const displayEmoji = emoji || '✨';
  const isDefaultEmoji = !emoji;

  return (
    <View className='mb-4'>
      <View className='relative'>
        <EmojiBox
          color={color}
          displayEmoji={displayEmoji}
          emojiBoxScale={emojiBoxScale}
          emojiScale={emojiScale}
          isDefaultEmoji={isDefaultEmoji}
          onPress={handleEmojiBoxPress}
          onPressIn={handleEmojiBoxPressIn}
          onPressOut={handleEmojiBoxPressOut}
        />
        <TextInput
          ref={inputRef}
          blurOnSubmit
          accessibilityHint='Enter the name of your new habit'
          accessibilityLabel='Habit name input'
          autoFocus={autoFocus}
          className='h-14 rounded-2xl bg-white pl-16 pr-14 text-base font-medium text-stone-800 shadow-sm'
          maxLength={MAX_LENGTH}
          placeholder='What habit to build?'
          placeholderTextColor='#a8a29e'
          returnKeyType='done'
          style={{
            borderColor: value.length > 0 ? '#10b981' : '#e7e5e4',
            borderWidth: value.length > 0 ? 2 : 1,
          }}
          value={value}
          onChangeText={onChange}
          onFocus={onFocus}
        />
        <View className='-transtone-y-1/2 absolute right-3 top-1/2'>
          <Text
            className={`text-xs font-medium ${isNearLimit ? 'text-amber-500' : 'text-stone-400'}`}
          >
            {charCount}/{MAX_LENGTH}
          </Text>
        </View>
      </View>
      {validation && (
        <Animated.View
          className='mt-2 px-1'
          style={{
            opacity: validationOpacity,
            transform: [{ translateY: validationTranslateY }],
          }}
        >
          <Text
            className={`text-sm font-medium ${getValidationColor(validation?.type)}`}
          >
            {validation.message}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

export default InlineEmojiInput;
