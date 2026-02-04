/**
 * InlineMilestonesStrip Component
 * Horizontal milestones strip showing achieved + next locked milestones
 * 
 * @see HABIT-DETAIL-AFTER-SPEC.md for design details
 */

import React, { useMemo, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface Milestone {
  days: number;
  emoji: string;
  label: string;
}

const MILESTONES: Milestone[] = [
  { days: 7, emoji: '🌱', label: '7' },
  { days: 30, emoji: '🔥', label: '30' },
  { days: 100, emoji: '💎', label: '100' },
  { days: 365, emoji: '👑', label: '365' },
];

interface InlineMilestonesStripProps {
  currentStreak: number;
  totalCompletions: number;
  reduceMotion?: boolean;
  onMilestonePress?: (milestone: Milestone) => void;
}

export function InlineMilestonesStrip({
  currentStreak,
  totalCompletions,
  reduceMotion = false,
  onMilestonePress,
}: InlineMilestonesStripProps) {
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      return;
    }

    opacity.value = withDelay(320, withTiming(1, { duration: 240, easing: Easing.out(Easing.ease) }));
  }, [reduceMotion, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Determine which milestones to show: achieved + next locked (max 4 visible)
  const visibleMilestones = useMemo(() => {
    const achieved: (Milestone & { achieved: boolean })[] = [];
    const locked: (Milestone & { achieved: boolean })[] = [];

    for (const milestone of MILESTONES) {
      // A milestone is achieved if total completions >= days OR current streak >= days
      const isAchieved = totalCompletions >= milestone.days || currentStreak >= milestone.days;
      if (isAchieved) {
        achieved.push({ ...milestone, achieved: true });
      } else {
        locked.push({ ...milestone, achieved: false });
      }
    }

    // Show all achieved + first locked, max 4 total
    const result = [...achieved];
    const remaining = 4 - result.length;
    if (remaining > 0) {
      result.push(...locked.slice(0, remaining));
    }

    return result;
  }, [currentStreak, totalCompletions]);

  const handleMilestonePress = (milestone: Milestone) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onMilestonePress?.(milestone);
  };

  return (
    <Animated.View
      style={[{
        height: 48,
        backgroundColor: '#f5f5f4',
        borderRadius: 10,
        marginTop: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }, animatedStyle]}
    >
      {visibleMilestones.map((milestone) => (
        <Pressable
          key={milestone.days}
          onPress={() => handleMilestonePress(milestone)}
          accessibilityRole="button"
          accessibilityLabel={
            milestone.achieved
              ? `${milestone.days} day milestone, achieved`
              : `${milestone.days} day milestone, ${milestone.days - Math.max(currentStreak, totalCompletions)} days remaining`
          }
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ fontSize: 16 }}>{milestone.emoji}</Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: milestone.achieved ? '#059669' : '#a8a29e',
              lineHeight: 17,
            }}
          >
            {milestone.label}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: milestone.achieved ? '#059669' : '#a8a29e',
            }}
          >
            {milestone.achieved ? '✓' : '○'}
          </Text>
        </Pressable>
      ))}
    </Animated.View>
  );
}
