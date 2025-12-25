/**
 * MilestoneProgress Component
 *
 * Gamification component showing progress toward next meaningful milestone.
 * Provides visual feedback on streak progress with milestone badges.
 *
 * Features:
 * - Progress bar showing current streak vs next milestone
 * - Badge icon at end of progress bar
 * - "X days away" countdown
 * - No-streak state with encouraging CTA
 * - Celebration state when milestone is hit
 * - Full accessibility support
 * - Respects reduce motion preference
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { Springs } from '../../constants/motion';

import type { MilestoneProgressProps } from './MilestoneProgressTypes';
import {
  calculateMilestoneProgress,
  MILESTONES,
} from './MilestoneProgressTypes';

/** Animation timing constants */
const ENTRANCE_DURATION = 300;
const PROGRESS_BAR_DURATION = 800;
const PULSE_DURATION = 2000;
const CELEBRATION_DURATION = 3000;

/**
 * MilestoneProgress - Shows progress toward next streak milestone
 * Memoized to prevent unnecessary re-renders
 */
export const MilestoneProgress = React.memo(function MilestoneProgress({
  currentStreak,
  onMilestoneHit,
  celebratedMilestones = [],
}: MilestoneProgressProps) {
  const reduceMotion = useReduceMotion();

  // Calculate milestone progress
  const milestoneData = useMemo(
    () => calculateMilestoneProgress(currentStreak, celebratedMilestones),
    [currentStreak, celebratedMilestones]
  );

  const {
    nextMilestone,
    daysRemaining,
    progressPercentage,
    displayState,
    previousMilestone,
  } = milestoneData;

  // Animation shared values
  const containerScale = useSharedValue(reduceMotion ? 1 : 0.95);
  const containerOpacity = useSharedValue(reduceMotion ? 1 : 0);
  const progressWidth = useSharedValue(reduceMotion ? progressPercentage : 0);
  const badgePulse = useSharedValue(1);
  const celebrationScale = useSharedValue(1);

  // Entrance animation
  useEffect(() => {
    if (reduceMotion) {
      containerScale.value = 1;
      containerOpacity.value = 1;
      progressWidth.value = progressPercentage;
      return;
    }

    // Scale spring entrance
    containerScale.value = withSpring(1, Springs.gentle);

    // Opacity fade in
    containerOpacity.value = withTiming(1, {
      duration: ENTRANCE_DURATION,
      easing: Easing.out(Easing.cubic),
    });

    // Animate progress bar width
    progressWidth.value = withTiming(progressPercentage, {
      duration: PROGRESS_BAR_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [
    reduceMotion,
    progressPercentage,
    containerScale,
    containerOpacity,
    progressWidth,
  ]);

  // Badge pulse animation (when close to milestone)
  useEffect(() => {
    if (reduceMotion || daysRemaining > 3) {
      badgePulse.value = 1;
      return;
    }

    // Gentle pulse when within 3 days of milestone
    badgePulse.value = withRepeat(
      withSequence(
        withTiming(1.1, {
          duration: PULSE_DURATION / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: PULSE_DURATION / 2,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1, // Infinite
      true // Reverse
    );
  }, [reduceMotion, daysRemaining, badgePulse]);

  // Celebration animation
  useEffect(() => {
    if (displayState !== 'just-hit' || reduceMotion) {
      celebrationScale.value = 1;
      return;
    }

    // Bouncy celebration animation
    celebrationScale.value = withSequence(
      withSpring(1.2, Springs.bouncy),
      withTiming(1, { duration: 500 })
    );

    // Call callback if provided - check if current streak matches any milestone
    if (onMilestoneHit) {
      const justHitMilestone = MILESTONES.find((m) => m.days === currentStreak);
      if (justHitMilestone) {
        onMilestoneHit(justHitMilestone.days);
      }
    }
  }, [
    displayState,
    reduceMotion,
    celebrationScale,
    onMilestoneHit,
    currentStreak,
  ]);

  // Container animated style
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  // Progress bar animated style
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  // Badge animated style
  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgePulse.value }],
  }));

  // Celebration animated style
  const celebrationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
  }));

  // Build accessibility label
  const accessibilityLabel = useMemo(() => {
    if (displayState === 'no-streak') {
      return 'No active streak. Start your streak today to reach the Habit Starter milestone at 3 days.';
    }

    if (displayState === 'just-hit') {
      const milestone = MILESTONES.find((m) => m.days === currentStreak);
      return `Congratulations! You hit ${currentStreak} days and earned the ${milestone?.name ?? 'milestone'} badge!`;
    }

    if (nextMilestone) {
      return `Next milestone: ${nextMilestone.days} days, ${nextMilestone.name}. ${daysRemaining} days away. Progress: ${progressPercentage} percent.`;
    }

    return `Congratulations! You've achieved all milestones with ${currentStreak} days streak!`;
  }, [
    displayState,
    currentStreak,
    nextMilestone,
    daysRemaining,
    progressPercentage,
  ]);

  // Render no-streak state
  if (displayState === 'no-streak') {
    return (
      <Animated.View
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='text'
        style={[styles.container, containerAnimatedStyle]}
        testID='milestone-progress'
      >
        <View style={styles.noStreakContainer}>
          <Ionicons
            color='#9ca3af'
            name='arrow-forward-circle-outline'
            size={24}
            style={styles.noStreakIcon}
          />
          <View style={styles.noStreakTextContainer}>
            <Text style={styles.noStreakTitle}>Start your streak today!</Text>
            <Text style={styles.noStreakSubtext}>
              3 days to unlock {MILESTONES[0].badge} {MILESTONES[0].name}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  // Render celebration state
  if (displayState === 'just-hit') {
    const hitMilestone = MILESTONES.find((m) => m.days === currentStreak);
    const nextAfterHit = nextMilestone;

    return (
      <Animated.View
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='text'
        style={[
          styles.container,
          styles.celebrationContainer,
          containerAnimatedStyle,
        ]}
        testID='milestone-progress'
      >
        <Animated.View
          style={[styles.celebrationContent, celebrationAnimatedStyle]}
        >
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.celebrationTitle}>
            You hit {currentStreak} days! {hitMilestone?.badge}
          </Text>
          <Text style={styles.celebrationSubtext}>
            {hitMilestone?.name ?? 'Milestone achieved'}
          </Text>
          {nextAfterHit && (
            <Text style={styles.nextMilestoneText}>
              Next: {nextAfterHit.days} days {nextAfterHit.badge}
            </Text>
          )}
        </Animated.View>
      </Animated.View>
    );
  }

  // Render in-progress state
  return (
    <Animated.View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='progressbar'
      accessibilityValue={{
        max: 100,
        min: 0,
        now: progressPercentage,
      }}
      style={[styles.container, containerAnimatedStyle]}
      testID='milestone-progress'
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>
            Next Milestone: {nextMilestone?.days} Days
          </Text>
          <Animated.Text style={[styles.badgeIcon, badgeAnimatedStyle]}>
            {nextMilestone?.badge}
          </Animated.Text>
        </View>
        <Text style={styles.daysAway}>
          {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} away
        </Text>
      </View>

      {/* Milestone name */}
      <Text style={styles.milestoneName}>{nextMilestone?.name}</Text>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        {/* Background track */}
        <View style={styles.progressBarTrack}>
          {/* Filled progress */}
          <Animated.View
            style={[styles.progressBarFill, progressAnimatedStyle]}
          />
        </View>

        {/* Badge at end */}
        <Animated.View style={[styles.progressBadge, badgeAnimatedStyle]}>
          <Text style={styles.progressBadgeText}>{nextMilestone?.badge}</Text>
        </Animated.View>
      </View>

      {/* Progress label */}
      <View style={styles.progressLabel}>
        <Text style={styles.progressLabelText}>
          {previousMilestone ? `${previousMilestone.days}` : '0'}
        </Text>
        <Text style={styles.progressLabelText}>{currentStreak} days</Text>
        <Text style={styles.progressLabelText}>{nextMilestone?.days}</Text>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  badgeIcon: {
    fontSize: 18,
    marginLeft: 4,
  },
  celebrationContainer: {
    alignItems: 'center',
    backgroundColor: '#fefce8', // amber-50
    borderColor: '#fbbf24', // amber-400
    borderWidth: 1,
  },
  celebrationContent: {
    alignItems: 'center',
    padding: 8,
  },
  celebrationEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  celebrationSubtext: {
    color: '#92400e', // amber-800
    fontSize: 13,
    fontWeight: '500',
  },
  celebrationTitle: {
    color: '#78350f', // amber-900
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  container: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb', // gray-200
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    padding: 12,
  },
  daysAway: {
    color: '#6b7280', // gray-500
    fontSize: 13,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTitle: {
    color: '#1f2937', // gray-800
    fontSize: 15,
    fontWeight: '600',
  },
  milestoneName: {
    color: '#9ca3af', // gray-400
    fontSize: 12,
    marginBottom: 12,
  },
  nextMilestoneText: {
    color: '#92400e', // amber-800
    fontSize: 12,
    marginTop: 8,
  },
  noStreakContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 4,
  },
  noStreakIcon: {
    marginRight: 12,
  },
  noStreakSubtext: {
    color: '#6b7280', // gray-500
    fontSize: 12,
    marginTop: 2,
  },
  noStreakTextContainer: {
    flex: 1,
  },
  noStreakTitle: {
    color: '#374151', // gray-700
    fontSize: 14,
    fontWeight: '600',
  },
  progressBadge: {
    alignItems: 'center',
    backgroundColor: '#fef3c7', // amber-100
    borderColor: '#fbbf24', // amber-400
    borderRadius: 12,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    marginLeft: 8,
    width: 24,
  },
  progressBadgeText: {
    fontSize: 12,
  },
  progressBarContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  progressBarFill: {
    backgroundColor: '#f59e0b', // amber-500
    borderRadius: 4,
    height: '100%',
  },
  progressBarTrack: {
    backgroundColor: '#e5e7eb', // gray-200
    borderRadius: 4,
    flex: 1,
    height: 8,
    overflow: 'hidden',
  },
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressLabelText: {
    color: '#9ca3af', // gray-400
    fontSize: 11,
  },
});

export default MilestoneProgress;

export type { MilestoneProgressProps } from './MilestoneProgressTypes';
