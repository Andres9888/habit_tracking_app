/**
 * PersonalBestsCard Component
 *
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Use `ProgressSectionConsolidated` from `../ProgressSectionConsolidated` instead.
 *
 * Migration Guide:
 * - Import `ProgressSectionConsolidated` from `../ProgressSectionConsolidated`
 * - The new component combines YourProgressCard, PersonalBestsCard, and ThisMonthCard
 *   into a single unified card with improved visual hierarchy
 * - Streak records are now in a collapsible accordion (StreakRecordsAccordion)
 * - Best/worst day info is shown in horizontal InsightChips
 *
 * Old:
 *   <PersonalBestsCard streakRecords={...} currentStreak={5} bestDay={...} worstDay={...} />
 *
 * New:
 *   <ProgressSectionConsolidated tracking={...} strength={75} ... />
 *
 * Section 2: Combines Streak Records + Best/Worst Days.
 * Features:
 * - Top 3 streak medals (compact horizontal layout)
 * - Current streak highlighted with pulse animation + "NOW 🔥" badge
 * - Best day card (emerald theme)
 * - "Focus On" card for worst day (amber theme, tappable for tips)
 * - Amber/orange gradient theme
 */

import React, { useEffect } from 'react';
import { View, Text, Pressable, AccessibilityInfo } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Trophy, AlertTriangle, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import type { PersonalBestsCardProps } from './types';

// Medal configurations
const MEDALS = ['🥇', '🥈', '🥉'];
const MEDAL_COLORS = [
  { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', subtext: 'text-amber-500' },
  { bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-stone-700', subtext: 'text-stone-500' },
  { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', subtext: 'text-orange-500' },
];

export function PersonalBestsCard({
  streakRecords,
  currentStreak,
  bestDay,
  worstDay,
  onWorstDayPress,
}: PersonalBestsCardProps) {
  // Track reduce motion preference
  const [reduceMotion, setReduceMotion] = React.useState(false);

  // Pulse animation for current streak
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  useEffect(() => {
    if (reduceMotion || currentStreak === 0) return;

    // 2000ms infinite pulse glow
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [currentStreak, reduceMotion]);

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const handleWorstDayPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onWorstDayPress?.();
  };

  const top3Records = streakRecords.slice(0, 3);
  const hasRecords = top3Records.length > 0;
  // Always show best/worst cards if both exist
  const showBestWorst = bestDay !== null && worstDay !== null;

  return (
    <View
      className="overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50"
      accessible={true}
      accessibilityLabel={`Personal bests${currentStreak > 0 ? `, current streak ${currentStreak} days` : ''}`}
    >
      {/* Gradient Background */}
      <View className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-white to-orange-50/30" />
      <View className="absolute inset-0 border border-amber-500/20 rounded-2xl" />

      <View className="p-4">
        {/* Header */}
        <View className="mb-3 flex-row items-center gap-2">
          <View className="h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
            <Trophy className="text-amber-500" size={16} />
          </View>
          <Text className="text-base font-semibold text-stone-800">Personal Bests</Text>
        </View>

        {/* Medal row (top 3 streaks) - matches mockup layout */}
        {hasRecords && (
          <View className="mb-4 flex-row gap-2">
            {top3Records.map((record, i) => {
              const colors = MEDAL_COLORS[i];
              const isCurrentRecord = record.isCurrent || (currentStreak > 0 && record.days === currentStreak);

              return (
                <Animated.View
                  key={`${record.startDate}-${record.days}`}
                  className={`flex-1 items-center rounded-xl border p-2.5 ${colors.bg} ${colors.border}`}
                  style={isCurrentRecord ? pulseAnimatedStyle : undefined}
                  accessibilityLabel={`${i === 0 ? 'First' : i === 1 ? 'Second' : 'Third'} best streak: ${record.days} days${isCurrentRecord ? ', current streak' : ''}`}
                >
                  <Text className="mb-0.5 text-base">{MEDALS[i]}</Text>
                  <Text className={`text-lg font-bold ${colors.text}`}>{record.days}</Text>
                  <Text className={`text-[9px] ${colors.subtext}`}>days</Text>
                  {isCurrentRecord && (
                    <View className="mt-1 rounded-full bg-orange-100 px-1.5 py-0.5">
                      <Text className="text-[8px] font-semibold text-orange-700">NOW 🔥</Text>
                    </View>
                  )}
                </Animated.View>
              );
            })}
            {/* Fill empty slots if less than 3 records */}
            {top3Records.length < 3 &&
              Array.from({ length: 3 - top3Records.length }).map((_, i) => (
                <View
                  key={`empty-${i}`}
                  className="flex-1 items-center rounded-xl border border-stone-100 bg-stone-50/50 p-2.5"
                >
                  <Text className="mb-0.5 text-base opacity-30">
                    {MEDALS[top3Records.length + i]}
                  </Text>
                  <Text className="text-lg font-bold text-stone-300">-</Text>
                  <Text className="text-[9px] text-stone-300">days</Text>
                </View>
              ))}
          </View>
        )}

        {/* Best/Worst day cards */}
        {showBestWorst && (
          <View className="flex-row gap-2">
            {/* Best Day */}
            <View
              className="flex-1 rounded-xl border border-emerald-100 bg-emerald-50 p-3"
              accessibilityLabel={`Best day: ${bestDay.day} with ${bestDay.rate}% success rate`}
            >
              <View className="flex-row items-center gap-1.5 mb-1">
                <Trophy className="text-emerald-500" size={14} />
                <Text className="text-xs font-medium text-emerald-600">Best Day</Text>
              </View>
              <Text className="text-lg font-bold text-emerald-700">{bestDay.day}</Text>
              <Text className="text-xs text-emerald-600">{bestDay.rate}% success</Text>
            </View>

            {/* Worst Day (tappable) */}
            <Pressable
              className="flex-1 rounded-xl border border-amber-100 bg-amber-50 p-3 active:bg-amber-100"
              onPress={handleWorstDayPress}
              accessibilityLabel={`Focus on ${worstDay.day} with ${worstDay.rate}% success rate. Tap for tips.`}
              accessibilityRole="button"
              accessibilityHint="Opens tips to improve this day"
            >
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center gap-1.5">
                  <AlertTriangle className="text-amber-500" size={14} />
                  <Text className="text-xs font-medium text-amber-600">Focus On</Text>
                </View>
                <ChevronRight className="text-amber-400" size={14} />
              </View>
              <Text className="text-lg font-bold text-amber-700">{worstDay.day}</Text>
              <Text className="text-xs text-amber-600">
                {worstDay.rate}% • tap for tips
              </Text>
            </Pressable>
          </View>
        )}

        {/* Empty state */}
        {!hasRecords && currentStreak === 0 && (
          <View className="items-center py-4">
            <Text className="text-sm text-stone-400">
              Complete 2+ consecutive days to start tracking streaks
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default PersonalBestsCard;
