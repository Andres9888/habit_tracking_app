/**
 * SuccessCard Component
 *
 * The celebration card shown after habit creation
 * Uses react-native-reanimated (migrated from legacy Animated)
 */

import { Pressable, Text } from 'react-native';
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';

import type { SharedValue } from 'react-native-reanimated';

interface SuccessCardProps {
  cardOpacity: SharedValue<number>;
  cardScale: SharedValue<number>;
  iconScale: SharedValue<number>;
  textOpacity: SharedValue<number>;
  buttonOpacity: SharedValue<number>;
  buttonTranslateY: SharedValue<number>;
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
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    backgroundColor: selectedColor || '#DBEAFE',
    transform: [{ scale: iconScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  return (
    <Reanimated.View
      className='mx-8 items-center rounded-3xl bg-white px-8 py-10'
      style={[
        {
          shadowColor: '#1c1917',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        },
        cardStyle,
      ]}
    >
      {/* Animated Icon */}
      <Reanimated.View
        className='mb-6 h-24 w-24 items-center justify-center rounded-3xl'
        style={iconStyle}
      >
        <Text className='text-5xl'>{selectedEmoji || '🎯'}</Text>
      </Reanimated.View>

      {/* Success Text */}
      <Reanimated.View className='items-center' style={textStyle}>
        <Text className='mb-2 text-center text-2xl font-bold tracking-tight text-stone-800'>
          {habitName}
        </Text>
        <Text className='text-center text-lg text-stone-500'>created! 🎉</Text>
        <Text className='mt-4 text-center text-sm text-stone-400'>
          Your streak starts now
        </Text>
      </Reanimated.View>

      {/* CTA Button */}
      <Reanimated.View className='mt-8 w-full' style={buttonStyle}>
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
      </Reanimated.View>
    </Reanimated.View>
  );
};
