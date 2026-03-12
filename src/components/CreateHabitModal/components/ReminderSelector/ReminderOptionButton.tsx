/**
 * ReminderOptionButton component
 * V11 Task 8: Respects reduced motion preference
 */

import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { REMINDER_OPTIONS } from './constants';
import { useButtonAnimations } from './useButtonAnimations';
import type { ReminderOptionButtonProps } from './types';

function ReminderOptionButtonComponent({
  option,
  isSelected,
  onPress,
  reduceMotion,
}: ReminderOptionButtonProps) {
  const optionInfo = REMINDER_OPTIONS[option];
  const { scale, slide, handlePressIn, handlePressOut } =
    useButtonAnimations(reduceMotion);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: slide.value }],
  }));

  const accessibilityLabel = optionInfo.time
    ? `${optionInfo.label} at ${optionInfo.time}`
    : `${optionInfo.label}, no reminder`;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      className='flex-1'
      testID={`reminder-option-${option}`}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className='items-center justify-center rounded-xl px-2 py-3'
        style={[
          {
            backgroundColor: isSelected ? '#ECFDF5' : '#fafaf9',
            borderColor: isSelected ? '#10B981' : '#e7e5e4',
            borderWidth: isSelected ? 2 : 1,
            elevation: isSelected ? 2 : 0,
            shadowColor: '#1c1917',
            shadowOffset: { height: isSelected ? 2 : 0, width: 0 },
            shadowOpacity: isSelected ? 0.1 : 0,
            shadowRadius: isSelected ? 3 : 0,
          },
          animatedStyle,
        ]}
      >
        <Text className='mb-0.5 text-lg'>{optionInfo.emoji}</Text>
        <Text
          className='text-xs font-medium'
          style={{ color: isSelected ? '#047857' : '#78716c' }}
        >
          {optionInfo.label}
        </Text>
        {optionInfo.time ? <Text
            className='text-[10px]'
            style={{ color: isSelected ? '#047857' : '#a8a29e' }}
          >
            {optionInfo.time}
          </Text> : null}
      </Animated.View>
    </Pressable>
  );
}

export const ReminderOptionButton = memo(ReminderOptionButtonComponent);
