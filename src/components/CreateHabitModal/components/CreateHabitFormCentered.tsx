import { memo } from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { NameInputSection } from './NameInputSection';
import { EmojiPicker } from './EmojiPicker';
import { ColorPickerSection } from './ColorPickerSection';
import { FrequencySelector } from './FrequencySelector';
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
  frequency,
  selectedDays,
  onFrequencyChange,
  onDaysChange,
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
      <NameInputSection
        autoFocus={autoFocus}
        habitName={habitName}
        isDark={isDark}
        showNameError={showNameError}
        themeColors={themeColors}
        onHabitNameChange={onHabitNameChange}
      />

      {/* Optional fields section */}
      <View className='flex-1'>
        <Text
          className='mb-8 text-center text-xs font-semibold'
          style={{ letterSpacing: 1, color: themeColors.text.tertiary }}
        >
          CUSTOMIZE
        </Text>

        <EmojiPicker
          hideLabel
          habitName={habitName}
          selectedEmoji={selectedEmoji}
          onSelect={onEmojiSelect}
        />

        <ColorPickerSection
          hideLabel
          colors={colors}
          selectedColor={selectedColor}
          onSelectColor={onColorSelect}
        />

        <FrequencySelector
          frequency={frequency}
          selectedDays={selectedDays}
          onDaysChange={onDaysChange}
          onFrequencyChange={onFrequencyChange}
        />

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
