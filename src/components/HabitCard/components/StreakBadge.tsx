/**
 * StreakBadge Component
 * Displays the current streak with tiered celebration styling.
 * Tiers: standard (1-6), silver (7-29), gold (30-99), platinum (100+)
 * Theme-aware for perfect dark mode support.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import { streakStyles } from '../HabitCard.streakStyles';

interface StreakBadgeProps {
  currentStreak: number;
  bestStreak: number;
}

/** Streak tier configuration for celebration intensity */
function getStreakTier(streak: number) {
  if (streak >= 100) {
    return {
      emoji: '💎',
      label: 'Unstoppable',
      bg: { light: '#EDE9FE', dark: '#4C1D9533' }, // violet tint
      text: { light: '#6D28D9', dark: '#C4B5FD' },
      border: { light: '#C4B5FD', dark: '#7C3AED55' },
      glow: true,
    };
  }
  if (streak >= 30) {
    return {
      emoji: '🏆',
      label: 'On Fire',
      bg: { light: '#FEF3C7', dark: '#92400E33' }, // golden
      text: { light: '#B45309', dark: '#FCD34D' },
      border: { light: '#FCD34D', dark: '#F59E0B55' },
      glow: true,
    };
  }
  if (streak >= 7) {
    return {
      emoji: '🔥',
      label: null,
      bg: { light: '#FEF9C3', dark: '#78350F33' }, // warm amber
      text: { light: '#A16207', dark: '#FDE68A' },
      border: { light: '#FDE68A', dark: '#F59E0B44' },
      glow: false,
    };
  }
  return {
    emoji: '🔥',
    label: null,
    bg: { light: '#FEF9C3', dark: '#78350F22' }, // subtle amber
    text: { light: '#A16207', dark: '#FDE68A' },
    border: { light: 'transparent', dark: 'transparent' },
    glow: false,
  };
}

export function StreakBadge({ currentStreak, bestStreak }: StreakBadgeProps) {
  const theme = useAppTheme();
  const { isDark } = useThemeColors();

  if (currentStreak <= 0) {
    return null;
  }

  const tier = getStreakTier(currentStreak);
  const mode = isDark ? 'dark' : 'light';

  return (
    <View style={streakStyles.streakRow}>
      <View
        style={[
          streakStyles.streakBadge,
          {
            backgroundColor: tier.bg[mode],
            borderWidth: tier.glow ? 1 : 0,
            borderColor: tier.border[mode],
          },
        ]}
      >
        <Text style={streakStyles.streakFireIcon}>{tier.emoji}</Text>
        <Text
          style={[
            streakStyles.streakText,
            { color: tier.text[mode] },
          ]}
        >
          {currentStreak} Day{currentStreak === 1 ? '' : 's'}
          {tier.label ? ` · ${tier.label}` : ' Streak'}
        </Text>
      </View>

      {/* Best Streak Badge - Shows when approaching or at personal record */}
      {bestStreak > 0 && currentStreak >= bestStreak - 2 && (
        <View
          style={[
            streakStyles.bestStreakBadge,
            {
              backgroundColor:
                currentStreak >= bestStreak
                  ? tier.bg[mode]
                  : isDark ? '#37415133' : '#F5F5F4',
              borderColor:
                currentStreak >= bestStreak
                  ? tier.border[mode]
                  : isDark ? '#4B556344' : '#E5E7EB',
            },
          ]}
        >
          <Text style={streakStyles.bestStreakIcon}>
            {currentStreak >= bestStreak ? '👑' : '🏅'}
          </Text>
          <Text
            style={[
              streakStyles.bestStreakText,
              {
                color:
                  currentStreak >= bestStreak
                    ? tier.text[mode]
                    : isDark ? '#9CA3AF' : '#6B7280',
              },
            ]}
          >
            {currentStreak >= bestStreak
              ? 'New Record!'
              : `Best: ${bestStreak}`}
          </Text>
        </View>
      )}
    </View>
  );
}
