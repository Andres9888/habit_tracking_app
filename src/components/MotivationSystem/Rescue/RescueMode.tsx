/**
 * RescueMode Component
 * Emergency intervention when a user's streak is at risk
 *
 * Part of the Motivation System - Rescue phase
 * Story T8.1-T8.7: Create RescueMode screen/modal
 *
 * Scientific Basis:
 * - Loss aversion (Kahneman & Tversky, Nobel Prize): Losses hurt 2x more
 * - Andrew Huberman Dual Visualization: ALWAYS show failure when unmotivated
 * - BJ Fogg's Tiny Habits: "Just 2 min" reduces activation energy
 *
 * Key Insight: In Rescue Mode, ALWAYS show failure visualization because
 * the user is clearly not motivated. Loss aversion is the most powerful lever.
 *
 * Trigger Points:
 * - X hours before day ends with habit incomplete
 * - User opens app after missing notification
 * - Manually triggered from habit card
 */

import React, { useCallback, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';
import {
  Heart,
  Play,
  Clock,
  Flame,
  AlertTriangle,
  X,
  Zap,
  Timer,
} from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Modal } from '../../Modal';
import { FailureViz } from './FailureViz';

// Animation spring configs
const SPRING_BUTTON = { damping: 15, stiffness: 300 };
const SPRING_BOUNCY = { damping: 8, stiffness: 300 };
const SPRING_GENTLE = { damping: 28, mass: 1.2, stiffness: 180 };
const STAGGER_DELAY = 60;

/**
 * Habit data for display in Rescue Mode
 */
export interface RescueHabitData {
  /** Habit ID for tracking */
  id: string;
  /** Habit name */
  name: string;
  /** Habit icon emoji */
  icon?: string;
  /** Current streak count at risk */
  currentStreak?: number;
  /** Total completions */
  totalCompletions?: number;
  /** User's "why" statement */
  why?: string;
  /** Failure visualization data */
  vizFailureBody?: string;
  vizFailureMind?: string;
  vizFailureEmotion?: string;
  /** Hours remaining until day ends */
  hoursRemaining?: number;
}

export interface RescueModeProps {
  /** Modal visibility */
  visible: boolean;
  /** Close modal callback */
  onClose: () => void;
  /** Habit data to display */
  habit: RescueHabitData | null;
  /** Called when user taps "Just Do 2 Minutes" */
  onJustTwoMin?: () => void;
  /** Called when user taps "Start Full Habit" */
  onStartFull?: () => void;
  /** Called when user taps "Skip Today" */
  onSkipToday?: () => void;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
}

/**
 * AnimatedContent - Wrapper for staggered content entrance
 */
function AnimatedContent({
  children,
  index,
  visible,
  reduceMotion = false,
}: {
  children: React.ReactNode;
  index: number;
  visible: boolean;
  reduceMotion?: boolean;
}) {
  const INITIAL_TRANSLATE_Y = 20;
  const translateY = useSharedValue(INITIAL_TRANSLATE_Y);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      translateY.value = INITIAL_TRANSLATE_Y;
      opacity.value = 0;
      return;
    }

    if (reduceMotion) {
      translateY.value = 0;
      opacity.value = 1;
      return;
    }

    const delay = index * STAGGER_DELAY + 200;

    translateY.value = withDelay(delay, withSpring(0, SPRING_GENTLE));
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
  }, [visible, reduceMotion, index, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * StreakAtRiskHeader - Urgent header showing streak is at risk
 */
function StreakAtRiskHeader({
  streak,
  hoursRemaining,
  reduceMotion,
}: {
  streak: number;
  hoursRemaining?: number;
  reduceMotion?: boolean;
}) {
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;

    // Continuous pulse animation for urgency
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1, // Infinite
      true
    );
  }, [reduceMotion, pulseScale]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View className='items-center rounded-2xl bg-rose-50 p-4'>
      {/* Emergency icon */}
      <Animated.View
        className='mb-3 h-16 w-16 items-center justify-center rounded-full bg-rose-100'
        style={pulseStyle}
      >
        <AlertTriangle className='text-rose-600' size={32} />
      </Animated.View>

      {/* Streak at risk badge */}
      <View className='mb-2 flex-row items-center gap-2 rounded-full bg-rose-500 px-4 py-2'>
        <Flame className='text-white' size={18} />
        <Text className='text-base font-bold text-white'>
          {streak} Day Streak at Risk!
        </Text>
      </View>

      {/* Time remaining */}
      {hoursRemaining !== undefined && (
        <View className='mt-2 flex-row items-center gap-1'>
          <Timer className='text-rose-500' size={14} />
          <Text className='text-sm font-medium text-rose-600'>
            {hoursRemaining <= 1
              ? 'Less than 1 hour left'
              : `${hoursRemaining} hours remaining`}
          </Text>
        </View>
      )}
    </View>
  );
}

