
import { Keyboard, Text, TextInput, View } from 'react-native';
import { memo } from 'react';

import type { CreateHabitFormCenteredProps } from './CreateHabitFormCentered.types';
import { ColorPickerSection } from './ColorPickerSection';
import { EmojiPicker } from './EmojiPicker';
import { EnhancedReminderSelector } from './EnhancedReminderSelector';

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
  return (
    <View className='flex-1 px-6'>
      {/* Centered top section - name input */}
      <View
        className='items-center'
        style={{ marginBottom: 48, marginTop: 32 }}
      >
        <Text className='mb-6 text-center text-4xl font-bold leading-tight text-stone-900'>
          What habit do you want to build?
        </Text>

        <TextInput
          autoFocus={autoFocus}
          className={`w-full rounded-2xl border-2 bg-white px-6 py-6 text-center text-xl text-stone-900 ${
            showNameError ? 'border-red-400' : 'border-stone-200'
          }`}
          maxLength={50}
          placeholder='e.g., Read for 20 minutes'
          placeholderTextColor='#A8A29E'
          returnKeyType='done'
          value={habitName}
          onChangeText={onHabitNameChange}
          onSubmitEditing={Keyboard.dismiss}
        />

        {/* Error message or character counter */}
        {showNameError ? (
          <Text className='mt-3 text-xs font-medium text-red-500'>
            Please enter a habit name
          </Text>
        ) : (
          <Text className='mt-3 text-xs text-stone-400'>
            {habitName.length}/50 characters
          </Text>
        )}
      </View>

      {/* Optional fields section - scrollable */}
      <View className='flex-1'>
        {/* Section label */}
        <Text
          className='mb-8 text-center text-xs font-semibold text-stone-400'
          style={{ letterSpacing: 1 }}
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
