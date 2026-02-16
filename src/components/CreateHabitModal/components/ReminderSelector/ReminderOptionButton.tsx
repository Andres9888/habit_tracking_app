/**
 * ReminderOptionButton component
 * V11 Task 8: Respects reduced motion preference
 */

import { memo } from 'react';
import { Animated, Pressable, Text } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { REMINDER_OPTIONS } from './constants';
import { useButtonAnimations } from './useButtonAnimations';
import type { ReminderOptionButtonProps } from './types';

function ReminderOptionButtonComponent({
  option,
  isSelected,
  onPress,
  reduceMotion,
}: ReminderOptionButtonProps) {
  const { colors } = useThemeColors();
  const optionInfo = REMINDER_OPTIONS[option];
  const { scaleAnim, slideAnim, handlePressIn, handlePressOut } =
    useButtonAnimations(reduceMotion);

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
            backgroundColor: isSelected ? colors.success[50] : colors.selection.bgSubtle,
            borderColor: isSelected ? colors.selection.border : colors.border,
            borderWidth: isSelected ? 2 : 1,
            elevation: isSelected ? 2 : 0,
            shadowColor: colors.text.primary,
            shadowOffset: { height: isSelected ? 2 : 0, width: 0 },
            shadowOpacity: isSelected ? 0.1 : 0,
            shadowRadius: isSelected ? 3 : 0,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        <Text className='mb-0.5 text-lg'>{optionInfo.emoji}</Text>
        <Text
          className='text-xs font-medium'
          style={{ color: isSelected ? colors.primary[700] : colors.text.tertiary }}
        >
          {optionInfo.label}
        </Text>
        {optionInfo.time && (
          <Text
            className='text-[10px]'
            style={{ color: isSelected ? colors.primary[700] : colors.text.tertiary }}
          >
            {optionInfo.time}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export const ReminderOptionButton = memo(ReminderOptionButtonComponent);
