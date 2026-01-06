/**
 * GenerateAffirmationsButton Component
 * AI-powered affirmation generation button for premium users
 *
 * Part of the Motivation System Workshop tab
 * Feature: AI-generated affirmations based on habit
 *
 * Scientific Basis:
 * - Personalized affirmations are more effective (Sherman & Cohen, 2006)
 * - Context-specific self-talk improves outcomes (Hatzigeorgiadis et al., 2011)
 * - Identity-based affirmations align with Atomic Habits methodology
 */

import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Sparkles, Wand2, Crown, Check } from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { SPRING_BUTTON } from '../../animations';

// Animation constants
const SPARKLE_DURATION = 1500;

export interface GeneratedAffirmation {
  text: string;
  type: 'identity' | 'motivational' | 'instructional';
}

export interface GenerateAffirmationsButtonProps {
  /** Whether user has premium access (AI generation is premium-only) */
  isPremium: boolean;
  /** Whether generation is currently in progress */
  isGenerating: boolean;
  /** Callback when generate is pressed */
  onGenerate: () => Promise<void>;
  /** Callback when user needs to upgrade to premium */
  onPremiumRequired: () => void;
  /** Whether to reduce motion for accessibility */
  reduceMotion?: boolean;
  /** Current number of affirmations (to show remaining slots) */
  currentCount?: number;
  /** Maximum allowed affirmations per habit */
  maxCount?: number;
  /** Variant: 'compact' for inline display, 'full' for standalone */
  variant?: 'compact' | 'full';
  /** Whether there's habit context available for better generation */
  hasHabitContext?: boolean;
}

/**
 * SparkleAnimation Component
 * Animated sparkle effect during generation
 */
function SparkleAnimation({
  reduceMotion = false,
}: {
  reduceMotion?: boolean;
}) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (reduceMotion) {
      rotation.value = 0;
      scale.value = 1;
      return;
    }

    // Continuous rotation
    rotation.value = withRepeat(
      withTiming(360, { duration: SPARKLE_DURATION }),
      -1,
      false
    );

    // Pulsing scale
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: SPARKLE_DURATION / 2 }),
        withTiming(1, { duration: SPARKLE_DURATION / 2 })
      ),
      -1,
      true
    );
  }, [reduceMotion, rotation, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    // Round rotation to avoid "Loss of precision during arithmetic conversion" error in Reanimated
    transform: [{ rotate: `${Math.round(rotation.value)}deg` }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Sparkles className='text-white' size={18} />
    </Animated.View>
  );
}

/**
 * GenerateAffirmationsButton - Main component
 *
 * Features:
 * - Premium gating with upgrade prompt
 * - Loading state with sparkle animation
 * - Success feedback
 * - Slot availability indicator
 * - Context-aware messaging (better results with more habit data)
 */
