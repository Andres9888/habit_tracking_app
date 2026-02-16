/**
 * StrengthTooltip Component
 *
 * Inline tooltip that appears below the StrengthProgressBar when pressed.
 * Explains the current tier and what comes next.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { LEVELS, getCurrentLevel, getNextLevel } from './StrengthProgressBar.constants';
import type { LevelConfig } from './StrengthProgressBar.types';

interface StrengthTooltipProps {
  strength: number;
  children: React.ReactNode;
}

const TIER_DESCRIPTIONS: Record<string, string> = {
  Starting: 'You\'re building a new habit. Every completion counts!',
  Building: 'Your habit is taking root. Keep the momentum going.',
  Developing: 'Great progress! This habit is becoming part of your routine.',
  Strong: 'This habit is well-established. You\'re in a great rhythm.',
  Automatic: 'This habit is nearly automatic — it\'s part of who you are!',
};

export function StrengthTooltip({ strength, children }: StrengthTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { colors, isDark } = useThemeColors();

  const handlePress = useCallback(() => {
    setShowTooltip((prev) => !prev);
  }, []);

  const currentLevel = getCurrentLevel(strength);
  const nextLevel = getNextLevel(strength);

  return (
    <View>
      <Pressable
        accessibilityHint="Tap to learn about habit strength levels"
        onPress={handlePress}
      >
        {children}
      </Pressable>

      {showTooltip && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={{
            backgroundColor: isDark ? colors.gray[100] : colors.gray[50],
            borderColor: colors.border,
            borderRadius: 12,
            borderWidth: 1,
            marginTop: 8,
            padding: 12,
          }}
        >
          <Text
            style={{
              color: colors.text.primary,
              fontSize: 13,
              fontWeight: '600',
              marginBottom: 6,
            }}
          >
            {currentLevel.emoji} {currentLevel.label} — {Math.round(strength)}%
          </Text>

          <Text
            style={{
              color: colors.text.secondary,
              fontSize: 12,
              lineHeight: 18,
              marginBottom: 8,
            }}
          >
            {TIER_DESCRIPTIONS[currentLevel.label] ?? ''}
          </Text>

          {nextLevel && (
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 11,
                fontStyle: 'italic',
              }}
            >
              Next: {nextLevel.emoji} {nextLevel.label} at {nextLevel.threshold}%
            </Text>
          )}

          <View
            style={{
              borderTopColor: colors.border,
              borderTopWidth: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 8,
              paddingTop: 8,
            }}
          >
            {LEVELS.map((level: LevelConfig) => (
              <Text
                key={level.label}
                style={{
                  color:
                    level.label === currentLevel.label
                      ? colors.text.primary
                      : colors.text.secondary,
                  fontSize: 11,
                  fontWeight: level.label === currentLevel.label ? '700' : '400',
                  opacity: level.label === currentLevel.label ? 1 : 0.7,
                }}
              >
                {level.emoji} {level.threshold}%
              </Text>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
}
