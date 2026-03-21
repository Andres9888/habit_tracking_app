/**
 * NameInputSection - Heading, name input, hint text & character counter
 */

import { Keyboard, Text, TextInput, View } from 'react-native';
import { colors as themeTokens } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { buildTextInputHintProps } from '@/utils/textInputHintProps';

interface NameInputSectionProps {
  habitName: string;
  onHabitNameChange: (text: string) => void;
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
  showNameError,
  autoFocus,
  themeColors,
  isDark,
}: NameInputSectionProps) {
  return (
    <View className='items-center' style={{ marginBottom: 40, marginTop: spacing.xl }}>
      <Text
        className='mb-6 text-center text-[28px] font-bold leading-tight'
        style={{ color: themeColors.text.primary }}
      >
        Name your new habit
      </Text>

      <TextInput
        accessibilityLabel='Habit name'
        autoFocus={autoFocus}
        className='w-full rounded-2xl border-2 px-5 py-4 text-center text-[22px] font-medium'
        maxLength={50}
        returnKeyType='done'
        style={{
          lineHeight: 28,
          color: themeColors.text.primary,
          backgroundColor: isDark ? themeColors.card : '#FFFFFF',
          borderColor: showNameError ? themeTokens.error : themeColors.border,
        }}
        value={habitName}
        {...buildTextInputHintProps('Name your habit', themeColors.text.tertiary)}
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
          Give your habit a name (at least 2 characters)
        </Text>
      ) : (
        <View className='mt-3 flex-row items-center justify-between self-stretch px-1'>
          <Text
            className='text-xs'
            style={{ color: themeColors.text.tertiary }}
          >
            Be specific — include when, how long, or where
          </Text>
          {habitName.length > 0 ? <Text
              className='text-xs'
              style={{ color: themeColors.text.tertiary }}
            >
              {habitName.length}/50
            </Text> : null}
        </View>
      )}
    </View>
  );
}
