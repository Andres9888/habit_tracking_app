/**
 * MotivationText Component
 * Displays the motivational message above the create button
 */

import React from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import STRINGS from '../../../../constants/strings';

export function MotivationText() {
  const { colors } = useThemeColors();

  return (
    <View
      accessible
      accessibilityLabel={`${STRINGS.CREATE_HABIT.motivationHighlight}${STRINGS.CREATE_HABIT.motivationSuffix}`}
      accessibilityRole='text'
      className='mb-3 items-center'
    >
      <Text className='text-sm' style={{ color: colors.text.secondary }}>
        <Text className='font-semibold' style={{ color: '#059669' }}>
          {STRINGS.CREATE_HABIT.motivationHighlight}
        </Text>
        {STRINGS.CREATE_HABIT.motivationSuffix}
      </Text>
    </View>
  );
}
