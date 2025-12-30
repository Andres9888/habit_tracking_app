/**
 * ActivationModal Component
 * Pre-habit notification modal that primes users for habit execution
 *
 * Part of the Motivation System - Activation phase
 * Story T7.1: Create `ActivationModal` component
 *
 * Scientific Basis:
 * - Implementation intentions (Gollwitzer, 1999): 2-3x follow-through
 * - Andrew Huberman Dual Visualization: Show success OR failure based on motivation
 * - BJ Fogg's Tiny Habits: "Just 2 min" reduces activation energy
 *
 * Trigger Points:
 * - Notification tap at scheduled habit time
 * - Manual activation from habit card
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
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import {
  Heart,
  Play,
  Clock,
  Flame,
  Target,
  ChevronRight,
  Zap,
  X,
} from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Modal } from '../../Modal';
import { Springs } from '../../../constants/motion';

// Animation spring configs
const SPRING_BUTTON = { damping: 15, stiffness: 300 };
const SPRING_BOUNCY = { damping: 8, stiffness: 300 };
const SPRING_GENTLE = { damping: 28, stiffness: 180, mass: 1 };
const STAGGER_DELAY = 60; // Slightly faster stagger for modal content

/**
 * Habit data for display in the ActivationModal
 */
export interface ActivationHabitData {
  /** Habit ID for tracking */
  id: string;
  /** Habit name */
  name: string;
  /** Habit icon emoji */
  icon?: string;
  /** Current streak count */
  currentStreak?: number;
  /** Total completions */
  totalCompletions?: number;
  /** User's "why" statement */
  why?: string;
  /** WOOP plan (IF-THEN statement) */
  woopObstacle?: string;
  woopPlan?: string;
  /** Cue/trigger information */
  cueTime?: string;
  cueLocation?: string;
  cueAfterBehavior?: string;
  /** Visualization data (for ContextAwareViz) */
  vizSuccessBody?: string;
  vizSuccessMind?: string;
  vizSuccessEmotion?: string;
  vizFailureBody?: string;
  vizFailureMind?: string;
  vizFailureEmotion?: string;
}

export interface ActivationModalProps {
  /** Modal visibility */
  visible: boolean;
  /** Close modal callback */
  onClose: () => void;
  /** Habit data to display */
  habit: ActivationHabitData | null;
  /** Called when user taps "Start Now" */
  onStartNow?: () => void;
  /** Called when user taps "Snooze" */
  onSnooze?: () => void;
  /** Called when user taps "Just 2 Min" */
  onJustTwoMin?: () => void;
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

    const delay = index * STAGGER_DELAY + 200; // Base delay for modal entrance

    translateY.value = withDelay(delay, withSpring(0, SPRING_GENTLE));
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
  }, [visible, reduceMotion, index, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * HabitCard - Displays habit info with streak at top of modal
 */
function HabitCard({
  habit,
  reduceMotion,
}: {
  habit: ActivationHabitData;
  reduceMotion?: boolean;
}) {
  const streakScale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion || !habit.currentStreak) return;

    // Subtle pulse on streak number
    streakScale.value = withDelay(
      400,
      withSequence(
        withSpring(1.1, SPRING_BOUNCY),
        withSpring(1, SPRING_BUTTON)
      )
    );
  }, [reduceMotion, habit.currentStreak, streakScale]);

  const streakAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: streakScale.value }],
  }));

  return (
    <View className="flex-row items-center rounded-2xl bg-white p-4 shadow-sm shadow-stone-200/50">
      {/* Habit Icon */}
      <View className="mr-4 h-14 w-14 items-center justify-center rounded-xl bg-amber-100">
        <Text className="text-2xl">{habit.icon || '✨'}</Text>
      </View>

      {/* Habit Info */}
      <View className="flex-1">
        <Text className="text-lg font-semibold text-stone-800">
          {habit.name}
        </Text>
        <View className="mt-1 flex-row items-center gap-3">
          {/* Streak */}
          {habit.currentStreak !== undefined && habit.currentStreak > 0 && (
            <Animated.View
              style={streakAnimatedStyle}
              className="flex-row items-center gap-1"
            >
              <Flame className="text-orange-500" size={14} />
              <Text className="text-sm font-medium text-stone-600">
                {habit.currentStreak} day streak
              </Text>
            </Animated.View>
          )}
          {/* Completions */}
          {habit.totalCompletions !== undefined &&
            habit.totalCompletions > 0 && (
              <View className="flex-row items-center gap-1">
                <Target className="text-emerald-500" size={14} />
                <Text className="text-sm text-stone-500">
                  {habit.totalCompletions} total
                </Text>
              </View>
            )}
        </View>
      </View>
    </View>
  );
}

