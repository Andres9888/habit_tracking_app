/**
 * DifficultyBadge - Shows difficulty level on habit card
 *
 * Compact colored badge displayed next to the habit name.
 */

import React, { memo } from 'react';
import { Text, View } from 'react-native';

type Difficulty = 'easy' | 'medium' | 'hard' | 'epic';

const BADGE_CONFIG: Record<Difficulty, { label: string; bg: string; text: string }> = {
  easy: { label: 'Easy', bg: '#dcfce7', text: '#15803d' },
  medium: { label: 'Med', bg: '#fef9c3', text: '#a16207' },
  hard: { label: 'Hard', bg: '#ffedd5', text: '#c2410c' },
  epic: { label: 'Epic', bg: '#fee2e2', text: '#dc2626' },
};

const BADGE_CONFIG_DARK: Record<Difficulty, { bg: string; text: string }> = {
  easy: { bg: '#14532d', text: '#4ade80' },
  medium: { bg: '#713f12', text: '#facc15' },
  hard: { bg: '#7c2d12', text: '#fb923c' },
  epic: { bg: '#7f1d1d', text: '#f87171' },
};

interface DifficultyBadgeProps {
  difficulty?: string;
  isDark?: boolean;
}

function DifficultyBadgeComponent({ difficulty, isDark = false }: DifficultyBadgeProps) {
  if (!difficulty || difficulty === 'medium') return null; // Don't show badge for default/medium

  const key = (difficulty as Difficulty) in BADGE_CONFIG ? (difficulty as Difficulty) : 'medium';
  const config = BADGE_CONFIG[key];
  const darkOverride = isDark ? BADGE_CONFIG_DARK[key] : null;

  return (
    <View
      style={{
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        backgroundColor: darkOverride?.bg ?? config.bg,
        marginLeft: 6,
        alignSelf: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 10,
          fontWeight: '700',
          color: darkOverride?.text ?? config.text,
          letterSpacing: 0.5,
        }}
      >
        {config.label.toUpperCase()}
      </Text>
    </View>
  );
}

export const DifficultyBadge = memo(DifficultyBadgeComponent);
