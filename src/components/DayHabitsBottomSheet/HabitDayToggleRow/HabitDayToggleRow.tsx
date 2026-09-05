/* eslint-disable max-lines-per-function */
import { memo, useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import { shadows } from '@/theme/spacing';

import { getEmojiAndName } from '@/components/DraggableHabit/DraggableHabit.hooks';

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
  const { colors: themeColors, isDark } = useThemeColors();
  const [isToggling, setIsToggling] = useState(false);

  const { scaleAnim, checkScaleAnim, animateCheckbox, animatePressEffect } =
    useToggleAnimations({ isCompleted, reduceMotion });

  const { name: displayName } = getEmojiAndName(habit.name);

  const handlePress = useCallback(async () => {
    if (isLoading || isToggling) return;

    setIsToggling(true);
    animatePressEffect();
    animateCheckbox(!isCompleted);

    try {
      await onToggle();
    } catch {
      animateCheckbox(isCompleted);
    } finally {
      setIsToggling(false);
    }
  }, [
    animateCheckbox,
    animatePressEffect,
    isCompleted,
    isLoading,
    isToggling,
    onToggle,
  ]);

  const accessibilityLabel = `${displayName}, ${isCompleted ? 'completed' : 'not completed'}`;

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  return (
    <Animated.View style={rowStyle}>
      <Pressable
        accessibilityHint='Double tap to toggle completion'
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='checkbox'
        accessibilityState={{
          checked: isCompleted,
          disabled: isLoading || isToggling,
        }}
        className='flex-row items-center gap-3 rounded-2xl px-4 py-3.5'
        style={{ backgroundColor: themeColors.background }}
        disabled={isLoading || isToggling}
        onPress={() => {
          void handlePress();
        }}
      >
        <View
          className='h-10 w-10 items-center justify-center rounded-xl border'
          style={[
            shadows.card,
            {
              backgroundColor: isDark ? themeColors.card : '#FFFFFF',
              borderColor: themeColors.cardBorder,
            },
          ]}
        >
          <Text className='text-xl'>{habit.icon || '🎯'}</Text>
        </View>

        <Text
          className='flex-1 text-base font-medium'
          style={{ color: themeColors.text.primary }}
          ellipsizeMode='tail'
          numberOfLines={2}
        >
          {displayName}
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
