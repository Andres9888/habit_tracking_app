import { memo } from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { EmojiPicker } from './EmojiPicker';
import { ColorPickerSection } from './ColorPickerSection';
import { EnhancedReminderSelector } from './EnhancedReminderSelector';
import type { CreateHabitFormCenteredProps } from './CreateHabitFormCentered.types';

/**
 * Centered habit creation form with optional fields.
 * Follows "identity before behavior" in habit formation psychology.
 */
const CreateHabitFormCenteredComponent = ({
  habitName,
  onHabitNameChange,
  selectedEmoji,
  onEmojiSelect,
  colors,
  selectedColor,
  onColorSelect,
  reminderEnabled,
  reminderTime,
  onReminderToggle,
  onReminderTimeChange,
  onSubmit,
  autoFocus = false,
  showNameError = false,
}: CreateHabitFormCenteredProps) => {
  const { colors: themeColors, isDark } = useThemeColors();

  return (
    <View className='flex-1 px-6'>
      {/* Centered top section - name input */}
      <View
        className='items-center'
        style={{ marginBottom: 40, marginTop: 28 }}
      >
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
          placeholder='e.g., Read 20 minutes daily'
          placeholderTextColor={isDark ? themeColors.text.tertiary : colors.disabledText}
          returnKeyType='done'
          style={{
            lineHeight: 28,
            color: themeColors.text.primary,
            backgroundColor: isDark ? themeColors.card : colors.text.inverse,
            borderColor: showNameError
              ? '#f87171'
              : isDark
                ? themeColors.border
                : themeColors.border,
          }}
          value={habitName}
          onChangeText={onHabitNameChange}
          onSubmitEditing={Keyboard.dismiss}
        />

        {/* Error message or character counter (only when typing) */}
        {showNameError ? (
          <Text
            accessibilityLiveRegion='polite'
            accessibilityRole='alert'
            className='mt-3 text-sm font-medium'
            style={{ color: colors.error }}
          >
            Give your habit a name (at least 2 characters)
          </Text>
        ) : habitName.length > 0 ? (
          <Text
            className='mt-3 text-xs'
            style={{ color: themeColors.text.tertiary }}
          >
            {habitName.length}/50 characters
          </Text>
        ) : (
          <Text
            className='mt-3 text-xs'
            style={{ color: themeColors.text.tertiary }}
          >
            Be specific — include when, how long, or where
          </Text>
        )}
      </View>

      {/* Optional fields section - scrollable */}
      <View className='flex-1'>
        {/* Section label */}
        <Text
          className='mb-8 text-center text-xs font-semibold'
          style={{ letterSpacing: 1, color: themeColors.text.tertiary }}
        >
          CUSTOMIZE
        </Text>

        {/* Emoji picker */}
        <EmojiPicker
          hideLabel
          habitName={habitName}
          selectedEmoji={selectedEmoji}
          onSelect={onEmojiSelect}
        />

        {/* Color picker - preset colors only, no custom color picker */}
        <ColorPickerSection
          hideLabel
          colors={colors}
          selectedColor={selectedColor}
          onSelectColor={onColorSelect}
        />

        {/* Reminder selector with presets and custom time */}
        <EnhancedReminderSelector
          enabled={reminderEnabled}
          reminderTime={reminderTime}
          onTimeChange={onReminderTimeChange}
          onToggle={onReminderToggle}
        />
      </View>
    </View>
  );
};

export const CreateHabitFormCentered = memo(CreateHabitFormCenteredComponent);
