/**
 * TodaysFocusCard Component
 *
 * Provides immediate, contextual motivation at the top of Progress tab.
 * Displays different states based on user's current progress and streak.
 *
 * Features:
 * - 7 distinct states (Thriving, Building, Starting, Struggling, Recovering, Completed, Celebrating)
 * - Gradient backgrounds per state using LinearGradient
 * - Shimmer animation on gradient background
 * - Scale spring entrance animation (0.95 → 1)
 * - Goal number counts up on first view
 * - Confetti burst animation on milestone celebration
 * - Full accessibility support
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { Springs } from '../../constants/motion';

import type {
  TodaysFocusCardProps,
  FocusState,
  FocusStateConfig,
} from './TodaysFocusCardTypes';

import {
  getCelebrationMilestone,
  getNextCelebrationMilestone,
} from './TodaysFocusCardTypes';

// Re-export types

/** Animation timing constants */
const ENTRANCE_DURATION = 300;
const SHIMMER_DURATION = 2500;
const NUMBER_COUNT_DURATION = 800;
const CONFETTI_DURATION = 700;
const CONFETTI_PARTICLE_COUNT = 16;

/**
 * Confetti colors - celebratory gold/amber theme with accent colors
 */
const CONFETTI_COLORS = [
  '#F59E0B', // Amber 500 (primary celebration)
  '#FBBF24', // Amber 400
  '#FCD34D', // Amber 300
  '#D97706', // Amber 600
  '#10B981', // Emerald 500 (success accent)
  '#34D399', // Emerald 400
];

/**
 * Focus state configurations
 * Each state has specific gradient colors, icon, and messaging
 */
const FOCUS_STATE_CONFIGS: Record<FocusState, FocusStateConfig> = {
  building: {
    getGoalLabel: () => '7 days',
    getMessage: (streak: number) => `${streak} days strong - keep going!`,

    gradientColors: ['#14b8a6', '#06b6d4'],
    // teal-500 → cyan-500
    icon: 'trending-up-outline',
    iconColor: '#ffffff',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#ffffff',
  },
  celebrating: {
    getGoalLabel: () => 'next',
    getMessage: (milestone: number) => `🎉 You hit ${milestone} days!`,

    gradientColors: ['#F59E0B', '#D97706'],
    // amber-500 → amber-600 (gold gradient)
    icon: 'trophy-outline',
    iconColor: '#ffffff',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#ffffff',
  },
  completed: {
    getGoalLabel: () => '🔥',
    getMessage: (streak: number) => `${streak} day streak and counting!`,

    gradientColors: ['#22c55e', '#10b981'],
    // green-500 → emerald-500
    icon: 'checkmark-circle-outline',
    iconColor: '#ffffff',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#ffffff',
  },
  recovering: {
    getGoalLabel: () => 'best streak',
    getMessage: (bestStreak: number) =>
      `You've done ${bestStreak} before. Do it again!`,

    gradientColors: ['#8b5cf6', '#a855f7'],
    // violet-500 → purple-500
    icon: 'refresh-outline',
    iconColor: '#ffffff',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#ffffff',
  },
  starting: {
    getGoalLabel: () => '3 days',
    getMessage: () => '3 days unlocks momentum!',

    gradientColors: ['#3b82f6', '#6366f1'],
    // blue-500 → indigo-500
    icon: 'sparkles-outline',
    iconColor: '#ffffff',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#ffffff',
  },
  struggling: {
    getGoalLabel: () => '1 day',
    getMessage: () => 'Every day is a fresh start!',

    gradientColors: ['#f59e0b', '#f97316'],
    // amber-500 → orange-500
    icon: 'heart-outline',
    iconColor: '#ffffff',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#ffffff',
  },
  thriving: {
    getGoalLabel: () => 'next milestone',
    getMessage: (goal: number) => `Complete today to hit ${goal} days!`,

    gradientColors: ['#10b981', '#14b8a6'],

    // emerald-500 → teal-500
    icon: 'locate-outline',
    // target equivalent
    iconColor: '#ffffff',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#ffffff',
  },
};

/**
 * Determines the focus state based on user metrics
 */
