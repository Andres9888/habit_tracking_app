/**
 * LetterItem Component
 * Individual letter display with locked/unlocked state
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { Lock, Mail } from 'lucide-react-native';
import { clsx } from 'clsx';

import type { LetterSummary } from '../LettersSection.types';
import {
  formatRelativeTime,
  calculateDaysUntilUnlock,
  isLetterLocked,
  isLetterNew,
} from '../LettersSection.utils';

interface LetterItemProps {
  letter: LetterSummary;
  onPress: () => void;
}

export function LetterItem({ letter, onPress }: LetterItemProps) {
  const locked = isLetterLocked(letter.unlockAt);
  const daysUntilUnlock = calculateDaysUntilUnlock(letter.unlockAt);
  const isNew = isLetterNew(letter.unlockAt, letter.isRead);

  return (
    <Pressable
      accessibilityLabel={
        locked
          ? `Locked letter: ${letter.title || 'Letter'}, unlocks in ${daysUntilUnlock} days`
          : `${isNew ? 'Unread letter' : 'Letter'}: ${letter.title || 'Letter'}`
      }
      accessibilityRole='button'
      className={clsx(
        'flex-row items-center gap-3 rounded-xl p-3',
        locked ? 'bg-stone-50' : isNew ? 'bg-violet-50' : 'bg-stone-50'
      )}
      onPress={onPress}
    >
      <View
        className={clsx(
          'h-10 w-10 items-center justify-center rounded-full',
          locked ? 'bg-stone-200' : isNew ? 'bg-violet-500' : 'bg-violet-100'
        )}
      >
        {locked ? (
          <Lock className='text-stone-500' size={18} />
        ) : (
          <Mail
            className={isNew ? 'text-white' : 'text-violet-600'}
            size={18}
          />
        )}
      </View>
      <View className='flex-1'>
        <Text
          className={clsx(
            'font-medium',
            locked ? 'text-stone-500' : 'text-stone-700'
          )}
          numberOfLines={1}
        >
          {letter.title || 'Letter to Future Self'}
        </Text>
        <Text className='text-xs text-stone-400'>
          {locked
            ? `Unlocks in ${daysUntilUnlock} day${daysUntilUnlock === 1 ? '' : 's'}`
            : isNew
              ? 'Ready to read!'
              : `Read ${formatRelativeTime(letter.unlockAt)}`}
        </Text>
      </View>
      {isNew && <View className='h-2.5 w-2.5 rounded-full bg-violet-500' />}
    </Pressable>
  );
}
