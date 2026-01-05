import { memo, useCallback } from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import { EmojiPicker } from './EmojiPicker';
import { ColorPickerSection } from './ColorPickerSection';
import { MinimalReminderToggle } from './MinimalReminderToggle';

interface CreateHabitFormCenteredProps {
  habitName: string;
  onHabitNameChange: (value: string) => void;
  selectedEmoji: string | null;
  onEmojiSelect: (emoji: string | null) => void;
  colors: readonly string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onCustomColorPress: () => void;
  reminderEnabled: boolean;
  reminderTime: string;
  onReminderToggle: (enabled: boolean) => void;
  onReminderTimePress?: () => void;
  onSubmit: () => void;
  autoFocus?: boolean;
}

/**
 * Centered habit creation form with optional fields
 *
 * Design Philosophy:
 * - Name input is required and prominently centered at top
 * - Optional fields (emoji, color, reminder) appear below in order of importance
 * - All fields are visible but emphasis is on the name
 * - Smart defaults reduce cognitive load while maintaining customization
 *
 * Field Order Rationale:
 * 1. Name - Core identity (required)
 * 2. Emoji - Visual identity (auto-suggested, optional)
 * 3. Color - Visual reinforcement (optional)
 * 4. Reminder - Behavioral nudge (optional)
 *
 * This follows "identity before behavior" in habit formation psychology.
 */
const CreateHabitFormCenteredComponent = ({
  habitName,
  onHabitNameChange,
  selectedEmoji,
  onEmojiSelect,
  colors,
  selectedColor,
  onColorSelect,
  onCustomColorPress,
  reminderEnabled,
  reminderTime,
  onReminderToggle,
  onReminderTimePress,
  onSubmit,
  autoFocus = false,
}: CreateHabitFormCenteredProps) => {
  const canSubmit = habitName.trim().length >= 2;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    Keyboard.dismiss();
    onSubmit();
  }, [canSubmit, onSubmit]);

  return (
    <View className='flex-1 px-6'>
      {/* Centered top section - name input */}
      <View
        className='items-center'
        style={{ marginBottom: 32, marginTop: 40 }}
      >
        <Text className='mb-3 text-center text-3xl font-bold text-stone-900'>
          What habit do you{'\n'}want to build?
        </Text>

        <TextInput
          autoFocus={autoFocus}
          className='w-full rounded-2xl border-2 border-stone-200 bg-white px-6 py-5 text-center text-xl text-stone-900'
          maxLength={50}
          placeholder='e.g., Read for 20 minutes'
          placeholderTextColor='#A8A29E'
          returnKeyType='done'
          value={habitName}
          onChangeText={onHabitNameChange}
          onSubmitEditing={handleSubmit}
        />

        {/* Character counter */}
        <Text className='mt-2 text-xs text-stone-400'>
          {habitName.length}/50 characters
        </Text>
      </View>

      {/* Optional fields section - scrollable */}
      <View className='flex-1'>
        {/* Section label */}
        <Text
          className='mb-4 text-center text-xs font-semibold text-stone-500'
          style={{ letterSpacing: 0.5 }}
        >
          CUSTOMIZE (OPTIONAL)
        </Text>

        {/* Emoji picker */}
        <EmojiPicker
          hideLabel
          habitName={habitName}
          selectedEmoji={selectedEmoji}
          onSelect={onEmojiSelect}
        />

        {/* Color picker */}
        <ColorPickerSection
          hideLabel
          colors={colors}
          selectedColor={selectedColor}
          onCustomPress={onCustomColorPress}
          onSelectColor={onColorSelect}
        />

        {/* Reminder toggle */}
        <MinimalReminderToggle
          enabled={reminderEnabled}
          time={reminderTime}
          onTimePress={onReminderTimePress}
          onToggle={onReminderToggle}
        />
      </View>
    </View>
  );
};

export const CreateHabitFormCentered = memo(CreateHabitFormCenteredComponent);
