/**
 * FeelItPrompt - Prompt shown at bottom of visualization content
 */

import React from 'react';
import { View, Text } from 'react-native';

import { useThemeColors } from '../../../../theme/ThemeContext';
import type { VizType } from './types';

interface FeelItPromptProps {
  type: VizType;
}

export function FeelItPrompt({ type }: FeelItPromptProps) {
  const { colors } = useThemeColors();
  const isSuccess = type === 'success';

  return (
    <View
      className='mt-4 rounded-xl p-3'
      style={{ backgroundColor: isSuccess ? colors.status.successLight : colors.status.errorLight }}
    >
      <Text
        className='text-center text-xs font-medium italic'
        style={{ color: isSuccess ? colors.status.successText : colors.status.errorText }}
      >
        {isSuccess
          ? '✨ Feel this success in your body now'
          : '⚠️ Feel this weight of skipping now'}
      </Text>
    </View>
  );
}
