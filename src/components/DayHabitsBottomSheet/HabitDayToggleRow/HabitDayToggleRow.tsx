import { memo, useCallback, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { Checkbox } from './Checkbox';
import type { HabitDayToggleRowProps } from './types';
import { useToggleAnimations } from './useToggleAnimations';

/**
 * HabitDayToggleRow - A single habit row with toggle checkbox.
 *
 * Features:
 * - Displays habit emoji and name
 * - Animated checkbox toggle with spring animation
 * - Loading state with spinner
 * - Accessibility support with proper roles and labels
 */
function HabitDayToggleRowComponent({
  habit,
  isCompleted,
  onToggle,
  isLoading = false,
  reduceMotion = false,
}: HabitDayToggleRowProps) {
  const [isToggling, setIsToggling] = useState(false);

  const { scaleAnim, checkScaleAnim, animateCheckbox, animatePressEffect } =
    useToggleAnimations({ isCompleted, reduceMotion });

  const handlePress = useCallback(async () => {
    if (isLoading || isToggling) return;

    setIsToggling(true);
    animatePressEffect();
    animateCheckbox(!isCompleted);

    try {
      await onToggle();
    } catch (error) {
      if (__DEV__) console.error('Toggle habit failed:', error);
      // Revert optimistic UI on error
      animateCheckbox(isCompleted);
    } finally {
      setIsToggling(false);
    }
  }, [isLoading, isToggling, isCompleted, onToggle, animatePressEffect, animateCheckbox]);

  const accessibilityLabel = `${habit.name}, ${isCompleted ? 'completed' : 'not completed'}`;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        accessibilityHint='Double tap to toggle completion'
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='checkbox'
        accessibilityState={{
          checked: isCompleted,
          disabled: isLoading || isToggling,
        }}
        className='flex-row items-center gap-3 rounded-2xl bg-stone-50/80 px-4 py-3.5 active:bg-stone-100'
        disabled={isLoading || isToggling}
        onPress={handlePress}
      >
        <View className='h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm'>
          <Text className='text-[20px]'>{habit.icon || '🎯'}</Text>
        </View>

        <Text
          className='flex-1 text-[15px] font-medium text-stone-800'
          numberOfLines={1}
        >
          {habit.name}
        </Text>

        <Checkbox
          checkScaleAnim={checkScaleAnim}
          isCompleted={isCompleted}
          isLoading={isLoading || isToggling}
        />
      </Pressable>
    </Animated.View>
  );
}

export const HabitDayToggleRow = memo(HabitDayToggleRowComponent);
