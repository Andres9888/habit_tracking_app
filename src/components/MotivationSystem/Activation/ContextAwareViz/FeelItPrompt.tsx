/**
 * FeelItPrompt - Prompt shown at bottom of visualization content
 */

import React from 'react';
import { View, Text } from 'react-native';

import { clsx } from 'clsx';

import type { VizType } from './types';

interface FeelItPromptProps {
  type: VizType;
}

export function FeelItPrompt({ type }: FeelItPromptProps) {
  const isSuccess = type === 'success';

  return (
    <View
      className={clsx(
        'mt-4 rounded-xl p-3',
        isSuccess ? 'bg-emerald-50' : 'bg-rose-50'
      )}
    >
      <Text
        className={clsx(
          'text-center text-xs font-medium italic',
          isSuccess ? 'text-emerald-700' : 'text-rose-700'
        )}
      >
        {isSuccess
          ? '✨ Feel this success in your body now'
          : '⚠️ Feel this weight of skipping now'}
      </Text>
    </View>
  );
}
