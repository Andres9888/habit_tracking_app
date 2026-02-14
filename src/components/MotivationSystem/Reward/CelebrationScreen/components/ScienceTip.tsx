/**
 * ScienceTip - Educational tip about habit formation science
 * Uses theme-aware colors for dark mode support.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';

export function ScienceTip() {
  const { colors } = useThemeColors();

  return (
    <View
      className='mt-4 rounded-xl p-3'
      style={{ backgroundColor: colors.gray[100] }}
    >
      <Text
        className='text-center text-xs italic'
        style={{ color: colors.text.secondary }}
      >
        💡 BJ Fogg (Stanford): Celebration immediately after a behavior is the
        most powerful way to wire a new habit.
      </Text>
    </View>
  );
}