function determineFocusState(
  props: TodaysFocusCardProps,
  celebratedMilestones: number[] = []
): FocusState {
  const {
    currentStreak,
    isCompletedToday,
    weeklyCompletion,
    habitAge,
    bestStreak,
  } = props;

  // Check for celebration state first (highest priority when on a milestone)
  // Only show celebration if completed today and on a milestone that hasn't been celebrated
  const milestoneConfig = getCelebrationMilestone(currentStreak);
  if (
    isCompletedToday &&
    milestoneConfig &&
    !celebratedMilestones.includes(currentStreak)
  ) {
    return 'celebrating';
  }

  // Completed state takes priority (after celebration)
  if (isCompletedToday) {
    return 'completed';
  }

  // New habit (less than 7 days old)
  if (habitAge < 7) {
    return 'starting';
  }

  // Recovering: had a good streak before, currently at 0
  if (currentStreak === 0 && bestStreak > 7) {
    return 'recovering';
  }

  // Struggling: no streak and poor weekly performance
  if (currentStreak === 0 && weeklyCompletion < 3) {
    return 'struggling';
  }

  // Thriving: strong streak and good weekly performance
  if (currentStreak >= 7 && weeklyCompletion >= 5) {
    return 'thriving';
  }

  // Building: moderate streak
  if (currentStreak >= 3) {
    return 'building';
  }

  // Default to starting if none of the above
  return 'starting';
}

/**
 * Calculates the goal value to display based on state
 */
function calculateGoalValue(
  state: FocusState,
  props: TodaysFocusCardProps
): number {
  const { currentStreak, bestStreak } = props;

  switch (state) {
    case 'thriving': {
      // Next milestone: find next milestone after current streak
      const milestones = [7, 14, 21, 30, 60, 90, 100, 365];
      return milestones.find((m) => m > currentStreak) ?? currentStreak + 1;
    }
    case 'celebrating': {
      // Show the next milestone after celebration
      const nextMilestone = getNextCelebrationMilestone(currentStreak);
      return nextMilestone?.days ?? currentStreak + 1;
    }
    case 'building': {
      return 7;
    }
    case 'starting': {
      return 3;
    }
    case 'struggling': {
      return 1;
    }
    case 'recovering': {
      return bestStreak;
    }
    case 'completed': {
      return currentStreak;
    }
    default: {
      return 1;
    }
  }
}

/**
 * ConfettiParticle Component
 * A single confetti particle with its own animated values
 */
interface ConfettiParticleProps {
  angle: number;
  color: string;
  delay: number;
  distance: number;
  isActive: boolean;
  size: number;
}

const ConfettiParticle = React.memo(function ConfettiParticle({
  angle,
  color,
  delay,
  distance,
  isActive,
  size,
}: ConfettiParticleProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      // Round to avoid "Loss of precision during arithmetic conversion" error
      const targetX = Math.round(Math.cos(angle) * distance);
      const targetY = Math.round(Math.sin(angle) * distance) - 30; // Bias upward

      // Reset to center
      translateX.value = 0;
      translateY.value = 0;
      scale.value = 0;
      opacity.value = 0;

      // Animate outward with spring physics
      translateX.value = withDelay(
        delay,
        withSpring(targetX, { damping: 12, mass: 1, stiffness: 200 })
      );
      translateY.value = withDelay(
        delay,
        withSpring(targetY, { damping: 12, mass: 1, stiffness: 200 })
      );
      scale.value = withDelay(
        delay,
        withSequence(
          withSpring(1.3, { damping: 8, stiffness: 300 }),
          withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) })
        )
      );
      opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 50 }),
          withDelay(
            250,
            withTiming(0, { duration: 350, easing: Easing.out(Easing.ease) })
          )
        )
      );
    }
  }, [
    isActive,
    angle,
    delay,
    distance,
    opacity,
    scale,
    translateX,
    translateY,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.confettiParticle,
        {
          backgroundColor: color,
          borderRadius: size / 2,
          height: size,
          width: size,
        },
        animatedStyle,
      ]}
    />
  );
});

/**
 * ConfettiBurst Component
 * Renders a burst of confetti particles emanating from a central point
 */
