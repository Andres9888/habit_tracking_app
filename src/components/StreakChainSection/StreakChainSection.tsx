/**
 * StreakChainSection Component
 * Clean, focused streak visualization with animated chain
 * Theme-aware with dark mode support
 */

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../theme/ThemeContext';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

import type { StreakChainSectionProps } from './types';
import { getTierInfo } from './constants';
import { ContextualMessage } from './ContextualMessage';
import { StreakHeader } from './StreakHeader';
import { StreakNumber } from './StreakNumber';
import { ProgressBar } from './ProgressBar';
import { ChainRow } from './ChainRow';
import { BestStreakBadge } from './BestStreakBadge';
import { useStreakAnimation } from './useStreakAnimation';
import { buildChainData, getDayLabels } from './chainUtils';

export function StreakChainSection({
  bestStreak,
  currentStreak,
  lastSevenDays,
  todayCompleted,
}: StreakChainSectionProps) {
  const { current, next, daysToNext, progress } = getTierInfo(currentStreak);
  const isNewRecord = currentStreak > 0 && currentStreak >= bestStreak;
  const { colors, isDark } = useThemeColors();

  const { numberAnimatedStyle, barAnimatedStyle } = useStreakAnimation({
    currentStreak,
    progress,
  });

  const chainData = buildChainData(lastSevenDays, todayCompleted);
  const dayLabels = useMemo(getDayLabels, []);

  const gradientColors: [string, string, string] = isDark
    ? [colors.surface, colors.card, colors.surface]
    : ['rgba(255, 247, 237, 0.3)', colors.card, 'rgba(255, 251, 235, 0.3)'];

  return (
    <View
      style={[
        localStyles.wrapper,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          ...shadows.card,
        },
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={localStyles.content}>
        <StreakHeader currentIcon={current.icon} />
        <StreakNumber
          animatedStyle={numberAnimatedStyle}
          currentStreak={currentStreak}
          tierIndex={getTierIndex(currentStreak)}
        />
        {next && (
          <ProgressBar
            barAnimatedStyle={barAnimatedStyle}
            daysToNext={daysToNext}
            next={next}
          />
        )}
        <ChainRow
          chainData={chainData}
          dayLabels={dayLabels}
          todayCompleted={todayCompleted}
        />
        <ContextualMessage
          bestStreak={bestStreak}
          currentStreak={currentStreak}
          todayCompleted={todayCompleted}
        />
        <BestStreakBadge
          bestStreak={bestStreak}
          currentStreak={currentStreak}
          isNewRecord={isNewRecord}
        />
      </View>
    </View>
  );
}

/** Get tier index for color mapping */
function getTierIndex(streak: number): number {
  const tiers = [0, 3, 5, 7, 14, 21, 30, 60];
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (streak >= tiers[i]) return i;
  }
  return 0;
}

const localStyles = StyleSheet.create({
  content: {
    padding: spacing.lg - 4, // 20px
  },
  wrapper: {
    borderRadius: borderRadius.large,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});

export default StreakChainSection;
