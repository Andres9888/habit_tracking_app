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
    <View className="flex-1 px-6">
      {/* Centered top section - name input */}
      <View className="items-center" style={{ marginTop: 40, marginBottom: 32 }}>
        <Text className="text-3xl font-bold text-stone-900 mb-3 text-center">
          What habit do you{'\n'}want to build?
        </Text>

        <TextInput
          autoFocus={autoFocus}
          value={habitName}
          onChangeText={onHabitNameChange}
          placeholder="e.g., Read for 20 minutes"
          placeholderTextColor="#A8A29E"
          className="bg-white border-2 border-stone-200 rounded-2xl px-6 py-5 text-xl text-stone-900 text-center w-full"
          maxLength={50}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        {/* Character counter */}
        <Text className="text-xs text-stone-400 mt-2">
          {habitName.length}/50 characters
        </Text>
      </View>

      {/* Optional fields section - scrollable */}
      <View className="flex-1">
        {/* Section label */}
        <Text
          className="text-xs font-semibold text-stone-500 mb-4 text-center"
          style={{ letterSpacing: 0.5 }}
        >
          CUSTOMIZE (OPTIONAL)
        </Text>

        {/* Emoji picker */}
        <EmojiPicker
          selectedEmoji={selectedEmoji}
          onSelect={onEmojiSelect}
          habitName={habitName}
        />

        {/* Color picker */}
        <ColorPickerSection
          colors={colors}
          selectedColor={selectedColor}
          onSelectColor={onColorSelect}
          onCustomPress={onCustomColorPress}
        />

        {/* Reminder toggle */}
        <MinimalReminderToggle
          enabled={reminderEnabled}
          time={reminderTime}
          onToggle={onReminderToggle}
          onTimePress={onReminderTimePress}
        />
      </View>
    </View>
  );
};

export const CreateHabitFormCentered = memo(CreateHabitFormCenteredComponent);
