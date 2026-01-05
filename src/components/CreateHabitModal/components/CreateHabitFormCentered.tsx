import { memo, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { EmojiPicker } from './EmojiPicker';
import { ColorPickerSection } from './ColorPickerSection';
import { ReminderSelector, type ReminderOption } from './ReminderSelector';
import STRINGS from '../../../constants/strings';

export interface CreateHabitFormCenteredProps {
  // Name field
  habitName: string;
  onHabitNameChange: (value: string) => void;

  // Emoji picker
  selectedEmoji: string | null;
  onEmojiSelect: (emoji: string | null) => void;

  // Color picker
  colors: readonly string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onCustomColorPress: () => void;

  // Reminder
  reminderOption: ReminderOption;
  onReminderOptionSelect: (option: ReminderOption) => void;

  // Form submission
  onSubmit: () => void;
  autoFocus?: boolean;
}

const MAX_HABIT_NAME_LENGTH = 50;
const MIN_HABIT_NAME_LENGTH = 2;

/**
 * Centered habit creation form component
 *
 * Layout structure:
 * 1. Centered heading (2 lines)
 * 2. Name input with character counter
 * 3. "CUSTOMIZE (OPTIONAL)" section label
 * 4. Emoji picker
 * 5. Color picker
 * 6. Reminder selector
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
  reminderOption,
  onReminderOptionSelect,
  onSubmit,
  autoFocus = true,
}: CreateHabitFormCenteredProps) => {
  const isSubmitEnabled = habitName.trim().length >= MIN_HABIT_NAME_LENGTH;

  const handleSubmitEditing = useCallback(() => {
    if (isSubmitEnabled) {
      onSubmit();
    }
  }, [isSubmitEnabled, onSubmit]);

  const handleNameChange = useCallback(
    (text: string) => {
      // Enforce character limit
      if (text.length <= MAX_HABIT_NAME_LENGTH) {
        onHabitNameChange(text);
      }
    },
    [onHabitNameChange]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 40 }}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        {/* Name Input Section */}
        <View className='mb-8 items-center'>
          {/* Heading - 2 lines, centered */}
          <Text
            accessibilityRole='header'
            className='mb-6 text-center text-3xl font-bold leading-tight text-stone-900'
          >
            What habit do you{'\n'}want to build?
          </Text>

          {/* Name Input */}
          <TextInput
            accessibilityHint='Enter the name of your new habit'
            accessibilityLabel='Habit name'
            autoCapitalize='sentences'
            autoCorrect
            autoFocus={autoFocus}
            className='w-full rounded-2xl bg-white px-5 py-4 text-center text-xl text-stone-900 shadow-sm'
            maxLength={MAX_HABIT_NAME_LENGTH}
            placeholder='e.g., Read for 20 minutes'
            placeholderTextColor='#a8a29e'
            returnKeyType='done'
            style={{
              borderColor: '#e7e5e4', // stone-200
              borderWidth: 1,
            }}
            testID='habit-name-input'
            value={habitName}
            onChangeText={handleNameChange}
            onSubmitEditing={handleSubmitEditing}
          />

          {/* Character Counter */}
          <Text
            accessibilityHint={`${habitName.length} of ${MAX_HABIT_NAME_LENGTH} characters used`}
            accessibilityRole='text'
            className='mt-2 text-xs text-stone-400'
          >
            {habitName.length}/{MAX_HABIT_NAME_LENGTH} characters
          </Text>
        </View>

        {/* Optional Section Label */}
        <View className='mb-4 items-center'>
          <Text
            accessibilityRole='text'
            className='text-xs font-semibold uppercase text-stone-500'
            style={{ letterSpacing: 0.5 }}
          >
            Customize (Optional)
          </Text>
        </View>

        {/* Emoji Picker */}
        <View className='mb-8'>
          <EmojiPicker
            habitName={habitName}
            selectedEmoji={selectedEmoji}
            onSelect={onEmojiSelect}
          />
        </View>

        {/* Color Picker */}
        <View className='mb-8'>
          <ColorPickerSection
            colors={colors}
            selectedColor={selectedColor}
            onCustomPress={onCustomColorPress}
            onSelectColor={onColorSelect}
          />
        </View>

        {/* Reminder Selector */}
        <View className='mb-5'>
          <ReminderSelector
            selectedOption={reminderOption}
            onSelectOption={onReminderOptionSelect}
          />
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View
        className='border-t border-stone-200 bg-white px-5 py-4'
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 4,
        }}
      >
        <Pressable
          accessibilityHint='Creates your new habit'
          accessibilityLabel={STRINGS.CREATE_HABIT.createAction}
          accessibilityRole='button'
          accessibilityState={{ disabled: !isSubmitEnabled }}
          className={`rounded-2xl py-4 ${
            isSubmitEnabled
              ? 'bg-stone-900'
              : 'bg-stone-200'
          }`}
          disabled={!isSubmitEnabled}
          testID='create-habit-button'
          onPress={onSubmit}
        >
          <Text
            className={`text-center text-base font-semibold ${
              isSubmitEnabled ? 'text-white' : 'text-stone-400'
            }`}
          >
            {STRINGS.CREATE_HABIT.createAction}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export const CreateHabitFormCentered = memo(CreateHabitFormCenteredComponent);