/**
 * WhySection - Featured display of user's "why"
 */
function WhySection({ why }: { why: string }) {
  return (
    <View className="rounded-2xl border-l-4 border-l-rose-400 bg-rose-50 p-4">
      <View className="mb-2 flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-rose-100">
          <Heart className="text-rose-500" size={16} />
        </View>
        <Text className="font-semibold text-rose-800">Your Why</Text>
      </View>
      <Text className="text-base italic leading-6 text-rose-700">"{why}"</Text>
    </View>
  );
}

/**
 * WOOPReminder - IF-THEN implementation intention
 */
function WOOPReminder({
  obstacle,
  plan,
}: {
  obstacle: string;
  plan: string;
}) {
  return (
    <View className="rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 p-4">
      <View className="mb-2 flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
          <Target className="text-amber-600" size={16} />
        </View>
        <Text className="font-semibold text-stone-800">Your Plan</Text>
      </View>
      <Text className="text-sm leading-5 text-stone-700">
        <Text className="font-medium text-amber-700">If </Text>
        {obstacle}
        <Text className="font-medium text-emerald-700"> → then </Text>
        {plan}
      </Text>
    </View>
  );
}

/**
 * CueReminder - When/Where/After trigger reminder
 */
function CueReminder({
  time,
  location,
  afterBehavior,
}: {
  time?: string;
  location?: string;
  afterBehavior?: string;
}) {
  const hasAnyCue = time || location || afterBehavior;
  if (!hasAnyCue) return null;

  return (
    <View className="rounded-2xl bg-sky-50 p-4">
      <View className="mb-2 flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-sky-100">
          <Clock className="text-sky-600" size={16} />
        </View>
        <Text className="font-semibold text-sky-800">Your Cue</Text>
      </View>
      <View className="gap-1">
        {time && (
          <Text className="text-sm text-sky-700">
            <Text className="font-medium">When: </Text>
            {time}
          </Text>
        )}
        {location && (
          <Text className="text-sm text-sky-700">
            <Text className="font-medium">Where: </Text>
            {location}
          </Text>
        )}
        {afterBehavior && (
          <Text className="text-sm text-sky-700">
            <Text className="font-medium">After: </Text>
            {afterBehavior}
          </Text>
        )}
      </View>
    </View>
  );
}

/**
 * StartNowButton - Primary CTA with glow animation
 */