function ConfettiBurst({ isActive }: { isActive: boolean }) {
  // Create particle configurations (stable across renders)
  // Round all values to avoid "Loss of precision during arithmetic conversion" error in Reanimated
  const particles = useMemo(
    () =>
      Array.from({ length: CONFETTI_PARTICLE_COUNT }, (_, i) => ({
        angle:
          (i / CONFETTI_PARTICLE_COUNT) * Math.PI * 2 +
          (Math.random() * 0.3 - 0.15),
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: i * 20, // Stagger particles slightly
        distance: Math.round(50 + Math.random() * 40),
        id: i,
        size: Math.round(5 + Math.random() * 5),
      })),
    []
  );

  if (!isActive) return null;

  return (
    <View pointerEvents='none' style={styles.confettiContainer}>
      {particles.map((particle) => (
        <ConfettiParticle
          key={particle.id}
          angle={particle.angle}
          color={particle.color}
          delay={particle.delay}
          distance={particle.distance}
          isActive={isActive}
          size={particle.size}
        />
      ))}
    </View>
  );
}

/**
 * TodaysFocusCard Component
 *
 * Displays contextual motivation based on user's current progress.
 * Memoized to prevent re-renders when parent updates unrelated props.
 */
export const TodaysFocusCard = React.memo(function TodaysFocusCard(
  props: TodaysFocusCardProps
) {
  const {
    currentStreak,
    isCompletedToday,
    weeklyCompletion,
    habitAge,
    bestStreak,
    celebratedMilestones = [],
    onMilestoneCelebrated,
    onShare,
  } = props;
  const reduceMotion = useReduceMotion();
  const [showConfetti, setShowConfetti] = useState(false);

  // Determine current state
  const focusState = useMemo(
    () => determineFocusState(props, celebratedMilestones),
    [
      currentStreak,
      isCompletedToday,
      weeklyCompletion,
      habitAge,
      bestStreak,
      celebratedMilestones,
    ]
  );

  // Get celebration milestone config if celebrating
  const celebrationConfig = useMemo(
    () =>
      focusState === 'celebrating'
        ? getCelebrationMilestone(currentStreak)
        : null,
    [focusState, currentStreak]
  );

  // Get configuration for current state
  const config = FOCUS_STATE_CONFIGS[focusState];

  // Calculate goal value
  const goalValue = useMemo(
    () => calculateGoalValue(focusState, props),
    [focusState, currentStreak, bestStreak]
  );

  // Animation shared values
  const scale = useSharedValue(reduceMotion ? 1 : 0.95);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const shimmerPosition = useSharedValue(0);
  const badgeScale = useSharedValue(0);
  const shareButtonOpacity = useSharedValue(0);

  // Trigger confetti and haptics for celebration state
  useEffect(() => {
    if (focusState === 'celebrating' && !reduceMotion) {
      // Trigger haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      // Show confetti
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), CONFETTI_DURATION);

      // Animate badge bounce
      badgeScale.value = withSequence(
        withSpring(1.4, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      );

      // Fade in share button
      shareButtonOpacity.value = withDelay(
        400,
        withTiming(1, { duration: 300 })
      );

      return () => clearTimeout(timer);
    } else if (focusState === 'celebrating' && reduceMotion) {
      // Even with reduce motion, trigger light haptic
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      badgeScale.value = 1;
      shareButtonOpacity.value = 1;
    }
  }, [focusState, reduceMotion, badgeScale, shareButtonOpacity]);

  // Entrance animation
  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1;
      opacity.value = 1;
      return;
    }

    // Scale spring entrance
    scale.value = withSpring(1, {
      ...Springs.gentle,
      damping: 20,
      stiffness: 200,
    });

    // Opacity fade in
    opacity.value = withTiming(1, {
      duration: ENTRANCE_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [reduceMotion, scale, opacity]);

  // Shimmer animation (continuous)
  useEffect(() => {
    if (reduceMotion) return;

    shimmerPosition.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: SHIMMER_DURATION,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, { duration: 0 })
      ),
      -1, // Infinite repeat
      false // No reverse
    );
  }, [reduceMotion, shimmerPosition]);

  // Container animated style
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Shimmer overlay animated style
  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmerPosition.value, [0, 0.5, 1], [0, 0.3, 0]),
    transform: [
      {
        translateX: interpolate(shimmerPosition.value, [0, 1], [-200, 400]),
      },
    ],
  }));

  // Badge animated style for celebration
  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  // Share button animated style
  const shareButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: shareButtonOpacity.value,
  }));

  // Handle celebration acknowledgment
  const handleCelebrationAcknowledge = useCallback(() => {
    if (focusState === 'celebrating' && onMilestoneCelebrated) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onMilestoneCelebrated(currentStreak);
    }
  }, [focusState, currentStreak, onMilestoneCelebrated]);

  // Handle share button press
  const handleSharePress = useCallback(() => {
    if (onShare) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onShare();
    }
  }, [onShare]);

  // Get message based on state
  const message = useMemo(() => {
    switch (focusState) {
      case 'thriving': {
        return config.getMessage(goalValue);
      }
      case 'building': {
        return config.getMessage(currentStreak);
      }
      case 'recovering': {
        return config.getMessage(bestStreak);
      }
      case 'completed': {
        return config.getMessage(currentStreak);
      }
      case 'celebrating': {
        return config.getMessage(currentStreak);
      }
      default: {
        return config.getMessage(0);
      }
    }
  }, [focusState, config, goalValue, currentStreak, bestStreak]);

  const goalLabel = config.getGoalLabel();

  // Get subtext for celebration
  const celebrationSubtext = useMemo(() => {
    if (focusState === 'celebrating' && celebrationConfig) {
      return celebrationConfig.subtext;
    }
    return null;
  }, [focusState, celebrationConfig]);

  // Get next milestone label for celebration
  const nextMilestoneLabel = useMemo(() => {
    if (focusState === 'celebrating') {
      const nextMilestone = getNextCelebrationMilestone(currentStreak);
      if (nextMilestone) {
        return `Next: ${nextMilestone.days} days ${nextMilestone.badge}`;
      }
    }
    return null;
  }, [focusState, currentStreak]);

  // Accessibility
  const accessibilityLabel =
    focusState === 'celebrating'
      ? `Milestone celebration: ${message}. ${celebrationSubtext ?? ''}. Next goal: ${goalValue} days`
      : `Today's focus: ${message}. Goal: ${goalValue} ${goalLabel}`;

  return (
    <Animated.View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='text'
      style={[styles.container, containerAnimatedStyle]}
    >
      {/* Confetti animation for celebration */}
      <ConfettiBurst isActive={showConfetti} />

      <LinearGradient
        colors={config.gradientColors}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.gradient}
      >
        {/* Shimmer overlay */}
        {!reduceMotion && (
          <Animated.View style={[styles.shimmerOverlay, shimmerAnimatedStyle]}>
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
              end={{ x: 1, y: 0.5 }}
              start={{ x: 0, y: 0.5 }}
              style={styles.shimmerGradient}
            />
          </Animated.View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Icon or Badge */}
          {focusState === 'celebrating' && celebrationConfig ? (
            <Animated.View
              accessibilityLabel={`${celebrationConfig.name} badge`}
              style={[styles.badgeContainer, badgeAnimatedStyle]}
            >
              <Text style={styles.badgeEmoji}>{celebrationConfig.badge}</Text>
            </Animated.View>
          ) : (
            <View
              accessibilityElementsHidden
              importantForAccessibility='no-hide-descendants'
              style={styles.iconContainer}
            >
              <Ionicons
                color={config.iconColor}
                name={config.icon as any}
                size={28}
              />
            </View>
          )}

          {/* Text content */}
          <View style={styles.textContainer}>
            <Text style={[styles.message, { color: config.textColor }]}>
              {message}
            </Text>

            {/* Celebration subtext or goal row */}
            {focusState === 'celebrating' && celebrationSubtext ? (
              <View style={styles.celebrationContent}>
                <Text
                  style={[
                    styles.celebrationSubtext,
                    { color: config.subTextColor },
                  ]}
                >
                  {celebrationSubtext}
                </Text>
                {nextMilestoneLabel && (
                  <Text
                    style={[
                      styles.nextMilestone,
                      { color: config.subTextColor },
                    ]}
                  >
                    {nextMilestoneLabel}
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.goalRow}>
                <Text
                  style={[styles.goalLabel, { color: config.subTextColor }]}
                >
                  Goal:
                </Text>
                <AnimatedGoalNumber
                  color={config.textColor}
                  reduceMotion={reduceMotion}
                  targetValue={goalValue}
                />
                <Text
                  style={[styles.goalLabel, { color: config.subTextColor }]}
                >
                  {goalLabel}
                </Text>
              </View>
            )}
          </View>

          {/* Share button for celebration (optional) */}
          {focusState === 'celebrating' && onShare && (
            <Animated.View style={shareButtonAnimatedStyle}>
              <Pressable
                accessibilityHint='Share your milestone achievement'
                accessibilityLabel='Share'
                accessibilityRole='button'
                hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
                style={styles.shareButton}
                onPress={handleSharePress}
              >
                <Ionicons
                  color={config.iconColor}
                  name='share-outline'
                  size={20}
                />
              </Pressable>
            </Animated.View>
          )}
        </View>

        {/* Dismiss button for celebration */}
        {focusState === 'celebrating' && onMilestoneCelebrated && (
          <Pressable
            accessibilityHint='Dismiss celebration and continue'
            accessibilityLabel='Continue'
            accessibilityRole='button'
            style={styles.dismissButton}
            onPress={handleCelebrationAcknowledge}
          >
            <Text style={[styles.dismissText, { color: config.subTextColor }]}>
              Tap to continue
            </Text>
          </Pressable>
        )}
      </LinearGradient>
    </Animated.View>
  );
});

