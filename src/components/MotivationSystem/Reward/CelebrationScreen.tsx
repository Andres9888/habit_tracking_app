/**
 * CelebrationScreen Component
 * Post-completion celebration and reflection flow
 *
 * Part of the Motivation System - Reward phase
 * Story T9.1-T9.7: Reward/Celebration Screen
 *
 * Scientific Basis:
 * - BJ Fogg (Stanford, "Tiny Habits"): Celebration IMMEDIATELY after behavior
 *   is the most important part of habit formation. It releases dopamine and wires the habit.
 * - Journaling increases self-awareness and consistency (Daylio validation)
 *
 * Purpose: Celebrate completion and capture positive emotions
 *
 * Contains:
 * 1. Celebration header with confetti
 * 2. Updated streak display with flame animation
 * 3. Stats cards (completion rate, best streak)
 * 4. Quick Reflection (emoji + note)
 * 5. "Capture this feeling" prompts (Record Voice, Write Letter)
 * 6. Done button
 */

import React, { useCallback, useEffect, useState } from 'react';
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
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {
  PartyPopper,
  Flame,
  Target,
  TrendingUp,
  Trophy,
  Mic,
  Mail,
  Check,
  X,
  Sparkles,
  Crown,
} from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Modal } from '../../Modal';
import { QuickReflection, type EmojiType } from './QuickReflection';

// Animation spring configs
const SPRING_BUTTON = { damping: 15, stiffness: 300 };
const SPRING_BOUNCY = { damping: 8, stiffness: 300 };
const SPRING_GENTLE = { damping: 28, mass: 1, stiffness: 180 };
const STAGGER_DELAY = 60;

// Confetti particle config
const CONFETTI_COLORS = [
  '#10B981',
  '#34D399',
  '#FBBF24',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
];
const PARTICLE_COUNT = 12;

/**
 * Habit data for display in Celebration Screen
 */
export interface CelebrationHabitData {
  /** Habit ID for tracking */
  id: string;
  /** Habit name */
  name: string;
  /** Habit icon emoji */
  icon?: string;
  /** Current streak count (updated after completion) */
  currentStreak?: number;
  /** Best streak ever achieved */
  bestStreak?: number;
  /** Total completions count */
  totalCompletions?: number;
  /** Completion rate percentage (0-100) */
  completionRate?: number;
  /** Whether this is a streak milestone (e.g., 7, 14, 30, 100 days) */
  isStreakMilestone?: boolean;
  /** Milestone number if applicable */
  milestoneNumber?: number;
}

export interface CelebrationScreenProps {
  /** Modal visibility */
  visible: boolean;
  /** Close modal callback */
  onClose: () => void;
  /** Habit data to display */
  habit: CelebrationHabitData | null;
  /** Current reflection emoji (if already set) */
  selectedEmoji?: EmojiType;
  /** Current reflection note (if already set) */
  reflectionNote?: string;
  /** Called when emoji is selected */
  onEmojiSelect?: (emoji: EmojiType) => void;
  /** Called when note is changed */
  onNoteChange?: (note: string) => void;
  /** Called when reflection is submitted */
  onReflectionSubmit?: () => void;
  /** Called when user taps "Record Voice" */
  onRecordVoice?: () => void;
  /** Called when user taps "Write Letter" */
  onWriteLetter?: () => void;
  /** Called when user taps "Done" */
  onDone?: () => void;
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
 * ConfettiParticle - Individual confetti particle
 */
function ConfettiParticle({
  color,
  delay,
  angle,
  reduceMotion,
}: {
  color: string;
  delay: number;
  angle: number;
  reduceMotion?: boolean;
}) {
  const progress = useSharedValue(0);
  // Round all values to avoid "Loss of precision during arithmetic conversion" error in Reanimated
  const distance = Math.round(100 + Math.random() * 60);
  const rotation = Math.round(Math.random() * 720);
  const size = Math.round(6 + Math.random() * 6);

  useEffect(() => {
    if (reduceMotion) return;

    progress.value = withDelay(delay, withTiming(1, { duration: 1200 }));
  }, [delay, reduceMotion, progress]);

  // Round to avoid precision errors in Reanimated's native layer
  const translateX = Math.round(Math.cos(angle) * distance);
  const translateY = Math.round(Math.sin(angle) * distance) - 50; // Bias upward

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const currentX = interpolate(
      p,
      [0, 1],
      [0, translateX],
      Extrapolation.CLAMP
    );
    const currentY = interpolate(
      p,
      [0, 0.3, 1],
      [0, translateY * 0.3, translateY + 100],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      p,
      [0, 0.2, 0.8, 1],
      [0, 1.2, 1, 0.3],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      p,
      [0, 0.2, 0.8, 1],
      [0, 1, 1, 0],
      Extrapolation.CLAMP
    );
    const rotate = interpolate(p, [0, 1], [0, rotation], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [
        { translateX: currentX },
        { translateY: currentY },
        { scale },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  if (reduceMotion) return null;

  return (
    <Animated.View
      style={[
        {
          backgroundColor: color,
          borderRadius: size / 2,
          height: size,
          position: 'absolute',
          width: size,
        },
        animatedStyle,
      ]}
    />
  );
}

/**
 * ConfettiBurst - Celebratory confetti animation
 */
function ConfettiBurst({ reduceMotion }: { reduceMotion?: boolean }) {
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2 - Math.PI / 2; // Start from top
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    const delay = i * 30;

    particles.push(
      <ConfettiParticle
        key={i}
        angle={angle}
        color={color}
        delay={delay}
        reduceMotion={reduceMotion}
      />
    );
  }

  return (
    <View
      pointerEvents='none'
      style={{
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
      }}
    >
      {particles}
    </View>
  );
}

/**
 * CelebrationHeader - Animated celebration header with icon and message
 */
function CelebrationHeader({
  habitName,
  isStreakMilestone,
  milestoneNumber,
  reduceMotion,
}: {
  habitName: string;
  isStreakMilestone?: boolean;
  milestoneNumber?: number;
  reduceMotion?: boolean;
}) {
  const iconScale = useSharedValue(0);
  const iconRotate = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      iconScale.value = 1;
      return;
    }

    // Pop-in animation: 0 → 1.2 → 1 with slight rotation
    iconScale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withDelay(100, withSpring(1.2, SPRING_BOUNCY)),
      withSpring(1, { damping: 12, stiffness: 200 })
    );

