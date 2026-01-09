/**
 * CompactButton - Compact variant of GenerateAffirmationsButton
 * For inline use in tighter spaces
 */

import React from 'react';
import { Text, Pressable, GestureResponderEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { Wand2, Crown, Check } from 'lucide-react-native';
import { clsx } from 'clsx';
import { SparkleAnimation } from './SparkleAnimation';
import type { AnimatedStyleProp, ViewStyle } from 'react-native-reanimated';

interface CompactButtonProps {
  isPremium: boolean;
  isGenerating: boolean;
  showSuccess: boolean;
  hasHabitContext: boolean;
  reduceMotion: boolean;
  animatedStyle: AnimatedStyleProp<ViewStyle>;
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
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
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
