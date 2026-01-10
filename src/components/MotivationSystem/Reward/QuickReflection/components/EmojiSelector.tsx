import React from 'react';
import { View } from 'react-native';

import { EMOJI_OPTIONS } from '../QuickReflection.constants';
import type { EmojiType } from '../QuickReflection.types';

import { EmojiButton } from './EmojiButton';

interface EmojiSelectorProps {
  selectedEmoji?: EmojiType;
  onSelect: (emoji: EmojiType) => void;
  reduceMotion: boolean;
}

export function EmojiSelector({
  selectedEmoji,
  onSelect,
  reduceMotion,
}: EmojiSelectorProps) {
  return (
    <View className='mb-4 flex-row items-center justify-around'>
      {EMOJI_OPTIONS.map((option) => (
        <EmojiButton
          key={option.type}
          emoji={option.emoji}
          isSelected={selectedEmoji === option.type}
          label={option.label}
          reduceMotion={reduceMotion}
          onPress={() => onSelect(option.type)}
        />
      ))}
    </View>
  );
}