    // Subtle wiggle
    iconRotate.value = withDelay(
      400,
      withSequence(
        withTiming(-5, { duration: 100 }),
        withTiming(5, { duration: 100 }),
        withTiming(-3, { duration: 80 }),
        withTiming(3, { duration: 80 }),
        withTiming(0, { duration: 60 })
      )
    );
  }, [reduceMotion, iconScale, iconRotate]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      // Round to avoid "Loss of precision during arithmetic conversion" error in Reanimated
      { rotate: `${Math.round(iconRotate.value)}deg` },
    ],
  }));

  return (
    <View className='items-center rounded-2xl bg-emerald-50 p-6'>
      {/* Confetti effect */}
      <ConfettiBurst reduceMotion={reduceMotion} />

      {/* Celebration icon */}
      <Animated.View
        className='mb-4 h-20 w-20 items-center justify-center rounded-full bg-emerald-100'
        style={iconAnimatedStyle}
      >
        {isStreakMilestone ? (
          <Crown className='text-emerald-600' fill='#10b981' size={40} />
        ) : (
          <PartyPopper className='text-emerald-600' size={40} />
        )}
      </Animated.View>

      {/* Celebration text */}
      <Text className='mb-1 text-2xl font-bold text-emerald-800'>
        {isStreakMilestone
          ? `${milestoneNumber} Day Milestone!`
          : 'You Did It!'}
      </Text>
      <Text className='text-center text-base text-emerald-600'>
        {isStreakMilestone
          ? `Incredible dedication to "${habitName}"!`
          : `"${habitName}" completed`}
      </Text>
    </View>
  );
}

/**
 * StreakDisplay - Animated streak count with flame
 */
function StreakDisplay({
  streak,
  reduceMotion,
}: {
  streak: number;
  reduceMotion?: boolean;
}) {
  const flameScale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;

    // Continuous pulse animation for the flame
    flameScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, [reduceMotion, flameScale]);

  const flameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  return (
    <View className='flex-row items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-4'>
      <Animated.View style={flameAnimatedStyle}>
        <Flame className='text-orange-500' fill='#f97316' size={32} />
      </Animated.View>
      <View className='items-center'>
        <Text className='text-3xl font-bold text-orange-600'>{streak}</Text>
        <Text className='text-sm font-medium text-orange-500'>Day Streak</Text>
      </View>
    </View>
  );
}

/**
 * StatCard - Individual stat display card
 */
function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: 'emerald' | 'violet' | 'amber';
}) {
  const colorClasses = {
    amber: {
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      label: 'text-amber-600',
      value: 'text-amber-700',
    },
    emerald: {
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      label: 'text-emerald-600',
      value: 'text-emerald-700',
    },
    violet: {
      bg: 'bg-violet-50',
      iconBg: 'bg-violet-100',
      label: 'text-violet-600',
      value: 'text-violet-700',
    },
  };

  const classes = colorClasses[color];

  return (
    <View className={clsx('flex-1 items-center rounded-xl p-3', classes.bg)}>
      <View
        className={clsx(
          'mb-2 h-10 w-10 items-center justify-center rounded-lg',
          classes.iconBg
        )}
      >
        {icon}
      </View>
      <Text className={clsx('text-xl font-bold', classes.value)}>{value}</Text>
      <Text className={clsx('text-xs font-medium', classes.label)}>
        {label}
      </Text>
    </View>
  );
}

