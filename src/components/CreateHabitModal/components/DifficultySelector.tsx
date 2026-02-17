/**
 * DifficultySelector - Pick habit difficulty level
 *
 * Four levels: Easy, Medium, Hard, Epic
 * Higher difficulty = more XP and strength gains per completion.
 */

import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'epic';

interface DifficultyOption {
  key: Difficulty;
  label: string;
  emoji: string;
  xpLabel: string;
  color: string;
}

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  { key: 'easy', label: 'Easy', emoji: '🟢', xpLabel: '×0.5', color: '#22c55e' },
  { key: 'medium', label: 'Medium', emoji: '🟡', xpLabel: '×1', color: '#eab308' },
  { key: 'hard', label: 'Hard', emoji: '🟠', xpLabel: '×1.5', color: '#f97316' },
  { key: 'epic', label: 'Epic', emoji: '🔴', xpLabel: '×2.5', color: '#ef4444' },
];

interface DifficultySelectorProps {
  selected: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

function DifficultySelectorComponent({ selected, onSelect }: DifficultySelectorProps) {
  const { colors: themeColors, isDark } = useThemeColors();

  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          letterSpacing: 1,
          color: themeColors.text.tertiary,
          textAlign: 'center',
          marginBottom: 12,
        }}
      >
        DIFFICULTY
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {DIFFICULTY_OPTIONS.map((opt) => {
          const isSelected = selected === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              accessibilityLabel={`${opt.label} difficulty, ${opt.xpLabel} XP`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              activeOpacity={0.7}
              onPress={() => onSelect(opt.key)}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 4,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: isSelected ? opt.color : isDark ? themeColors.border : '#e5e5e5',
                backgroundColor: isSelected
                  ? isDark
                    ? `${opt.color}20`
                    : `${opt.color}15`
                  : isDark
                    ? themeColors.card
                    : '#FFFFFF',
              }}
            >
              <Text style={{ fontSize: 18, marginBottom: 2 }}>{opt.emoji}</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: isSelected ? opt.color : themeColors.text.secondary,
                }}
              >
                {opt.label}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '500',
                  color: isSelected ? opt.color : themeColors.text.tertiary,
                  marginTop: 1,
                }}
              >
                {opt.xpLabel} XP
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export const DifficultySelector = memo(DifficultySelectorComponent);
