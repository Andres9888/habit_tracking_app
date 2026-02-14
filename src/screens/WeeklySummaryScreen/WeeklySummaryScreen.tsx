/**
 * WeeklySummaryScreen
 *
 * Shows a weekly overview of habit completions:
 * - Total completed (count + percentage)
 * - Best and worst day
 * - Streak changes per habit
 * - Bar chart of daily completions (Mon-Sun)
 */

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useQuery } from 'convex/react';
import {
  ArrowLeft,
  Trophy,
  TrendingDown,
  TrendingUp,
  Flame,
} from 'lucide-react-native';
import { Pressable } from 'react-native';
import { api } from '../../../convex/_generated/api';
import { useThemeColors } from '../../theme/ThemeContext';

const anim = (delay: number) => FadeInDown.delay(delay).springify().damping(18);

interface BarChartProps {
  data: Array<{ label: string; count: number }>;
  accentColor: string;
  textColor: string;
  mutedColor: string;
  surfaceColor: string;
}

function BarChart({
  data,
  accentColor,
  textColor,
  mutedColor,
  surfaceColor,
}: BarChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 140,
        paddingTop: 8,
      }}
    >
      {data.map((d) => {
        const height = Math.max((d.count / max) * 100, 4);
        return (
          <View
            key={d.label}
            style={{ alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                color: textColor,
                marginBottom: 4,
              }}
            >
              {d.count}
            </Text>
            <View
              style={{
                width: 28,
                height,
                borderRadius: 6,
                backgroundColor: d.count > 0 ? accentColor : surfaceColor,
              }}
            />
            <Text
              style={{
                fontSize: 11,
                color: mutedColor,
                marginTop: 6,
                fontWeight: '500',
              }}
            >
              {d.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  colors: {
    card: string;
    border: string;
    text: string;
    secondary: string;
  };
  delay: number;
}

function StatCard({ icon, title, value, subtitle, colors, delay }: StatCardProps) {
  return (
    <Animated.View
      entering={anim(delay)}
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        flex: 1,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        {icon}
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: colors.secondary,
            marginLeft: 6,
          }}
        >
          {title}
        </Text>
      </View>
      <Text
        style={{ fontSize: 22, fontWeight: '700', color: colors.text }}
      >
        {value}
      </Text>
      {subtitle ? (
        <Text
          style={{ fontSize: 13, color: colors.secondary, marginTop: 2 }}
        >
          {subtitle}
        </Text>
      ) : null}
    </Animated.View>
  );
}

interface WeeklySummaryScreenProps {
  onBack: () => void;
}

export default function WeeklySummaryScreen({ onBack }: WeeklySummaryScreenProps) {
  const summary = useQuery(api.analyticsWeeklySummary.getWeeklySummary);
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();

  const accentGreen = '#059669';
  const accentRed = '#dc2626';
  const cardColors = {
    card: colors.surface,
    border: colors.border,
    text: colors.text.primary,
    secondary: colors.text.secondary,
  };

  if (!summary) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: colors.text.secondary, fontSize: 17 }}>
          Loading…
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Pressable
          onPress={onBack}
          hitSlop={12}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <ArrowLeft size={18} color={colors.text.primary} />
        </Pressable>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: colors.text.primary,
            marginLeft: 12,
          }}
        >
          Weekly Summary
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top stats row */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          <StatCard
            icon={<Trophy size={16} color={accentGreen} />}
            title="Completed"
            value={`${summary.totalCompleted}`}
            subtitle={`${summary.completionPercentage}% of ${summary.totalPossible}`}
            colors={cardColors}
            delay={0}
          />
          <StatCard
            icon={<Flame size={16} color="#f59e0b" />}
            title="Best Day"
            value={summary.bestDay?.label ?? '—'}
            subtitle={
              summary.bestDay
                ? `${summary.bestDay.count} habit${summary.bestDay.count !== 1 ? 's' : ''}`
                : undefined
            }
            colors={cardColors}
            delay={60}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <StatCard
            icon={<TrendingDown size={16} color={accentRed} />}
            title="Worst Day"
            value={summary.worstDay?.label ?? '—'}
            subtitle={
              summary.worstDay
                ? `${summary.worstDay.count} habit${summary.worstDay.count !== 1 ? 's' : ''}`
                : undefined
            }
            colors={cardColors}
            delay={120}
          />
          <StatCard
            icon={<TrendingUp size={16} color={accentGreen} />}
            title="Percentage"
            value={`${summary.completionPercentage}%`}
            subtitle="completion rate"
            colors={cardColors}
            delay={180}
          />
        </View>

        {/* Bar chart section */}
        <Animated.View
          entering={anim(240)}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: '700',
              color: colors.text.primary,
              marginBottom: 4,
            }}
          >
            Daily Completions
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.text.secondary,
              marginBottom: 12,
            }}
          >
            Mon – Sun this week
          </Text>
          <BarChart
            data={summary.dailyCompletions}
            accentColor={accentGreen}
            textColor={colors.text.primary}
            mutedColor={colors.text.secondary}
            surfaceColor={isDark ? '#374151' : '#e5e7eb'}
          />
        </Animated.View>

        {/* Streak changes */}
        {summary.streakChanges.length > 0 && (
          <Animated.View
            entering={anim(300)}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 16,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: '700',
                color: colors.text.primary,
                marginBottom: 12,
              }}
            >
              Streak Changes
            </Text>
            {summary.streakChanges.map((habit, idx) => {
              const isUp = habit.change > 0;
              const isDown = habit.change < 0;
              return (
                <View
                  key={idx}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderTopWidth: idx > 0 ? 1 : 0,
                    borderTopColor: colors.border,
                  }}
                >
                  <Text style={{ fontSize: 20, marginRight: 10 }}>
                    {habit.emoji}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '600',
                        color: colors.text.primary,
                      }}
                    >
                      {habit.name}
                    </Text>
                    <Text
                      style={{ fontSize: 13, color: colors.text.secondary }}
                    >
                      {habit.currentStreak} day streak · {habit.thisWeek}/7 this
                      week
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 8,
                      backgroundColor: isUp
                        ? isDark
                          ? '#064e3b'
                          : '#d1fae5'
                        : isDown
                          ? isDark
                            ? '#7f1d1d'
                            : '#fee2e2'
                          : isDark
                            ? '#374151'
                            : '#f3f4f6',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '700',
                        color: isUp
                          ? accentGreen
                          : isDown
                            ? accentRed
                            : colors.text.secondary,
                      }}
                    >
                      {isUp ? '+' : ''}
                      {habit.change}
                    </Text>
                  </View>
                </View>
              );
            })}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
