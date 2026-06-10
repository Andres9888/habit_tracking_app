/** Single formed habit row — gold-tinted trophy card with a Resume action */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { colors as themeColors } from '@/theme';
import { iconSizes } from '@/theme/iconSizes';
import { borderRadius } from '../../../../theme/spacing';
import { typography, fontWeights, fontFamilies } from '@/theme/typography';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { Habit } from '../../types';

interface FormedHabitCardProps {
  habit: Habit;
  onResume: (habitId: Habit['_id'], habitName: string) => void;
}

function formatFormedDate(formedAt?: number): string {
  if (!formedAt) return 'Formed';
  const opts = { day: 'numeric', month: 'short' } as const;
  return `Formed ${new Date(formedAt).toLocaleDateString(undefined, opts)}`;
}

export function FormedHabitCard({ habit, onResume }: FormedHabitCardProps) {
  const { colors } = useThemeColors();
  const subtitle = [
    formatFormedDate(habit.formedAt),
    habit.bestStreak ? `${habit.bestStreak} day best streak` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: colors.card,
        borderColor: themeColors.streak[300],
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 12,
        marginBottom: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
      }}
    >
      <Text style={{ fontSize: 24 }}>{habit.icon ?? '🏆'}</Text>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          numberOfLines={1}
          style={{
            color: colors.text.primary,
            fontFamily: fontFamilies.primary.text,
            fontSize: typography.body.fontSize,
            fontWeight: fontWeights.semibold,
          }}
        >
          {habit.name}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            color: colors.text.secondary,
            fontFamily: fontFamilies.primary.text,
            fontSize: typography.caption.fontSize,
            marginTop: 2,
          }}
        >
          {subtitle}
        </Text>
      </View>
      <Trophy color={themeColors.streak[300]} size={iconSizes.small} strokeWidth={2} />
      <Pressable
        accessibilityLabel={`Resume tracking ${habit.name}`}
        accessibilityRole='button'
        style={({ pressed }) => ({
          borderColor: colors.border,
          borderRadius: borderRadius.medium,
          borderWidth: 1,
          opacity: pressed ? 0.7 : 1,
          paddingHorizontal: 12,
          paddingVertical: 8,
        })}
        onPress={() => onResume(habit._id, habit.name)}
      >
        <Text
          style={{
            color: colors.text.secondary,
            fontFamily: fontFamilies.primary.text,
            fontSize: typography.caption.fontSize,
            fontWeight: fontWeights.semibold,
          }}
        >
          Resume
        </Text>
      </Pressable>
    </View>
  );
}
