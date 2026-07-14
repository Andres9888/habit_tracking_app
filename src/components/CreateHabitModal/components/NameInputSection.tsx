/**
 * NameInputSection - Shared habit-name heading + input for both Add and Edit.
 */

import { useState } from 'react';
import { Text, View } from 'react-native';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useThemeColors } from '@/theme/ThemeContext';
import STRINGS from '@/constants/strings';
import { HabitNameInputField } from './HabitNameInputField';
import { useFocusedGreenInputStyle } from './useFocusedGreenInputStyle';

interface NameInputSectionProps {
  habitName: string;
  onHabitNameChange: (text: string) => void;
  onHabitNameBlur?: () => void;
  title?: string;
  placeholder?: string;
  showNameError?: boolean;
  autoFocus?: boolean;
}

export function NameInputSection({
  habitName,
  onHabitNameChange,
  onHabitNameBlur,
  title = STRINGS.CREATE_HABIT.nameTitle,
  placeholder = STRINGS.CREATE_HABIT.namePlaceholder,
  showNameError = false,
  autoFocus = false,
}: NameInputSectionProps) {
  const { colors, isDark } = useThemeColors();
  const [isFocused, setIsFocused] = useState(false);
  const focusedInputStyle = useFocusedGreenInputStyle(
    isFocused,
    showNameError,
    colors.border
  );
  // "e.g." prefix + disabled-tier color keep the suggestion from reading as a
  // typed value (it sat next to "Give your habit a name" looking filled).
  const hintText = placeholder ? `e.g. ${placeholder}` : '';

  return (
    <View
      className='items-center px-6'
      style={{ marginBottom: spacing.lg, marginTop: spacing.base }}
    >
      <Text
        accessibilityRole='header'
        className='mb-5 text-center leading-tight'
        style={{ ...typography.heading2, color: colors.text.primary }}
      >
        {title}
      </Text>

      <HabitNameInputField
        autoFocus={autoFocus}
        backgroundColor={isDark ? colors.card : '#FFFFFF'}
        borderStyle={focusedInputStyle}
        habitName={habitName}
        hintColor={colors.gray[300]}
        placeholder={hintText}
        textColor={colors.text.primary}
        onBlur={() => {
          setIsFocused(false);
          onHabitNameBlur?.();
        }}
        onChangeText={onHabitNameChange}
        onFocus={() => setIsFocused(true)}
      />

      {showNameError ? (
        <Text
          accessibilityLiveRegion='polite'
          accessibilityRole='alert'
          className='mt-3 text-sm font-medium'
          style={{ color: colors.status.error }}
        >
          Give your habit a name
        </Text>
      ) : null}
    </View>
  );
}
