/**
 * ModalContent - Main scrollable content for Create Habit modal
 * Per spec: Bold 34px title, no live preview, unified CUSTOMIZE section
 */

import { ScrollView, Text } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { HabitNameField } from './HabitNameField';
import { HeroTitle } from './HeroTitle';
import { EmojiPicker } from './EmojiPicker';
import { ColorPickerSection } from './ColorPickerSection';
import { EnhancedReminderSelector } from './EnhancedReminderSelector';
import { HABIT_COLORS } from '../constants';
import type { ModalContentProps } from './ModalContent.types';

const STAGGER = 60;
const DURATION = 280;

export function ModalContent({
  isEditMode,
  visible,
  habitName,
  habitNameError,
  selectedEmoji,
  selectedColor,
  reminderOption,
  reminderTime,
  onNameChange,
  onNameBlur,
  onEmojiSelect,
  onColorSelect,
  onReminderToggle,
  onReminderTimeChange,
  onCustomColorPress,
  onScroll,
}: ModalContentProps) {
  return (
    <ScrollView
      className='flex-1 px-4'
      contentContainerStyle={{
        paddingBottom: isEditMode ? 32 : 160,
        paddingTop: 16,
      }}
      keyboardShouldPersistTaps='handled'
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
    >
      <Animated.View entering={FadeInDown.duration(DURATION).delay(100).springify().damping(18)}>
        <HeroTitle />
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(DURATION).delay(160).springify().damping(18)}>
        <HabitNameField
          autoFocus={visible && !isEditMode}
          error={habitNameError}
          value={habitName}
          onBlur={onNameBlur}
          onChange={onNameChange}
        />
      </Animated.View>

      <Animated.View
        className='mb-4 mt-8'
        entering={FadeInUp.duration(DURATION).delay(220).springify().damping(18)}
      >
        <Text
          className='text-center text-xs font-semibold text-stone-500'
          style={{ letterSpacing: 0.5 }}
        >
          CUSTOMIZE
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.duration(DURATION).delay(220 + STAGGER).springify().damping(18)}
      >
        <EmojiPicker
          habitName={habitName}
          selectedEmoji={selectedEmoji}
          onSelect={onEmojiSelect}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.duration(DURATION).delay(220 + STAGGER * 2).springify().damping(18)}
      >
        <ColorPickerSection
          hideLabel
          colors={HABIT_COLORS}
          selectedColor={selectedColor}
          onCustomPress={onCustomColorPress}
          onSelectColor={onColorSelect}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.duration(DURATION).delay(220 + STAGGER * 3).springify().damping(18)}
      >
        <EnhancedReminderSelector
          showNextReminder
          enabled={reminderOption !== 'none'}
          reminderTime={reminderTime}
          onTimeChange={onReminderTimeChange}
          onToggle={onReminderToggle}
        />
      </Animated.View>
    </ScrollView>
  );
}
