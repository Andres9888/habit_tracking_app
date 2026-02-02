/**
 * FullButton - Full variant of GenerateAffirmationsButton
 * Standalone use with context hints and slot indicators
 */

import React from 'react';
import { View, Text, Pressable, GestureResponderEvent, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';
import { clsx } from 'clsx';
import { ButtonContent } from './ButtonContent';

interface FullButtonProps {
  isPremium: boolean;
  isGenerating: boolean;
  showSuccess: boolean;
  canGenerate: boolean;
  hasHabitContext: boolean;
  reduceMotion: boolean;
  remainingSlots: number;
  animatedStyle: AnimatedStyle<ViewStyle>;
  onPress: () => void;
  onPressIn: (event: GestureResponderEvent) => void;
  onPressOut: (event: GestureResponderEvent) => void;
}

function getButtonClassName(
  isPremium: boolean,
  isGenerating: boolean,
  showSuccess: boolean,
  canGenerate: boolean
) {
  const base = 'flex-row items-center justify-center gap-2 rounded-xl py-3';
  if (!isPremium) return clsx(base, 'bg-stone-100');
  if (isGenerating)
    return clsx(base, 'bg-gradient-to-r from-violet-400 to-purple-400');
  if (showSuccess) return clsx(base, 'bg-emerald-500');
  if (canGenerate)
    return clsx(base, 'bg-gradient-to-r from-violet-500 to-purple-500');
  return clsx(base, 'bg-stone-300');
}

export function FullButton({
  isPremium,
  isGenerating,
  showSuccess,
  canGenerate,
  hasHabitContext,
  reduceMotion,
  remainingSlots,
  animatedStyle,
  onPress,
  onPressIn,
  onPressOut,
}: FullButtonProps) {
  const accessibilityHint = hasHabitContext
    ? 'AI will use your habit details to create personalized affirmations'
    : 'Add your "why", identity, or visualization for better results';
  const accessibilityLabel = isPremium
    ? 'Generate personalized affirmations with AI'
    : 'Upgrade to premium for AI-generated affirmations';

  return (
    <View className='gap-2'>
      <Animated.View style={animatedStyle}>
        <Pressable
          accessibilityHint={accessibilityHint}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole='button'
          accessibilityState={{ disabled: isGenerating || !canGenerate }}
          className={getButtonClassName(
            isPremium,
            isGenerating,
            showSuccess,
            canGenerate
          )}
          disabled={isGenerating || (isPremium && !canGenerate)}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <ButtonContent
            isGenerating={isGenerating}
            isPremium={isPremium}
            reduceMotion={reduceMotion}
            showSuccess={showSuccess}
            size='full'
          />
        </Pressable>
      </Animated.View>

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

      {isPremium && remainingSlots < 5 && remainingSlots > 0 && (
        <Text className='text-center text-xs text-stone-400'>
          {remainingSlots} slot{remainingSlots === 1 ? '' : 's'} remaining
        </Text>
      )}
    </View>
  );
}
