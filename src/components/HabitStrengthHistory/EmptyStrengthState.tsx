import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Info, Zap } from 'lucide-react-native';

const SECTION_FADE_DURATION = 400;
const SECTION_SLIDE_DURATION = 400;
const SECTION_SLIDE_DELAY = 200;

interface EmptyStrengthStateProps {
  habitAgeDays: number;
  reduceMotion: boolean;
  onInfoPress?: () => void;
}

/**
 * Encouraging empty state shown when habit has no completions yet.
 */
export function EmptyStrengthState({
  habitAgeDays,
  reduceMotion,
  onInfoPress,
}: EmptyStrengthStateProps) {
  const entering = reduceMotion
    ? FadeIn.duration(SECTION_FADE_DURATION)
    : FadeInUp.duration(SECTION_SLIDE_DURATION).delay(SECTION_SLIDE_DELAY);

  const message =
    habitAgeDays <= 1
      ? 'Complete your first day to start building strength!'
      : 'Complete today to start building your habit strength!';

  return (
    <Animated.View
      accessible
      accessibilityLabel='Habit strength history - No completions yet'
      className='gap-4'
      entering={entering}
      testID='habit-strength-history-empty'
    >
      <View className='flex-row items-center justify-between'>
        <Text className='text-base font-semibold text-stone-700'>
          Strength History
        </Text>
        <Pressable
          accessible
          accessibilityLabel='Learn more about habit strength'
          accessibilityRole='button'
          hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
          testID='strength-history-info-button'
          onPress={onInfoPress}
        >
          <Info color='#78716c' size={18} />
        </Pressable>
      </View>

      <View className='items-center justify-center rounded-xl bg-stone-50 px-6 py-8'>
        <View className='mb-3 h-12 w-12 items-center justify-center rounded-full bg-amber-100'>
          <Zap color='#d97706' size={24} />
        </View>
        <Text className='mb-1 text-center text-base font-semibold text-stone-700'>
          Ready to Build Strength
        </Text>
        <Text className='text-center text-sm text-stone-500'>{message}</Text>
      </View>
    </Animated.View>
  );
}
