/**
 * LockedLetterView Component
 * Displays the locked state for letters that can't be read yet
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Lock } from 'lucide-react-native';
import { formatLetterUnlockDate } from '../../../../../utils/dateFormat';

interface LockedLetterViewProps {
  unlockAt: number;
}

export function LockedLetterView({ unlockAt }: LockedLetterViewProps) {
  const unlockDateString = formatLetterUnlockDate(unlockAt);

  return (
    <View className='flex-1 items-center justify-center px-8'>
      <View className='h-20 w-20 items-center justify-center rounded-full bg-stone-100'>
        <Lock className='text-stone-400' size={36} />
      </View>
      <Text className='mt-4 text-center text-lg font-semibold text-stone-600'>
        This letter is still locked
      </Text>
      <Text className='mt-2 text-center text-sm text-stone-500'>
        It will unlock on {unlockDateString}
      </Text>
    </View>
  );
}
