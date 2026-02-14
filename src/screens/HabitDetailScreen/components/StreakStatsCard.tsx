/**
 * StreakStatsCard - Shows current streak with trend arrow, best streak, and completion rate
 * Visually compelling stats designed to make users want to share
 */
import React, { useMemo } from 'react';
import { View, Text } from 'react-native';

interface StreakStatsCardProps {
  completedDates: Set<string>;
  currentStreak: number;
  bestStreak: number;
  habitColor?: string;
}

type TrendDirection = 'up' | 'down' | 'flat';

/** Calculate streak trend by comparing recent 7-day vs prior 7-day completion rate */
function calculateTrend(completedDates: Set<string>): TrendDirection {
  const today = new Date();
  let recent = 0;
  let prior = 0;

  for (let i = 0; i < 7; i++) {
    const recentDate = new Date(today);
    recentDate.setDate(today.getDate() - i);
    const priorDate = new Date(today);
    priorDate.setDate(today.getDate() - 7 - i);

    const rKey = formatDate(recentDate);
    const pKey = formatDate(priorDate);

    if (completedDates.has(rKey)) recent++;
    if (completedDates.has(pKey)) prior++;
  }

  if (recent > prior) return 'up';
  if (recent < prior) return 'down';
  return 'flat';
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const TREND_CONFIG = {
  up: { arrow: '↑', color: '#059669', label: 'Improving' },
  down: { arrow: '↓', color: '#dc2626', label: 'Declining' },
  flat: { arrow: '→', color: '#d97706', label: 'Steady' },
} as const;

function StatBox({
  value,
  label,
  accent,
  suffix,
}: {
  value: string | number;
  label: string;
  accent?: string;
  suffix?: React.ReactNode;
}) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '800',
            color: accent ?? '#1c1917',
            letterSpacing: -0.5,
          }}
        >
          {value}
        </Text>
        {suffix}
      </View>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          color: '#a8a29e',
          letterSpacing: 0.5,
          marginTop: 2,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export function StreakStatsCard({
  completedDates,
  currentStreak,
  bestStreak,
  habitColor = '#047857',
}: StreakStatsCardProps) {
  const trend = useMemo(() => calculateTrend(completedDates), [completedDates]);
  const trendInfo = TREND_CONFIG[trend];

  const isAtBest = currentStreak > 0 && currentStreak >= bestStreak;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8 }}>
      {/* Current Streak */}
      <StatBox
        value={currentStreak}
        label="Current"
        accent={habitColor}
        suffix={
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: trendInfo.color,
              marginLeft: 3,
            }}
          >
            {trendInfo.arrow}
          </Text>
        }
      />

      {/* Divider */}
      <View
        style={{
          width: 1,
          height: 36,
          backgroundColor: '#e7e5e4',
        }}
      />

      {/* Best Streak */}
      <StatBox
        value={bestStreak}
        label="Best"
        accent={isAtBest ? '#d97706' : '#1c1917'}
        suffix={
          isAtBest ? (
            <Text style={{ fontSize: 14, marginLeft: 2 }}>🏆</Text>
          ) : undefined
        }
      />

      {/* Divider */}
      <View
        style={{
          width: 1,
          height: 36,
          backgroundColor: '#e7e5e4',
        }}
      />

      {/* Trend */}
      <StatBox
        value={trendInfo.arrow}
        label={trendInfo.label}
        accent={trendInfo.color}
      />
    </View>
  );
}
