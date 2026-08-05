/**
 * StrengthEmptyState
 *
 * Shown before a habit has enough completion history to compute strength.
 * Uses the user's chosen "starting" progress emoji for continuity.
 */

import React from 'react';
import { Text, View } from 'react-native';

import { useThemeColors } from '@/theme/ThemeContext';

import { shadows, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface StrengthEmptyStateProps {
  /** The user's chosen emoji for the first (starting) level */
  startingEmoji: string;
}

export const StrengthEmptyState = React.memo(function StrengthEmptyState({
  startingEmoji,
}: StrengthEmptyStateProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View
      className='rounded-2xl p-5'
      style={{ ...shadows.card, backgroundColor: themeColors.card }}
    >
      <Text
        style={{
          ...typography.heading3,
          marginBottom: spacing.sm,
          color: themeColors.text.primary,
        }}
      >
        Habit Strength
      </Text>
      <View
        className='items-center rounded-2xl px-6 py-8'
        style={{
          backgroundColor: themeColors.background,
          borderColor: themeColors.border,
          borderStyle: 'dashed',
          borderWidth: 1,
        }}
      >
        <View
          className='mb-3 h-14 w-14 items-center justify-center rounded-full'
          style={{ backgroundColor: themeColors.card }}
        >
          <Text className='text-3xl'>{startingEmoji}</Text>
        </View>
        <Text
          style={{
            ...typography.heading3,
            color: themeColors.text.primary,
            textAlign: 'center',
          }}
        >
          Not enough data yet
        </Text>
        <Text
          className='mt-1 text-center'
          style={{ color: themeColors.text.secondary, maxWidth: 260 }}
        >
          Complete your first day to start building strength.
        </Text>
      </View>
    </View>
  );
});
