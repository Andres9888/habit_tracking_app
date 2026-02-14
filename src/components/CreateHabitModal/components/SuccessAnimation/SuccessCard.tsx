/**
 * SuccessCard Component
 *
 * The celebration card shown after habit creation
 */

import { Animated, Pressable, Text, View } from 'react-native';
import { shadows } from '../../../../theme/spacing';

interface SuccessCardProps {
  cardOpacity: Animated.Value;
  cardScale: Animated.Value;
  iconScale: Animated.Value;
  textOpacity: Animated.Value;
  buttonOpacity: Animated.Value;
  buttonTranslateY: Animated.Value;
  selectedColor: string;
  selectedEmoji: string | null;
  habitName: string;
  onComplete: () => void;
}

export const SuccessCard = ({
  cardOpacity,
  cardScale,
  iconScale,
  textOpacity,
  buttonOpacity,
  buttonTranslateY,
  selectedColor,
  selectedEmoji,
  habitName,
  onComplete,
}: SuccessCardProps) => {
  return (
    <Animated.View
      className='mx-8 items-center rounded-3xl bg-white px-8 py-10'
      style={{
        opacity: cardOpacity,
        ...shadows.floatingActionButton,
        transform: [{ scale: cardScale }],
      }}
    >
      {/* Animated Icon */}
      <Animated.View
        className='mb-6 h-24 w-24 items-center justify-center rounded-3xl'
        style={{
          backgroundColor: selectedColor || '#DBEAFE',
          transform: [{ scale: iconScale }],
        }}
      >
        <Text className='text-5xl'>{selectedEmoji || '🎯'}</Text>
      </Animated.View>

      {/* Success Text */}
      <Animated.View className='items-center' style={{ opacity: textOpacity }}>
        <Text className='mb-2 text-center text-2xl font-bold tracking-tight text-stone-800'>
          {habitName}
        </Text>
        <Text className='text-center text-lg text-stone-500'>created! 🎉</Text>
        <Text className='mt-4 text-center text-sm text-stone-400'>
          Your streak starts now
        </Text>
      </Animated.View>

      {/* CTA Button */}
      <Animated.View
        className='mt-8 w-full'
        style={{
          opacity: buttonOpacity,
          transform: [{ translateY: buttonTranslateY }],
        }}
      >
        <Pressable
          accessibilityLabel='Start tracking habit'
          accessibilityRole='button'
          className='items-center rounded-2xl bg-stone-900 py-4'
          onPress={onComplete}
        >
          <Text className='text-base font-semibold text-white'>
            Let's get started! →
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};
