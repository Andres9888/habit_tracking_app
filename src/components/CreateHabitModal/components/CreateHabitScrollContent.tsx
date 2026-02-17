import type { RefObject } from 'react';
import { Keyboard, Pressable, ScrollView } from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';
import { CreateHabitFormCentered } from './CreateHabitFormCentered';
import { HABIT_COLORS } from '../constants';
import type { useCenteredFormCallbacks } from '../hooks/useCenteredFormCallbacks';
import type { useHabitForm } from '../hooks/useHabitForm';

interface CreateHabitScrollContentProps {
  form: ReturnType<typeof useHabitForm>;
  callbacks: ReturnType<typeof useCenteredFormCallbacks>;
  scrollViewRef: RefObject<ScrollViewType | null>;
  showNameError: boolean;
}

export function CreateHabitScrollContent({
  form,
  callbacks,
  scrollViewRef,
  showNameError,
}: CreateHabitScrollContentProps) {
  return (
    <ScrollView
      ref={scrollViewRef}
      className='flex-1'
      contentContainerStyle={{ paddingBottom: 120 }}
      keyboardDismissMode='on-drag'
      keyboardShouldPersistTaps='handled'
      showsVerticalScrollIndicator={false}
    >
      <Pressable accessible={false} onPress={Keyboard.dismiss}>
        <CreateHabitFormCentered
          autoFocus
          colors={HABIT_COLORS}
          frequencyValue={form.frequencyValue}
          habitName={form.habitName}
          reminderEnabled={form.remindersEnabled}
          reminderTime={form.reminderTime}
          selectedColor={form.selectedColor}
          selectedEmoji={form.selectedEmoji}
          showNameError={showNameError}
          onColorSelect={callbacks.handleColorSelect}
          onEmojiSelect={callbacks.handleEmojiSelect}
          onFrequencyChange={form.setFrequencyValue}
          onHabitNameChange={callbacks.handleNameChange}
          onReminderTimeChange={callbacks.handleReminderTimeChange}
          onReminderToggle={callbacks.handleReminderToggle}
          onSubmit={callbacks.handleSubmit}
        />
      </Pressable>
    </ScrollView>
  );
}
