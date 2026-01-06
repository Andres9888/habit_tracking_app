/**
 * MotivationCheck Component
 * Pre-habit motivation level check with emoji selection
 *
 * Part of the Motivation System - Activation phase
 * Story T7.4: Create `MotivationCheck` component (emoji buttons)
 *
 * Scientific Basis:
 * - Andrew Huberman (Stanford) Dual Visualization Protocol
 * - Episode #55: "The Science of Setting & Achieving Goals"
 * - Key insight: Visualize FAILURE when unmotivated (fear moves you 2x better)
 * - Loss aversion (Kahneman & Tversky, Nobel Prize): Losses hurt 2x more than gains
 *
 * Logic:
 * - 😩 Not at all → Show FAILURE visualization
 * - 😐 Meh → Show FAILURE visualization
 * - 💪 Ready! → Show SUCCESS visualization
 */

import React, { useCallback, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { HelpCircle, Sparkles } from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';

/** Motivation level enum */
export type MotivationLevel = 'not_motivated' | 'meh' | 'ready';

export interface MotivationCheckProps {
  /** Currently selected motivation level */
  selectedLevel?: MotivationLevel;
  /** Callback when user selects a motivation level */
  onSelectLevel: (level: MotivationLevel) => void;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Whether to show the science explainer link */
  showExplainer?: boolean;
  /** Callback when user taps the explainer link */
  onExplainerPress?: () => void;
  /** Optional className for container styling */
  className?: string;
  /** Compact mode for inline display */
  compact?: boolean;
}

// Animation spring configs
const SPRING_BUTTON = { damping: 15, stiffness: 300 };
const SPRING_BOUNCY = { damping: 8, stiffness: 300 };

/**
 * Map motivation levels to accent colors
 */
function getAccentColor(level: MotivationLevel): 'rose' | 'amber' | 'emerald' {
  switch (level) {
    case 'not_motivated': {
      return 'rose';
    }
    case 'meh': {
      return 'amber';
    }
    case 'ready': {
      return 'emerald';
    }
  }
}

// Motivation level configuration
const MOTIVATION_OPTIONS: {
  level: MotivationLevel;
  emoji: string;
  label: string;
  showsFailure: boolean;
}[] = [
  {
    emoji: '😩',
    label: 'Not at all',
    level: 'not_motivated',
    showsFailure: true,
  },
  { emoji: '😐', label: 'Meh', level: 'meh', showsFailure: true },
  { emoji: '💪', label: 'Ready!', level: 'ready', showsFailure: false },
];

/**
 * Returns whether the selected motivation level should show failure visualization
 * Based on Huberman protocol: unmotivated users need fear/loss aversion
 */
export function shouldShowFailureViz(
  level: MotivationLevel | undefined
): boolean {
  if (!level) return false;
  const option = MOTIVATION_OPTIONS.find((opt) => opt.level === level);
  return option?.showsFailure ?? false;
}

/**
 * MotivationButton - Individual emoji button for motivation selection
 */
function MotivationButton({
  emoji,
  label,
  isSelected,
  onPress,
  reduceMotion = false,
  accentColor,
}: {
  emoji: string;
  label: string;
  isSelected: boolean;
  onPress: () => void;
  reduceMotion?: boolean;
  accentColor: 'rose' | 'amber' | 'emerald';
}) {
  const scale = useSharedValue(1);
  const selectionScale = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      selectionScale.value = isSelected ? 1 : 0;
    } else {
      selectionScale.value = isSelected
        ? withSequence(
            withSpring(1.15, SPRING_BOUNCY),
            withSpring(1, SPRING_BUTTON)
          )
        : withTiming(0, { duration: 150 });
    }
  }, [isSelected, reduceMotion, selectionScale]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, SPRING_BUTTON);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
  }, [scale]);

  const handlePress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const selectionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: selectionScale.value,
    transform: [{ scale: selectionScale.value }],
  }));

  // Dynamic accent colors based on motivation level
  const accentClasses = {
    amber: {
      label: 'font-medium text-amber-700',
      ring: 'bg-amber-100 border-2 border-amber-400',
    },
    emerald: {
      label: 'font-medium text-emerald-700',
      ring: 'bg-emerald-100 border-2 border-emerald-400',
    },
    rose: {
      label: 'font-medium text-rose-700',
      ring: 'bg-rose-100 border-2 border-rose-400',
    },
  };

  return (
    <Pressable
      accessibilityHint={
        accentColor === 'emerald'
          ? 'Selecting this will show success visualization'
          : 'Selecting this will show failure visualization to motivate you'
      }
      accessibilityLabel={`${label} motivation level`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className='items-center justify-center'
        style={animatedStyle}
      >
        {/* Selection ring */}
        <Animated.View
          className={clsx(
            'absolute h-16 w-16 rounded-full',
            accentClasses[accentColor].ring
          )}
          style={selectionAnimatedStyle}
        />
        {/* Emoji container */}
        <View
          className={clsx(
            'h-16 w-16 items-center justify-center rounded-full',
            isSelected ? '' : 'bg-stone-100'
          )}
        >
          <Text className='text-4xl'>{emoji}</Text>
        </View>
        {/* Label */}
        <Text
          className={clsx(
            'mt-2 text-xs',
            isSelected ? accentClasses[accentColor].label : 'text-stone-500'
          )}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

/**
 * MotivationCheck - Main component
 *
 * Asks "How motivated are you?" with 3 emoji options:
 * - 😩 Not at all (rose accent) → triggers failure visualization
 * - 😐 Meh (amber accent) → triggers failure visualization
 * - 💪 Ready! (emerald accent) → triggers success visualization
 *
 * Based on Huberman's insight that fear/loss aversion moves
 * unmotivated people 2x more effectively than positive motivation.
 */
export function MotivationCheck({
  selectedLevel,
  onSelectLevel,
  reduceMotion = false,
  showExplainer = true,
  onExplainerPress,
  className,
  compact = false,
}: MotivationCheckProps) {
  if (compact) {
    // Compact mode - just the emoji buttons in a row
    return (
      <View className={clsx('flex-row items-center justify-around', className)}>
        {MOTIVATION_OPTIONS.map((option) => (
          <MotivationButton
            key={option.level}
            accentColor={getAccentColor(option.level)}
            emoji={option.emoji}
            isSelected={selectedLevel === option.level}
            label={option.label}
            reduceMotion={reduceMotion}
            onPress={() => onSelectLevel(option.level)}
          />
        ))}
      </View>
    );
  }

  return (
    <View className={clsx('rounded-2xl bg-violet-50 p-4', className)}>
      {/* Header */}
      <View className='mb-4 flex-row items-center justify-between'>
        <View className='flex-row items-center gap-2'>
          <View className='h-8 w-8 items-center justify-center rounded-lg bg-violet-100'>
            <Sparkles className='text-violet-600' size={16} />
          </View>
          <Text className='font-semibold text-violet-800'>
            Motivation Check
          </Text>
        </View>
        {showExplainer && onExplainerPress && (
          <Pressable
            accessibilityLabel='Learn about motivation check'
            accessibilityRole='button'
            className='h-8 w-8 items-center justify-center rounded-lg'
            onPress={onExplainerPress}
          >
            <HelpCircle className='text-violet-400' size={18} />
          </Pressable>
        )}
      </View>

      {/* Question */}
      <Text className='mb-4 text-center text-base text-violet-700'>
        How motivated are you right now?
      </Text>

      {/* Emoji options */}
      <View className='flex-row items-center justify-around'>
        {MOTIVATION_OPTIONS.map((option) => (
          <MotivationButton
            key={option.level}
            accentColor={getAccentColor(option.level)}
            emoji={option.emoji}
            isSelected={selectedLevel === option.level}
            label={option.label}
            reduceMotion={reduceMotion}
            onPress={() => onSelectLevel(option.level)}
          />
        ))}
      </View>

      {/* Science hint */}
      {selectedLevel && selectedLevel !== 'ready' && (
        <View className='mt-4 rounded-xl bg-violet-100/50 p-3'>
          <Text className='text-center text-xs italic text-violet-600'>
            💡 Science tip: Visualizing consequences moves you 2x better when
            motivation is low
          </Text>
        </View>
      )}
    </View>
  );
}

export default MotivationCheck;
