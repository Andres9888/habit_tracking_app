/**
 * LettersList Component
 * Displays list of existing letters with preview limit
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { LetterSummary } from '../LettersSection.types';
import { PREVIEW_LETTER_COUNT } from '../LettersSection.constants';
import { LetterItem } from './LetterItem';

interface LettersListProps {
  letters: LetterSummary[];
  onViewAllLetters: () => void;
  onReadLetter: (letterId: string) => void;
}

export function LettersList({
  letters,
  onViewAllLetters,
  onReadLetter,
}: LettersListProps) {
  if (letters.length === 0) {
    return null;
  }

  const displayLetters = letters.slice(0, PREVIEW_LETTER_COUNT);
  const hasMore = letters.length > PREVIEW_LETTER_COUNT;

  return (
    <View className='mt-4 border-t border-stone-100 pt-4'>
      <View className='mb-2 flex-row items-center justify-between'>
        <Text className='text-sm font-medium text-stone-600'>
          Your Letters ({letters.length})
        </Text>
        {hasMore && (
          <Pressable
            accessibilityLabel='View all letters'
            accessibilityRole='button'
            onPress={onViewAllLetters}
          >
            <Text className='text-xs font-medium text-violet-600'>
              View All
            </Text>
          </Pressable>
        )}
      </View>

      <View className='gap-2'>
        {displayLetters.map((letter) => (
          <LetterItem
            key={letter.id}
            letter={letter}
            onPress={() => onReadLetter(letter.id)}
          />
        ))}
      </View>
    </View>
  );
}
