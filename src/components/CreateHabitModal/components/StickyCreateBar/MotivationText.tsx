/**
 * MotivationText Component
 * Displays the motivational message above the create button
 */

import React from 'react';
import { Text, View } from 'react-native';
import STRINGS from '../../../../constants/strings';

export function MotivationText() {
  return (
    <View
      accessible
      accessibilityLabel={`${STRINGS.CREATE_HABIT.motivationHighlight}${STRINGS.CREATE_HABIT.motivationSuffix}`}
      accessibilityRole='text'
      className='mb-3 items-center'
    >
      <Text className='text-[13px] text-stone-500'>
        <Text className='font-semibold text-emerald-600'>
          {STRINGS.CREATE_HABIT.motivationHighlight}
        </Text>
        {STRINGS.CREATE_HABIT.motivationSuffix}
      </Text>
    </View>
  );
}