function StartNowButton({
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
      glowOpacity.value = withTiming(0.8, { duration: 800 }, (finished) => {
        if (finished) {
          glowOpacity.value = withTiming(0.5, { duration: 800 }, (finished2) => {
            if (finished2) {
              runOnJS(pulseGlow)();
            }
          });
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
    <Animated.View style={buttonAnimatedStyle} className="relative">
      {/* Glow effect */}
      <Animated.View
        style={glowAnimatedStyle}
        className="absolute -inset-2 rounded-2xl bg-emerald-400/30 blur-xl"
      />
      <Pressable
        accessibilityLabel="Start habit now"
        accessibilityRole="button"
        className="flex-row items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-4"
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Play className="text-white" size={20} fill="white" />
        <Text className="text-lg font-bold text-white">Start Now</Text>
      </Pressable>
    </Animated.View>
  );
}

/**
 * QuickAction - Secondary action buttons (Snooze, Just 2 Min)
 */
function QuickAction({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
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
    <Animated.View style={animatedStyle} className="flex-1">
      <Pressable
        accessibilityLabel={label}
        accessibilityRole="button"
        className="flex-row items-center justify-center gap-2 rounded-xl bg-stone-100 px-4 py-3"
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {icon}
        <Text className="font-medium text-stone-700">{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

/**
 * ActivationModal - Main component
 *
 * Pre-habit notification modal that primes users for habit execution.
 * Displays:
 * 1. Habit card with streak/completion stats
 * 2. Your Why (featured)
 * 3. WOOP IF-THEN reminder
 * 4. Cue/trigger reminder
 * 5. Start Now button (glowing)
 * 6. Quick actions: Snooze, Just 2 Min
 */
export function ActivationModal({
  visible,
  onClose,
  habit,
  onStartNow,
  onSnooze,
  onJustTwoMin,
  reduceMotion = false,
}: ActivationModalProps) {
  const insets = useSafeAreaInsets();

  const handleStartNow = useCallback(() => {
    onStartNow?.();
    onClose();
  }, [onStartNow, onClose]);

  const handleSnooze = useCallback(() => {
    onSnooze?.();
    onClose();
  }, [onSnooze, onClose]);

  const handleJustTwoMin = useCallback(() => {
    onJustTwoMin?.();
    onClose();
  }, [onJustTwoMin, onClose]);

  // Don't render if no habit data
  if (!habit) return null;

  // Check which content sections to show
  const hasWhy = !!habit.why;
  const hasWOOP = !!habit.woopObstacle && !!habit.woopPlan;
  const hasCue =
    !!habit.cueTime || !!habit.cueLocation || !!habit.cueAfterBehavior;

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      variant="fullScreen"
      respectReduceMotion={!reduceMotion}
    >
      <View
        style={{ paddingTop: insets.top }}
        className="flex-1 bg-stone-50"
      >
        {/* Header with close button */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center gap-2">
            <Zap className="text-amber-500" size={20} />
            <Text className="text-lg font-bold text-stone-800">
              Time to Build
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Close activation modal"
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-full bg-stone-200/50"
            onPress={onClose}
          >
            <X className="text-stone-600" size={20} />
          </Pressable>
        </View>

        {/* Scrollable content */}
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Habit Card */}
          <AnimatedContent index={0} visible={visible} reduceMotion={reduceMotion}>
            <HabitCard habit={habit} reduceMotion={reduceMotion} />
          </AnimatedContent>

          {/* Your Why */}
          {hasWhy && (
            <AnimatedContent
              index={1}
              visible={visible}
              reduceMotion={reduceMotion}
            >
              <View className="mt-4">
                <WhySection why={habit.why!} />
              </View>
            </AnimatedContent>
          )}

          {/* WOOP IF-THEN Reminder */}
          {hasWOOP && (
            <AnimatedContent
              index={hasWhy ? 2 : 1}
              visible={visible}
              reduceMotion={reduceMotion}
            >
              <View className="mt-4">
                <WOOPReminder
                  obstacle={habit.woopObstacle!}
                  plan={habit.woopPlan!}
                />
              </View>
            </AnimatedContent>
          )}

          {/* Cue Reminder */}
          {hasCue && (
            <AnimatedContent
              index={(hasWhy ? 1 : 0) + (hasWOOP ? 1 : 0) + 1}
              visible={visible}
              reduceMotion={reduceMotion}
            >
              <View className="mt-4">
                <CueReminder
                  time={habit.cueTime}
                  location={habit.cueLocation}
                  afterBehavior={habit.cueAfterBehavior}
                />
              </View>
            </AnimatedContent>
          )}
        </ScrollView>

        {/* Bottom actions */}
        <View
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          className="border-t border-stone-200 bg-white px-4 pt-4"
        >
          {/* Start Now - Primary CTA */}
          <AnimatedContent
            index={(hasWhy ? 1 : 0) + (hasWOOP ? 1 : 0) + (hasCue ? 1 : 0) + 1}
            visible={visible}
            reduceMotion={reduceMotion}
          >
            <StartNowButton onPress={handleStartNow} reduceMotion={reduceMotion} />
          </AnimatedContent>

          {/* Quick Actions */}
          <AnimatedContent
            index={(hasWhy ? 1 : 0) + (hasWOOP ? 1 : 0) + (hasCue ? 1 : 0) + 2}
            visible={visible}
            reduceMotion={reduceMotion}
          >
            <View className="mt-3 flex-row gap-3">
              <QuickAction
                label="Snooze"
                icon={<Clock className="text-stone-500" size={16} />}
                onPress={handleSnooze}
              />
              <QuickAction
                label="Just 2 Min"
                icon={<Zap className="text-amber-500" size={16} />}
                onPress={handleJustTwoMin}
              />
            </View>
          </AnimatedContent>
        </View>
      </View>
    </Modal>
  );
}

export default ActivationModal;
