/**
 * StrengthEmptyState
 *
 * Shown before a habit has any completion history. Instead of a dead-end
 * "not enough data" message, it presents the path to the first milestone
 * (Habit Starter, 3-day streak) and a primary action to mark today complete.
 * The first completion flips `isEmpty` false, so the card swaps to the live view.
 */

import React from 'react';
import { Text, View } from 'react-native';

import { colors as palette } from '@/theme/colors';
import { useThemeColors } from '@/theme/ThemeContext';

import { borderRadius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Button } from '../Button';
import { MILESTONES } from '../ProgressSectionConsolidated/milestones.data';
import { LEVELS } from '../StrengthProgressBar/StrengthProgressBar.constants';

interface StrengthEmptyStateProps {
  /** The user's chosen emoji for the first (starting) level */
  startingEmoji: string;
  /** Marks today complete; reuses the calendar's real toggle */
  onMarkTodayComplete?: () => void;
}

const firstMilestone = MILESTONES[0];
const startingLabel = LEVELS[0].label;

export const StrengthEmptyState = React.memo(function StrengthEmptyState({
  startingEmoji,
  onMarkTodayComplete,
}: StrengthEmptyStateProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='rounded-2xl p-5 shadow-sm' style={{ backgroundColor: themeColors.card }}>
      <View className='mb-4 flex-row items-center justify-between'>
        <Text style={{ ...typography.heading3, color: themeColors.text.primary }}>
          Habit Strength
        </Text>
        <View
          className='flex-row items-center rounded-full px-2.5 py-1'
          style={{ backgroundColor: palette.strength.startingLight }}
        >
          <Text className='mr-1 text-xs'>{startingEmoji}</Text>
          <Text style={{ ...typography.caption, color: palette.strength.starting }}>
            {startingLabel}
          </Text>
        </View>
      </View>

      <View
        className='items-center rounded-2xl px-6 py-7'
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

        <Text style={{ ...typography.heading3, color: themeColors.text.primary, textAlign: 'center' }}>
          {firstMilestone.days} days to {firstMilestone.name}
        </Text>
        <Text className='mt-1 text-center' style={{ color: themeColors.text.secondary, maxWidth: 280 }}>
          Strength grows the more days you show up. Miss a day? Your streak shield
          protects you. Complete today to start.
        </Text>

        <View className='mt-4 flex-row items-center' style={{ gap: spacing.sm }}>
          {Array.from({ length: firstMilestone.days }).map((_, index) => (
            <View
              key={`milestone-dot-${index}`}
              className='h-2 w-2 rounded-full'
              style={{ backgroundColor: themeColors.border }}
            />
          ))}
        </View>
        <Text className='mt-2' style={{ ...typography.caption, color: themeColors.text.secondary }}>
          Day 0 of {firstMilestone.days} · {startingLabel}
        </Text>

        <Button
          accessibilityLabel='Mark today complete'
          fullWidth
          style={{ backgroundColor: themeColors.text.primary, borderRadius: borderRadius.button, marginTop: spacing.lg }}
          textStyle={{ color: themeColors.card }}
          variant='primary'
          onPress={onMarkTodayComplete}
        >
          Mark today complete
        </Button>
      </View>
    </View>
  );
});