/**
 * AnimatedGoalNumber - Displays the animated goal number
 */
interface AnimatedGoalNumberProps {
  targetValue: number;
  color: string;
  reduceMotion: boolean;
}

const AnimatedGoalNumber = React.memo(function AnimatedGoalNumber({
  targetValue,
  color,
  reduceMotion,
}: AnimatedGoalNumberProps) {
  return (
    <Text style={[styles.goalValue, { color }]}>
      <GoalValueDisplay reduceMotion={reduceMotion} targetValue={targetValue} />
    </Text>
  );
});

/**
 * GoalValueDisplay - Displays the goal value with optional counting animation
 */
interface GoalValueDisplayProps {
  targetValue: number;
  reduceMotion: boolean;
}

const GoalValueDisplay = React.memo(function GoalValueDisplay({
  targetValue,
  reduceMotion,
}: GoalValueDisplayProps) {
  // For true animated counting, this would use Reanimated's derived values
  // For now, we'll use a timer-based approach for the count-up animation
  const [displayValue, setDisplayValue] = React.useState(
    reduceMotion ? targetValue : 0
  );

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(targetValue);
      return;
    }

    // Animate the count up using a timer-based approach
    const startValue = 0;
    const endValue = targetValue;
    const duration = NUMBER_COUNT_DURATION;
    const steps = 20;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const currentValue = Math.round(
        startValue + (endValue - startValue) * easeProgress
      );
      setDisplayValue(currentValue);

      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayValue(endValue);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [targetValue, reduceMotion]);

  return <>{displayValue}</>;
});

