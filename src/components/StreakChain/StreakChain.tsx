import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { fontFamilies } from '../../theme/typography';
import { durations } from '../../theme/animations';
import { useStreakChainLogic } from './StreakChain.hooks';
import type { StreakChainProps } from './StreakChain.types';

// Re-export types for backwards compatibility
export type { DayStatus, StreakChainProps } from './StreakChain.types';

/**
 * StreakChain renders a compact chain visualization.
 * - Left: label (e.g., "Reading Chain")
 * - Right: rounded pill with streak days
 * - Below: row of circles connected by short bars
 *
 * Now uses design system tokens for colors, typography, and spacing.
 * Supports dark mode via ThemeContext.
 */
export default function StreakChain({
  label,
  statuses,
  size = 28,
}: StreakChainProps) {
  const { circleSize, iconSize, streakDays } = useStreakChainLogic(
    statuses,
    size
  );
  const { colors, isDark } = useThemeColors();

  // Derive colors from theme
  const doneCircleBg = colors.primary[500];
  const doneCircleIcon = isDark ? colors.gray[900] : '#FFFFFF';
  const pendingCircleBg = colors.gray[200];
  const pendingCircleIcon = colors.gray[400];
  const activeConnector = colors.primary[300];
  const inactiveConnector = colors.gray[200];
  const pillBg = isDark ? colors.primary[100] : colors.primary[100];
  const pillText = colors.primary[700];

  return (
    <View style={localStyles.container}>
      {/* Header row */}
      <View style={localStyles.headerRow}>
        <Text
          style={[
            localStyles.label,
            { color: colors.text.primary },
          ]}
        >
          {label}
        </Text>
        <View
          accessibilityLabel={`${streakDays} days`}
          style={[
            localStyles.pill,
            { backgroundColor: pillBg },
          ]}
        >
          <Ionicons
            color={pillText}
            name="flame-outline"
            size={12}
            style={localStyles.pillIcon}
          />
          <Text
            style={[
              localStyles.pillText,
              { color: pillText },
            ]}
          >
            {streakDays} {streakDays === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </View>

      {/* Chain row */}
      <View style={localStyles.chainRow}>
        {statuses.map((status, idx) => {
          const isDone = status === 'done';
          const isFuture = status === 'planned';
          const connectorActive = idx < statuses.length - 1 && isDone;

          return (
            <Animated.View
              key={idx}
              entering={FadeIn.delay(idx * durations.stagger).duration(durations.enter)}
              style={localStyles.chainLink}
            >
              <View
                style={[
                  localStyles.circle,
                  {
                    backgroundColor: isDone ? doneCircleBg : pendingCircleBg,
                    borderRadius: circleSize / 2,
                    height: circleSize,
                    opacity: isFuture ? 0.45 : 1,
                    width: circleSize,
                  },
                ]}
              >
                <Ionicons
                  color={isDone ? doneCircleIcon : pendingCircleIcon}
                  name={isDone ? 'link' : 'ellipse-outline'}
                  size={iconSize}
                />
              </View>

              {idx < statuses.length - 1 && (
                <View
                  style={[
                    localStyles.connector,
                    {
                      backgroundColor: connectorActive
                        ? activeConnector
                        : inactiveConnector,
                    },
                  ]}
                />
              )}
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  chainLink: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  chainRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  connector: {
    borderRadius: borderRadius.xs,
    height: 2,
    marginHorizontal: spacing.xs + 2, // 6px
    width: 18,
  },
  container: {
    paddingBottom: spacing.md,
    paddingTop: spacing.xs,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  pill: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    paddingHorizontal: spacing.sm + 2, // 10px
    paddingVertical: spacing.xs,
  },
  pillIcon: {
    marginRight: 3,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});