/**
 * FeaturedWhy - Larger, more prominent "Your Why" display for rescue
 */
function FeaturedWhy({ why }: { why: string }) {
  return (
    <View className='rounded-2xl border-l-4 border-l-rose-400 bg-gradient-to-br from-rose-50 to-amber-50 p-5'>
      <View className='mb-3 flex-row items-center gap-2'>
        <View className='h-10 w-10 items-center justify-center rounded-xl bg-rose-100'>
          <Heart className='text-rose-500' fill='#f43f5e' size={20} />
        </View>
        <Text className='text-lg font-bold text-rose-800'>
          Remember Your Why
        </Text>
      </View>
      <Text className='text-lg font-medium italic leading-7 text-rose-700'>
        "{why}"
      </Text>
      <Text className='mt-3 text-sm text-rose-500'>
        This is why you started. Don't let today break your momentum.
      </Text>
    </View>
  );
}

/**
 * JustTwoMinButton - Primary CTA with urgent styling and glow
 */
function JustTwoMinButton({
  onPress,
  reduceMotion = false,
}: {
  onPress: () => void;
  reduceMotion?: boolean;
}) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);

  // Pulsing glow effect
  useEffect(() => {
    if (reduceMotion) {
      glowOpacity.value = 0.5;
      return;
    }

    const pulseGlow = () => {
      glowOpacity.value = withTiming(0.9, { duration: 700 }, (finished) => {
        if (finished) {
          glowOpacity.value = withTiming(
            0.5,
            { duration: 700 },
            (finished2) => {
              if (finished2) {
                runOnJS(pulseGlow)();
              }
            }
          );
        }
      });
    };

    pulseGlow();
  }, [reduceMotion, glowOpacity]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, SPRING_BUTTON);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
  }, [scale]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }, [onPress]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View className='relative' style={buttonAnimatedStyle}>
      {/* Glow effect - amber for urgency */}
      <Animated.View
        className='absolute -inset-2 rounded-2xl bg-amber-400/40 blur-xl'
        style={glowAnimatedStyle}
      />
      <Pressable
        accessibilityHint='Start with a tiny commitment to save your streak'
        accessibilityLabel='Just do 2 minutes'
        accessibilityRole='button'
        className='flex-row items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-5'
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Zap className='text-white' fill='white' size={24} />
        <View>
          <Text className='text-xl font-bold text-white'>
            Just Do 2 Minutes
          </Text>
          <Text className='text-center text-sm text-amber-100'>
            That's all it takes to save your streak
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

/**
 * SecondaryAction - Less prominent action buttons
 */
function SecondaryAction({
  label,
  icon,
  onPress,
  variant = 'default',
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  variant?: 'default' | 'destructive';
}) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, SPRING_BUTTON);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
  }, [scale]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View className='flex-1' style={animatedStyle}>
      <Pressable
        accessibilityLabel={label}
        accessibilityRole='button'
        className={clsx(
          'flex-row items-center justify-center gap-2 rounded-xl px-4 py-3',
          variant === 'destructive' ? 'bg-stone-100' : 'bg-emerald-100'
        )}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {icon}
        <Text
          className={clsx(
            'font-medium',
            variant === 'destructive' ? 'text-stone-500' : 'text-emerald-700'
          )}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/**
 * RescueMode - Main component
 *
 * Emergency intervention screen when a user's streak is at risk.
 * Key differences from ActivationModal:
 * 1. ALWAYS shows failure visualization (Huberman protocol)
 * 2. "Just 2 Min" is the PRIMARY CTA (not "Start Now")
 * 3. More urgent visual styling (red/amber theme)
 * 4. Larger "Your Why" display for emotional impact
 * 5. Streak-at-risk badge with countdown
 */