const styles = StyleSheet.create({
  // Celebration styles
  badgeContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },

  badgeEmoji: {
    fontSize: 32,
    textAlign: 'center',
  },

  celebrationContent: {
    gap: 2,
  },

  celebrationSubtext: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Confetti styles
  confettiContainer: {
    height: 0,
    left: '50%',
    pointerEvents: 'none',
    position: 'absolute',
    top: '50%',
    width: 0,
    zIndex: 100,
  },

  confettiParticle: {
    elevation: 2,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },

  container: {
    borderRadius: 16,
    elevation: 3,
    marginBottom: 12,

    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    zIndex: 2,
  },

  dismissButton: {
    alignItems: 'center',
    paddingBottom: 12,
    paddingTop: 4,
  },

  dismissText: {
    fontSize: 12,
    fontWeight: '500',
  },

  goalLabel: {
    fontSize: 13,
    fontWeight: '500',
  },

  goalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },

  goalValue: {
    fontSize: 16,
    fontWeight: '700',
  },

  gradient: {
    overflow: 'hidden',
    position: 'relative',
  },

  iconContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },

  message: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },

  nextMilestone: {
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.85,
  },

  shareButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },

  shimmerGradient: {
    height: '100%',
    width: 200,
  },

  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  textContainer: {
    flex: 1,
  },
});

export default TodaysFocusCard;

export {
  type TodaysFocusCardProps,
  type FocusState,
  type FocusStateConfig,
  type MilestoneCelebrationConfig,
  CELEBRATION_MILESTONES,
  getCelebrationMilestone,
  getNextCelebrationMilestone,
} from './TodaysFocusCardTypes';