/**
 * StatsRow - Completion stats display
 */
function StatsRow({
  completionRate,
  bestStreak,
  totalCompletions,
}: {
  completionRate?: number;
  bestStreak?: number;
  totalCompletions?: number;
}) {
  return (
    <View className='flex-row gap-3'>
      {completionRate !== undefined && (
        <StatCard
          color='emerald'
          icon={<TrendingUp className='text-emerald-500' size={20} />}
          label='Completion'
          value={`${Math.round(completionRate)}%`}
        />
      )}
      {bestStreak !== undefined && (
        <StatCard
          color='amber'
          icon={<Trophy className='text-amber-500' size={20} />}
          label='Best Streak'
          value={bestStreak}
        />
      )}
      {totalCompletions !== undefined && (
        <StatCard
          color='violet'
          icon={<Target className='text-violet-500' size={20} />}
          label='Total'
          value={totalCompletions}
        />
      )}
    </View>
  );
}

/**
 * CapturePromptButton - "Capture this feeling" action button
 */
function CapturePromptButton({
  icon,
  label,
  description,
  onPress,
  isPremium = false,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onPress: () => void;
  isPremium?: boolean;
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
        className='flex-row items-center gap-3 rounded-xl bg-stone-50 p-4'
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View className='h-10 w-10 items-center justify-center rounded-lg bg-stone-100'>
          {icon}
        </View>
        <View className='flex-1'>
          <View className='flex-row items-center gap-2'>
            <Text className='font-semibold text-stone-700'>{label}</Text>
            {isPremium && (
              <View className='rounded-full bg-amber-100 px-2 py-0.5'>
                <Text className='text-xs font-medium text-amber-700'>PRO</Text>
              </View>
            )}
          </View>
          <Text className='text-xs text-stone-500'>{description}</Text>
        </View>
        <Sparkles className='text-stone-400' size={16} />
      </Pressable>
    </Animated.View>
  );
}

/**
 * DoneButton - Primary CTA with celebratory styling
 */
