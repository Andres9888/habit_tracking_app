/**
 * NameInputSection - Shared habit-name heading + input for both Add and Edit.
 *
 * Theme-aware internally. Border shows the error color when invalid and the
 * primary color while focused (error takes precedence). Title and placeholder
 * are mode-driven props so create and edit can share one component.
 */

import { useState } from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useThemeColors } from '@/theme/ThemeContext';
import STRINGS from '@/constants/strings';
import { buildTextInputHintProps } from '@/utils/textInputHintProps';

interface NameInputSectionProps {
  habitName: string;
  onHabitNameChange: (text: string) => void;
  onHabitNameBlur?: () => void;
  /** Heading above the input (e.g. "Name your new habit" / "Edit your habit") */
  title?: string;
  /** Input placeholder text */
  placeholder?: string;
  showNameError?: boolean;
  autoFocus?: boolean;
}

// eslint-disable-next-line max-lines-per-function
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

  const borderColor = showNameError
    ? colors.status.error
    : isFocused
      ? colors.primary[500]
      : colors.border;

  const handleBlur = () => {
    setIsFocused(false);
    onHabitNameBlur?.();
  };

  return (
    <View
      className='items-center px-6'
      style={{ marginBottom: spacing['2xl'], marginTop: spacing.xl }}
    >
      <Text
        accessibilityRole='header'
        className='mb-6 text-center leading-tight'
        style={{ ...typography.heading2, color: colors.text.primary }}
      >
        {title}
      </Text>

      <TextInput
        accessibilityLabel='Habit name'
        autoFocus={autoFocus}
        className='w-full rounded-2xl border-2 px-5 py-4 text-center text-2xl font-semibold'
        maxLength={50}
        returnKeyType='done'
        style={{
          lineHeight: 28,
          color: colors.text.primary,
          backgroundColor: isDark ? colors.card : '#FFFFFF',
          borderColor,
        }}
        value={habitName}
        {...buildTextInputHintProps(placeholder, colors.text.tertiary)}
        onBlur={handleBlur}
        onChangeText={onHabitNameChange}
        onFocus={() => setIsFocused(true)}
        onSubmitEditing={Keyboard.dismiss}
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
