/**
 * NameInputSection - Heading and habit name input
 */

import { Keyboard, Text, TextInput, View } from 'react-native';
import { colors as themeTokens } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { buildTextInputHintProps } from '@/utils/textInputHintProps';

interface NameInputSectionProps {
  habitName: string;
  onHabitNameChange: (text: string) => void;
  onHabitNameBlur?: () => void;
  showNameError: boolean;
  autoFocus: boolean;
  themeColors: {
    text: { primary: string; tertiary: string };
    card: string;
    border: string;
  };
  isDark: boolean;
}

export function NameInputSection({
  habitName,
  onHabitNameChange,
  onHabitNameBlur,
  showNameError,
  autoFocus,
  themeColors,
  isDark,
}: NameInputSectionProps) {
  return (
    <View className='items-center' style={{ marginBottom: 40, marginTop: spacing.xl }}>
      <Text
        className='mb-6 text-center text-[22px] font-bold leading-tight'
        style={{ color: themeColors.text.primary }}
      >
        Name your new habit
      </Text>

      <TextInput
        accessibilityLabel='Habit name'
        autoFocus={autoFocus}
        className='w-full rounded-2xl border-2 px-5 py-4 text-center text-[22px] font-semibold'
        maxLength={50}
        returnKeyType='done'
        style={{
          lineHeight: 28,
          color: themeColors.text.primary,
          backgroundColor: isDark ? themeColors.card : '#FFFFFF',
          borderColor: showNameError ? themeTokens.error : themeColors.border,
        }}
        value={habitName}
        {...buildTextInputHintProps('e.g. Morning run', themeColors.text.tertiary)}
        onBlur={onHabitNameBlur}
        onChangeText={onHabitNameChange}
        onSubmitEditing={Keyboard.dismiss}
      />

      {showNameError ? (
        <Text
          accessibilityLiveRegion='polite'
          accessibilityRole='alert'
          className='mt-3 text-sm font-medium'
          style={{ color: themeTokens.error }}
        >
          Give your habit a name
        </Text>
      ) : null}
    </View>
  );
}