function DoneButton({
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
          glowOpacity.value = withTiming(
            0.5,
            { duration: 800 },
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
      {/* Glow effect - emerald for celebration */}
      <Animated.View
        className='absolute -inset-2 rounded-2xl bg-emerald-400/40 blur-xl'
        style={glowAnimatedStyle}
      />
      <Pressable
        accessibilityHint='Close celebration and continue'
        accessibilityLabel='Done'
        accessibilityRole='button'
        className='flex-row items-center justify-center gap-3 rounded-xl bg-emerald-500 px-8 py-4'
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Check className='text-white' size={24} />
        <Text className='text-lg font-bold text-white'>Done</Text>
      </Pressable>
    </Animated.View>
  );
}

/**
 * CelebrationScreen - Main component
 *
 * Post-completion celebration and reflection flow.
 * Key features:
 * 1. Celebratory animation with confetti
 * 2. Streak milestone recognition
 * 3. Stats display (completion rate, best streak, total)
 * 4. Quick Reflection integration
 * 5. "Capture this feeling" prompts for premium features
 * 6. Emerald theme for success/celebration
 */
export function CelebrationScreen({
  visible,
  onClose,
  habit,
  selectedEmoji,
  reflectionNote = '',
  onEmojiSelect,
  onNoteChange,
  onReflectionSubmit,
  onRecordVoice,
  onWriteLetter,
  onDone,
  reduceMotion = false,
}: CelebrationScreenProps) {
  const insets = useSafeAreaInsets();
  const [localEmoji, setLocalEmoji] = useState<EmojiType | undefined>(
    selectedEmoji
  );
  const [localNote, setLocalNote] = useState(reflectionNote);

  // Sync with props
  useEffect(() => {
    setLocalEmoji(selectedEmoji);
  }, [selectedEmoji]);

  useEffect(() => {
    setLocalNote(reflectionNote);
  }, [reflectionNote]);

  const handleEmojiSelect = useCallback(
    (emoji: EmojiType) => {
      setLocalEmoji(emoji);
      onEmojiSelect?.(emoji);
    },
    [onEmojiSelect]
  );

  const handleNoteChange = useCallback(
    (note: string) => {
      setLocalNote(note);
      onNoteChange?.(note);
    },
    [onNoteChange]
  );

  const handleDone = useCallback(() => {
    onDone?.();
    onClose();
  }, [onDone, onClose]);

  const handleRecordVoice = useCallback(() => {
    onRecordVoice?.();
  }, [onRecordVoice]);

  const handleWriteLetter = useCallback(() => {
    onWriteLetter?.();
  }, [onWriteLetter]);

  // Don't render if no habit data
  if (!habit) return null;

  // Check which content sections to show
  const hasStreak = (habit.currentStreak ?? 0) > 0;
  const hasStats =
    habit.completionRate !== undefined ||
    habit.bestStreak !== undefined ||
    habit.totalCompletions !== undefined;

  // Calculate content index for stagger
  let contentIndex = 0;

  return (
    <Modal
      respectReduceMotion={!reduceMotion}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
    >
      <View
        className='flex-1 bg-gradient-to-b from-emerald-50 to-stone-50'
        style={{ paddingTop: insets.top }}
      >
        {/* Header with close button */}
        <View className='flex-row items-center justify-between px-4 py-3'>
          <View className='flex-row items-center gap-2'>
            <PartyPopper className='text-emerald-500' size={20} />
            <Text className='text-lg font-bold text-emerald-700'>
              Celebration
            </Text>
          </View>
          <Pressable
            accessibilityLabel='Close celebration'
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
          {/* Celebration Header */}
          <AnimatedContent
            index={contentIndex++}
            reduceMotion={reduceMotion}
            visible={visible}
          >
            <CelebrationHeader
              habitName={habit.name}
              isStreakMilestone={habit.isStreakMilestone}
              milestoneNumber={habit.milestoneNumber}
              reduceMotion={reduceMotion}
            />
          </AnimatedContent>

          {/* Streak Display */}
          {hasStreak && (
            <AnimatedContent
              index={contentIndex++}
              reduceMotion={reduceMotion}
              visible={visible}
            >
              <View className='mt-4'>
                <StreakDisplay
                  reduceMotion={reduceMotion}
                  streak={habit.currentStreak!}
                />
              </View>
            </AnimatedContent>
          )}

          {/* Stats Row */}
          {hasStats && (
            <AnimatedContent
              index={contentIndex++}
              reduceMotion={reduceMotion}
              visible={visible}
            >
              <View className='mt-4'>
                <StatsRow
                  bestStreak={habit.bestStreak}
                  completionRate={habit.completionRate}
                  totalCompletions={habit.totalCompletions}
                />
              </View>
            </AnimatedContent>
          )}

          {/* Quick Reflection */}
          <AnimatedContent
            index={contentIndex++}
            reduceMotion={reduceMotion}
            visible={visible}
          >
            <View className='mt-4'>
              <QuickReflection
                showNoteInput
                compact={false}
                note={localNote}
                reduceMotion={reduceMotion}
                sectionIndex={contentIndex}
                selectedEmoji={localEmoji}
                shouldAnimate={false}
                onEmojiSelect={handleEmojiSelect}
                onNoteChange={handleNoteChange}
                onSubmit={onReflectionSubmit}
              />
            </View>
          </AnimatedContent>

          {/* Capture This Feeling Section */}
          <AnimatedContent
            index={contentIndex++}
            reduceMotion={reduceMotion}
            visible={visible}
          >
            <View className='mt-4'>
              <Text className='mb-3 text-sm font-semibold text-stone-600'>
                Capture This Feeling
              </Text>
              <View className='gap-3'>
                <CapturePromptButton
                  isPremium
                  description='Record how you feel right now'
                  icon={<Mic className='text-stone-500' size={20} />}
                  label='Record Voice'
                  onPress={handleRecordVoice}
                />
                <CapturePromptButton
                  isPremium
                  description='Write to your future self'
                  icon={<Mail className='text-stone-500' size={20} />}
                  label='Write Letter'
                  onPress={handleWriteLetter}
                />
              </View>
            </View>
          </AnimatedContent>

          {/* Science tip */}
          <AnimatedContent
            index={contentIndex++}
            reduceMotion={reduceMotion}
            visible={visible}
          >
            <View className='mt-4 rounded-xl bg-stone-100 p-3'>
              <Text className='text-center text-xs italic text-stone-600'>
                💡 BJ Fogg (Stanford): Celebration immediately after a behavior
                is the most powerful way to wire a new habit.
              </Text>
            </View>
          </AnimatedContent>
        </ScrollView>

        {/* Bottom action - Done button */}
        <View
          className='border-t border-emerald-100 bg-white px-4 pt-4'
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <AnimatedContent
            index={contentIndex++}
            reduceMotion={reduceMotion}
            visible={visible}
          >
            <DoneButton reduceMotion={reduceMotion} onPress={handleDone} />
          </AnimatedContent>
        </View>
      </View>
    </Modal>
  );
}

export default CelebrationScreen;
