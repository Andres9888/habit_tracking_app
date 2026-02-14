/**
 * HabitStatsWidget — Compact stats card at the top of the main habits list.
 *
 * Shows:
 * - Today's progress (completed/total) with animated progress ring
 * - Current best streak across all habits
 * - Total completions this week
 *
 * Design system: Primary green #059669, shadows 4px/16px, border-radius 16px,
 * springify().damping(18) animations.
 */

import { memo, useEffect, useMemo } from 'react';
import { View, Text, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const FONT_FAMILY = Platform.OS === 'ios' ? 'System' : 'Roboto';

interface HabitStatsWidgetProps {
  /** Number of habits completed today */
  completedToday: number;
  /** Total number of habits */
  totalHabits: number;
  /** Function to get streak for a habit */
  getStreak: (habitId: string) => number;
  /** List of habits */
  habits: Array<{ _id: string }>;
  /** Week date strings for calculating weekly completions */
  weekDateStrings: string[];
  /** Function to get habit status */
  getHabitStatus: (habitId: string, dateString: string) => string;
  /** Reduce motion preference */
  reduceMotion?: boolean;
}

function HabitStatsWidgetComponent({
  completedToday,
  totalHabits,
  getStreak,
  habits,
  weekDateStrings,
  getHabitStatus,
  reduceMotion = false,
}: HabitStatsWidgetProps): React.ReactElement {
  // Calculate best streak across all habits
  const bestStreak = useMemo(() => {
    let maxStreak = 0;
    for (const habit of habits) {
      const streak = getStreak(habit._id);
      if (streak > maxStreak) {
        maxStreak = streak;
      }
    }
    return maxStreak;
  }, [habits, getStreak]);

  // Calculate total completions this week
  const weeklyCompletions = useMemo(() => {
    let total = 0;
    for (const dateString of weekDateStrings) {
      for (const habit of habits) {
        if (getHabitStatus(habit._id, dateString) === 'done') {
          total += 1;
        }
      }
    }
    return total;
  }, [habits, weekDateStrings, getHabitStatus]);

  const progress = useSharedValue(0);
  const size = 56;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animate progress ring
  useEffect(() => {
    const target = totalHabits > 0 ? completedToday / totalHabits : 0;
    if (!reduceMotion) {
      progress.value = withSpring(target, { damping: 18 });
    } else {
      progress.value = target;
    }
  }, [completedToday, totalHabits, reduceMotion, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const entering = reduceMotion
    ? FadeIn.duration(200)
    : FadeIn.duration(280).springify().damping(18);

  return (
    <Animated.View
      entering={entering}
      className="mx-4 mb-3 rounded-2xl border border-[#DDD8D2] bg-[#EDEAE5] p-4 shadow-sm"
      style={{
        shadowColor: '#000',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <View className="flex-row items-center justify-between">
        {/* Progress Ring */}
        <View className="relative items-center justify-center">
          <Svg height={size} style={{ position: 'absolute' }} width={size}>
            {/* Track */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              fill="none"
              r={radius}
              stroke="#E7E5E4"
              strokeWidth={strokeWidth}
            />
            {/* Progress */}
            <AnimatedCircle
              animatedProps={animatedProps}
              cx={size / 2}
              cy={size / 2}
              fill="none"
              origin={`${size / 2}, ${size / 2}`}
              r={radius}
              rotation="-90"
              stroke="#059669"
              strokeDasharray={circumference}
              strokeLinecap="round"
              strokeWidth={strokeWidth}
            />
          </Svg>
          <Text
            style={{
              color: '#047857',
              fontFamily: FONT_FAMILY,
              fontSize: 12,
              fontWeight: '700',
            }}
          >
            {completedToday}/{totalHabits}
          </Text>
        </View>

        {/* Stats */}
        <View className="flex-1 flex-row items-center justify-around px-4">
          {/* Best Streak */}
          <View className="items-center">
            <Text
              style={{
                color: '#047857',
                fontFamily: FONT_FAMILY,
                fontSize: 20,
                fontWeight: '700',
              }}
            >
              {bestStreak}
            </Text>
            <Text
              style={{
                color: '#6B6560',
                fontFamily: FONT_FAMILY,
                fontSize: 11,
                fontWeight: '500',
                marginTop: 2,
              }}
            >
              Best Streak
            </Text>
          </View>

          {/* Divider */}
          <View className="h-8 w-px bg-[#DDD8D2]" />

          {/* Weekly Completions */}
          <View className="items-center">
            <Text
              style={{
                color: '#047857',
                fontFamily: FONT_FAMILY,
                fontSize: 20,
                fontWeight: '700',
              }}
            >
              {weeklyCompletions}
            </Text>
            <Text
              style={{
                color: '#6B6560',
                fontFamily: FONT_FAMILY,
                fontSize: 11,
                fontWeight: '500',
                marginTop: 2,
              }}
            >
              This Week
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export const HabitStatsWidget = memo(HabitStatsWidgetComponent);
export default HabitStatsWidget;
