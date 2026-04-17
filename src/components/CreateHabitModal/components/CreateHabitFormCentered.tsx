import { memo } from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { NameInputSection } from './NameInputSection';
import { EmojiPicker } from './EmojiPicker';
import { ColorPickerSection } from './ColorPickerSection';
import { EnhancedReminderSelector } from './EnhancedReminderSelector';
import { AdvancedAlgorithmDisclosure } from '../../AlgorithmPicker';
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
  strengthAlgorithm,
  onStrengthAlgorithmChange,
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
          className='mb-3 text-center text-[13px] font-semibold uppercase'
          style={{ letterSpacing: 0.5, color: themeColors.text.tertiary }}
        >
          Choose an icon
        </Text>

        <EmojiPicker
          hideLabel
          habitName={habitName}
          selectedEmoji={selectedEmoji}
          onSelect={onEmojiSelect}
        />

        <Text
          className='mt-4 mb-3 text-center text-[13px] font-semibold uppercase'
          style={{ letterSpacing: 0.5, color: themeColors.text.tertiary }}
        >
          Pick a color
        </Text>

        <ColorPickerSection
          hideLabel
          colors={colors}
          selectedColor={selectedColor}
          onSelectColor={onColorSelect}
        />

        <EnhancedReminderSelector
          enabled={reminderEnabled}
          reminderTime={reminderTime}
          onTimeChange={onReminderTimeChange}
          onToggle={onReminderToggle}
        />

        <View className='mt-4'>
          <AdvancedAlgorithmDisclosure
            selected={strengthAlgorithm}
            onSelect={onStrengthAlgorithmChange}
          />
        </View>
      </View>
    </View>
  );
};

export const CreateHabitFormCentered = memo(CreateHabitFormCenteredComponent);