export function RescueMode({
  visible,
  onClose,
  habit,
  onJustTwoMin,
  onStartFull,
  onSkipToday,
  reduceMotion = false,
}: RescueModeProps) {
  const insets = useSafeAreaInsets();

  const handleJustTwoMin = useCallback(() => {
    onJustTwoMin?.();
    onClose();
  }, [onJustTwoMin, onClose]);

  const handleStartFull = useCallback(() => {
    onStartFull?.();
    onClose();
  }, [onStartFull, onClose]);

  const handleSkipToday = useCallback(() => {
    onSkipToday?.();
    onClose();
  }, [onSkipToday, onClose]);

  // Don't render if no habit data
  if (!habit) return null;

  // Check which content sections to show
  const hasWhy = !!habit.why;
  const hasViz =
    !!habit.vizFailureBody ||
    !!habit.vizFailureMind ||
    !!habit.vizFailureEmotion;
  const hasStreak = (habit.currentStreak ?? 0) > 0;

  return (
    <Modal
      respectReduceMotion={!reduceMotion}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
    >
      <View
        className='flex-1 bg-gradient-to-b from-rose-50 to-stone-50'
        style={{ paddingTop: insets.top }}
      >
        {/* Header with close button */}
        <View className='flex-row items-center justify-between px-4 py-3'>
          <View className='flex-row items-center gap-2'>
            <AlertTriangle className='text-rose-500' size={20} />
            <Text className='text-lg font-bold text-rose-700'>
              🆘 Rescue Mode
            </Text>
          </View>
          <Pressable
            accessibilityLabel='Close rescue mode'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center rounded-full bg-stone-200/50'
            onPress={onClose}
          >
            <X className='text-stone-600' size={20} />
          </Pressable>
        </View>

        {/* Scrollable content */}
        <ScrollView
          className='flex-1 px-4'
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Streak at Risk Header */}
          {hasStreak && (
            <AnimatedContent
              index={0}
              reduceMotion={reduceMotion}
              visible={visible}
            >
              <StreakAtRiskHeader
                hoursRemaining={habit.hoursRemaining}
                reduceMotion={reduceMotion}
                streak={habit.currentStreak!}
              />
            </AnimatedContent>
          )}

          {/* Featured Your Why */}
          {hasWhy && (
            <AnimatedContent
              index={hasStreak ? 1 : 0}
              reduceMotion={reduceMotion}
              visible={visible}
            >
              <View className='mt-4'>
                <FeaturedWhy why={habit.why!} />
              </View>
            </AnimatedContent>
          )}

          {/* Failure Visualization - ALWAYS shown in Rescue Mode */}
          <AnimatedContent
            index={(hasStreak ? 1 : 0) + (hasWhy ? 1 : 0)}
            reduceMotion={reduceMotion}
            visible={visible}
          >
            <View className='mt-4'>
              <FailureViz
                reduceMotion={reduceMotion}
                streakCount={habit.currentStreak}
                visualization={{
                  failureBody: habit.vizFailureBody,
                  failureEmotion: habit.vizFailureEmotion,
                  failureMind: habit.vizFailureMind,
                }}
              />
            </View>
          </AnimatedContent>

          {/* Science tip */}
          <AnimatedContent
            index={(hasStreak ? 1 : 0) + (hasWhy ? 1 : 0) + 1}
            reduceMotion={reduceMotion}
            visible={visible}
          >
            <View className='mt-4 rounded-xl bg-stone-100 p-3'>
              <Text className='text-center text-xs italic text-stone-600'>
                💡 Research shows: Just 2 minutes is enough to maintain your
                habit. The hardest part is starting.
              </Text>
            </View>
          </AnimatedContent>
        </ScrollView>

        {/* Bottom actions */}
        <View
          className='border-t border-rose-100 bg-white px-4 pt-4'
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          {/* Just 2 Min - Primary CTA */}
          <AnimatedContent
            index={(hasStreak ? 1 : 0) + (hasWhy ? 1 : 0) + 2}
            reduceMotion={reduceMotion}
            visible={visible}
          >
            <JustTwoMinButton
              reduceMotion={reduceMotion}
              onPress={handleJustTwoMin}
            />
          </AnimatedContent>

          {/* Secondary Actions */}
          <AnimatedContent
            index={(hasStreak ? 1 : 0) + (hasWhy ? 1 : 0) + 3}
            reduceMotion={reduceMotion}
            visible={visible}
          >
            <View className='mt-3 flex-row gap-3'>
              <SecondaryAction
                icon={<Play className='text-emerald-600' size={16} />}
                label='Full Habit'
                variant='default'
                onPress={handleStartFull}
              />
              <SecondaryAction
                icon={<Clock className='text-stone-400' size={16} />}
                label='Skip Today'
                variant='destructive'
                onPress={handleSkipToday}
              />
            </View>
          </AnimatedContent>
        </View>
      </View>
    </Modal>
  );
}

export default RescueMode;
