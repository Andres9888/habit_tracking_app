/**
 * CompactButton - Compact variant of GenerateAffirmationsButton
 * For inline use in tighter spaces
 */

import React from 'react';
import type { ViewStyle } from 'react-native';
import { Text, Pressable, GestureResponderEvent } from 'react-native';

import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Wand2, Crown, Check } from 'lucide-react-native';
import { clsx } from 'clsx';

import { SparkleAnimation } from './SparkleAnimation';

interface CompactButtonProps {
  isPremium: boolean;
  isGenerating: boolean;
  showSuccess: boolean;
  hasHabitContext: boolean;
  reduceMotion: boolean;
  animatedStyle: AnimatedStyle<ViewStyle>;
  onPress: () => void;
  onPressIn: (event: GestureResponderEvent) => void;
  onPressOut: (event: GestureResponderEvent) => void;
}

export function CompactButton({
  isPremium,
  isGenerating,
  showSuccess,
  hasHabitContext,
  reduceMotion,
  animatedStyle,
  onPress,
  onPressIn,
  onPressOut,
}: CompactButtonProps) {
  const showGradient = isPremium && isGenerating;

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
            ? showSuccess
              ? 'bg-emerald-500'
              : 'bg-violet-500'
            : 'bg-stone-200'
        )}
        disabled={isGenerating}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {showGradient && (
          <LinearGradient
            className='absolute inset-0 rounded-full'
            colors={['#7c3aed', '#a855f7']}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
          />
        )}
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