export function GenerateAffirmationsButton({
  isPremium,
  isGenerating,
  onGenerate,
  onPremiumRequired,
  reduceMotion = false,
  currentCount = 0,
  maxCount = 10,
  variant = 'full',
  hasHabitContext = false,
}: GenerateAffirmationsButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const scale = useSharedValue(1);

  const remainingSlots = maxCount - currentCount;
  const canGenerate = remainingSlots > 0 && !isGenerating;

  const handlePress = useCallback(async () => {
    if (!isPremium) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      onPremiumRequired();
      return;
    }

    if (!canGenerate) {
      if (remainingSlots <= 0) {
        Alert.alert(
          'Limit Reached',
          `You can have up to ${maxCount} affirmations per habit. Remove some to generate new ones.`
        );
      }
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await onGenerate();

      // Show success feedback
      setShowSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to generate affirmations:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      Alert.alert(
        'Generation Failed',
        error instanceof Error
          ? error.message
          : 'Unable to generate affirmations. Please try again.'
      );
    }
  }, [
    isPremium,
    canGenerate,
    remainingSlots,
    maxCount,
    onGenerate,
    onPremiumRequired,
  ]);

  const handlePressIn = useCallback(() => {
    if (!isGenerating) {
      scale.value = withSpring(0.95, SPRING_BUTTON);
    }
  }, [isGenerating, scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Compact variant for inline use
  if (variant === 'compact') {
    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          accessibilityHint={
            hasHabitContext
              ? 'Uses your habit details to create personalized affirmations'
              : 'Add more habit details for better personalized affirmations'
          }
          accessibilityLabel={
            isPremium
              ? 'Generate AI affirmations'
              : 'Upgrade to generate AI affirmations'
          }
          accessibilityRole='button'
          accessibilityState={{ disabled: isGenerating }}
          className={clsx(
            'flex-row items-center gap-1.5 rounded-full px-3 py-1.5',
            isPremium
              ? isGenerating
                ? 'bg-gradient-to-r from-violet-500 to-purple-500'
                : showSuccess
                  ? 'bg-emerald-500'
                  : 'bg-violet-500'
              : 'bg-stone-200'
          )}
          disabled={isGenerating}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {isGenerating ? (
            <SparkleAnimation reduceMotion={reduceMotion} />
          ) : showSuccess ? (
            <Check className='text-white' size={14} />
          ) : isPremium ? (
            <Wand2 className='text-white' size={14} />
          ) : (
            <Crown className='text-amber-500' size={14} />
          )}
          <Text
            className={clsx(
              'text-xs font-semibold',
              isPremium ? 'text-white' : 'text-stone-600'
            )}
          >
            {isGenerating
              ? 'Generating...'
              : showSuccess
                ? 'Added!'
                : isPremium
                  ? 'AI Generate'
                  : 'PRO'}
          </Text>
        </Pressable>
      </Animated.View>
    );
  }

  // Full variant with more context
  return (
    <View className='gap-2'>
      <Animated.View style={animatedStyle}>
        <Pressable
          accessibilityHint={
            hasHabitContext
              ? 'AI will use your habit details to create personalized affirmations'
              : 'Add your "why", identity, or visualization for better results'
          }
          accessibilityLabel={
            isPremium
              ? 'Generate personalized affirmations with AI'
              : 'Upgrade to premium for AI-generated affirmations'
          }
          accessibilityRole='button'
          accessibilityState={{ disabled: isGenerating || !canGenerate }}
          className={clsx(
            'flex-row items-center justify-center gap-2 rounded-xl py-3',
            isPremium
              ? isGenerating
                ? 'bg-gradient-to-r from-violet-400 to-purple-400'
                : showSuccess
                  ? 'bg-emerald-500'
                  : canGenerate
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500'
                    : 'bg-stone-300'
              : 'bg-stone-100'
          )}
          disabled={isGenerating || (isPremium && !canGenerate)}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {isGenerating ? (
            <>
              <SparkleAnimation reduceMotion={reduceMotion} />
              <Text className='font-semibold text-white'>
                Generating Affirmations...
              </Text>
            </>
          ) : showSuccess ? (
            <>
              <Check className='text-white' size={20} />
              <Text className='font-semibold text-white'>
                Affirmations Added!
              </Text>
            </>
          ) : isPremium ? (
            <>
              <Wand2 className='text-white' size={20} />
              <Text className='font-semibold text-white'>Generate with AI</Text>
            </>
          ) : (
            <>
              <Crown className='text-amber-500' size={20} />
              <Text className='font-semibold text-stone-600'>
                AI Generation
              </Text>
              <View className='rounded-full bg-amber-100 px-2 py-0.5'>
                <Text className='text-xs font-bold text-amber-700'>PRO</Text>
              </View>
            </>
          )}
        </Pressable>
      </Animated.View>

      {/* Context hint */}
      {isPremium && !isGenerating && !showSuccess && (
        <View className='flex-row items-start gap-1.5 px-1'>
          <Sparkles className='mt-0.5 text-violet-400' size={12} />
          <Text className='flex-1 text-xs text-stone-500'>
            {hasHabitContext
              ? 'AI will personalize affirmations based on your habit details'
              : 'Add your "why" or identity for more personalized results'}
          </Text>
        </View>
      )}

      {/* Slots remaining */}
      {isPremium && remainingSlots < 5 && remainingSlots > 0 && (
        <Text className='text-center text-xs text-stone-400'>
          {remainingSlots} slot{remainingSlots === 1 ? '' : 's'} remaining
        </Text>
      )}
    </View>
  );
}

export default GenerateAffirmationsButton;
