/**
 * TodaysFocusCard Component
 *
 * Provides immediate, contextual motivation at the top of Progress tab.
 * Displays different states based on user's current progress and streak.
 *
 * Features:
 * - 6 distinct states (Thriving, Building, Starting, Struggling, Recovering, Completed)
 * - Gradient backgrounds per state using LinearGradient
 * - Shimmer animation on gradient background
 * - Scale spring entrance animation (0.95 → 1)
 * - Goal number counts up on first view
 * - Full accessibility support
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { Springs } from '../../constants/motion';

import type {
  TodaysFocusCardProps,
  FocusState,
  FocusStateConfig,
} from './TodaysFocusCardTypes';

// Re-export types

/** Animation timing constants */
const ENTRANCE_DURATION = 300;
const SHIMMER_DURATION = 2500;
const NUMBER_COUNT_DURATION = 800;

/**
 * Focus state configurations
 * Each state has specific gradient colors, icon, and messaging
 */
const FOCUS_STATE_CONFIGS: Record<FocusState, FocusStateConfig> = {
  building: {
    getGoalLabel: () => '7 days',
    gradientColors: ['#14b8a6', '#06b6d4'],

    getMessage: (streak: number) => `${streak} days strong - keep going!`,
    // teal-500 → cyan-500
    icon: 'trending-up-outline',
    iconColor: '#ffffff',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#ffffff',
  },
  completed: {
    gradientColors: ['#22c55e', '#10b981'], // green-500 → emerald-500
    icon: 'checkmark-circle-outline',
    iconColor: '#ffffff',
    getGoalLabel: () => '🔥',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    getMessage: (streak: number) => `${streak} day streak and counting!`,
    textColor: '#ffffff',
  },
  recovering: {
    gradientColors: ['#8b5cf6', '#a855f7'], // violet-500 → purple-500
    icon: 'refresh-outline',
    iconColor: '#ffffff',
    getGoalLabel: () => 'best streak',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    getMessage: (bestStreak: number) =>
      `You've done ${bestStreak} before. Do it again!`,
    textColor: '#ffffff',
  },
  starting: {
    gradientColors: ['#3b82f6', '#6366f1'], // blue-500 → indigo-500
    icon: 'sparkles-outline',
    getGoalLabel: () => '3 days',
    iconColor: '#ffffff',
    getMessage: () => '3 days unlocks momentum!',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#ffffff',
  },
  struggling: {
    gradientColors: ['#f59e0b', '#f97316'], // amber-500 → orange-500
    icon: 'heart-outline',
    getGoalLabel: () => '1 day',
    iconColor: '#ffffff',
    getMessage: () => 'Every day is a fresh start!',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#ffffff',
  },
  thriving: {
    gradientColors: ['#10b981', '#14b8a6'], // emerald-500 → teal-500
    icon: 'locate-outline', // target equivalent
    iconColor: '#ffffff',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    getGoalLabel: () => 'next milestone',
    textColor: '#ffffff',
    getMessage: (goal: number) => `Complete today to hit ${goal} days!`,
  },
};

/**
 * Determines the focus state based on user metrics
 */
function determineFocusState(props: TodaysFocusCardProps): FocusState {
  const {
    currentStreak,
    isCompletedToday,
    weeklyCompletion,
    habitAge,
    bestStreak,
  } = props;

  // Completed state takes priority
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
  } = props;
  const reduceMotion = useReduceMotion();

  // Determine current state
  const focusState = useMemo(
    () => determineFocusState(props),
    [currentStreak, isCompletedToday, weeklyCompletion, habitAge, bestStreak]
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
  const countValue = useSharedValue(reduceMotion ? goalValue : 0);

  // Entrance animation
  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1;
      opacity.value = 1;
      countValue.value = goalValue;
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

    // Number count up animation
    countValue.value = withTiming(goalValue, {
      duration: NUMBER_COUNT_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [reduceMotion, goalValue, scale, opacity, countValue]);

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
      default: {
        return config.getMessage(0);
      }
    }
  }, [focusState, config, goalValue, currentStreak, bestStreak]);

  const goalLabel = config.getGoalLabel();

  // Accessibility
  const accessibilityLabel = `Today's focus: ${message}. Goal: ${goalValue} ${goalLabel}`;

  return (
    <Animated.View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='text'
      style={[styles.container, containerAnimatedStyle]}
    >
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
          {/* Icon */}
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

          {/* Text content */}
          <View style={styles.textContainer}>
            <Text style={[styles.message, { color: config.textColor }]}>
              {message}
            </Text>
            <View style={styles.goalRow}>
              <Text style={[styles.goalLabel, { color: config.subTextColor }]}>
                Goal:
              </Text>
              <AnimatedGoalNumber
                color={config.textColor}
                reduceMotion={reduceMotion}
                value={countValue}
              />
              <Text style={[styles.goalLabel, { color: config.subTextColor }]}>
                {goalLabel}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
});

/**
 * AnimatedGoalNumber - Displays the animated goal number
 */
interface AnimatedGoalNumberProps {
  value: SharedValue<number>;
  color: string;
  reduceMotion: boolean;
}

const AnimatedGoalNumber = React.memo(function AnimatedGoalNumber({
  value,
  color,
  reduceMotion,
}: AnimatedGoalNumberProps) {
  const animatedStyle = useAnimatedStyle(() => {
    // Reference value to trigger re-render when it changes
    // The actual display is handled by GoalValueDisplay
    const _currentValue = value.value;
    return {};
  });

  // For the text, we use a wrapper that reads the value
  // In practice, we'd use Reanimated text, but for simplicity:
  const AnimatedText = Animated.createAnimatedComponent(Text);

  return (
    <AnimatedText style={[styles.goalValue, { color }, animatedStyle]}>
      {/* Note: For true animated text, we'd need useAnimatedProps with native driver */}
      {/* For now, using static display since Reanimated text animation requires native config */}
      <GoalValueDisplay reduceMotion={reduceMotion} value={value} />
    </AnimatedText>
  );
});

/**
 * GoalValueDisplay - Displays the goal value (static for now, animated counting handled separately)
 */
interface GoalValueDisplayProps {
  value: SharedValue<number>;
  reduceMotion: boolean;
}

const GoalValueDisplay = React.memo(function GoalValueDisplay({
  value,
  reduceMotion,
}: GoalValueDisplayProps) {
  // For true animated counting, this would use Reanimated's derived values
  // For now, we'll use the final value directly since the counting animation
  // is complex to implement without native driver text support
  const [displayValue, setDisplayValue] = React.useState(
    Math.round(value.value)
  );

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(Math.round(value.value));
      return;
    }

    // Animate the count up using a timer-based approach
    const startValue = 0;
    const endValue = Math.round(value.value);
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
  }, [value, reduceMotion]);

  return <>{displayValue}</>;
});

const styles = StyleSheet.create({
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
  goalLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  gradient: {
    overflow: 'hidden',
    position: 'relative',
  },
  goalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    height: 48,
    alignItems: 'center',
    width: 48,
    borderRadius: 24,
    justifyContent: 'center',
  },
  goalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  shimmerGradient: {
    height: '100%',
    width: 200,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
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
} from './TodaysFocusCardTypes';
