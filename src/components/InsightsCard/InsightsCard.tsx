/**
 * InsightsCard — Contextual, actionable habit insights
 *
 * Displays AI-like insights derived from tracking data patterns.
 * Shows why streaks broke, predicts future milestones, highlights
 * best/worst days, and compares current performance to personal bests.
 */

import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useThemeColors } from '../../theme';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { generateInsights } from './insightEngine';
import type { Insight } from './insightEngine';
import type { HabitTrackingEntry } from '../../features/habits/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface InsightsCardProps {
  tracking: HabitTrackingEntry[];
  habitName: string;
  currentStreak: number;
  habitCreatedAt?: number;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function InsightRow({ insight, isDark }: { insight: Insight; isDark: boolean }) {
  const bgColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)';
  const titleColor = isDark ? '#E7E5E4' : '#1C1917';
  const msgColor = isDark ? '#A8A29E' : '#57534E';

  return (
    <View
      className="mb-3 flex-row rounded-xl p-3"
      style={{ backgroundColor: bgColor }}
    >
      <Text className="mr-3 text-2xl" style={{ lineHeight: 32 }}>
        {insight.emoji}
      </Text>
      <View className="flex-1">
        <Text
          className="mb-1 text-[13px] font-bold tracking-wide"
          style={{ color: titleColor }}
        >
          {insight.title.toUpperCase()}
        </Text>
        <Text
          className="text-[14px] leading-5"
          style={{ color: msgColor }}
        >
          {insight.message}
        </Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function InsightsCard({
  tracking,
  habitName,
  currentStreak,
  habitCreatedAt,
}: InsightsCardProps) {
  const { isDark } = useThemeColors();
  const reduceMotion = useReduceMotion();

  const insights = useMemo(
    () =>
      generateInsights({
        currentStreak,
        habitCreatedAt,
        habitName,
        tracking: tracking.map((t) => ({
          completed: t.completed,
          date: t.date,
          habitId: t.habitId as string,
        })),
      }),
    [tracking, habitName, currentStreak, habitCreatedAt]
  );

  if (insights.length === 0) return null;

  const cardBg = isDark ? '#292524' : '#FFFFFF';
  const headerColor = isDark ? '#D6D3D1' : '#44403C';

  return (
    <Animated.View
      className="rounded-2xl p-4"
      entering={
        reduceMotion
          ? undefined
          : FadeInDown.delay(200).springify().damping(18)
      }
      style={{
        backgroundColor: cardBg,
        elevation: 4,
        shadowColor: isDark ? '#000' : '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 16,
      }}
    >
      <Text
        className="mb-3 text-[13px] font-semibold tracking-wider"
        style={{ color: headerColor }}
      >
        💡 INSIGHTS
      </Text>
      {insights.map((insight) => (
        <InsightRow
          key={insight.type}
          insight={insight}
          isDark={isDark}
        />
      ))}
    </Animated.View>
  );
}

export default InsightsCard;
