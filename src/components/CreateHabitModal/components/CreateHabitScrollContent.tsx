/**
 * CreateHabitScrollContent - Scrollable content wrapper for habit creation form
 *
 * @description
 * Provides scrollable container for the habit form with keyboard handling.
 * Wraps CreateHabitFormCentered with proper scroll behavior and dismissal.
 *
 * @features
 * - Auto-scroll when keyboard appears
 * - Dismiss keyboard on drag
 * - Tap outside to dismiss keyboard
 * - Bottom padding for sticky elements
 *
 * @keyboard Handling
 * - `keyboardDismissMode='on-drag'`: Dismiss when user scrolls
 * - `keyboardShouldPersistTaps='handled'`: Allow taps on form fields
 * - Pressable wrapper: Tap background to dismiss
 *
 * @see {@link CreateHabitFormCentered} - Child form component
 * @see {@link CreateHabitModalCentered} - Parent modal component
 *
 * @module CreateHabitModal/components
 */

import type { RefObject } from 'react';
import { Keyboard, Pressable, ScrollView } from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';
import { CreateHabitFormCentered } from './CreateHabitFormCentered';
import { HABIT_COLORS } from '../constants';
import type { useCenteredFormCallbacks } from '../hooks/useCenteredFormCallbacks';
import type { useHabitForm } from '../hooks/useHabitForm';

interface CreateHabitScrollContentProps {
  /** Form state from useHabitForm */
  form: ReturnType<typeof useHabitForm>;
  /** Event callbacks from useCenteredFormCallbacks */
  callbacks: ReturnType<typeof useCenteredFormCallbacks>;
  /** Ref for programmatic scrolling (e.g., scroll to reminders) */
  scrollViewRef: RefObject<ScrollViewType | null>;
  /** Whether to show name validation error */
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
      <Pressable onPress={Keyboard.dismiss}>
        <CreateHabitFormCentered
          autoFocus
          colors={HABIT_COLORS}
          habitName={form.habitName}
          reminderEnabled={form.remindersEnabled}
          reminderTime={form.reminderTime}
          selectedColor={form.selectedColor}
          selectedEmoji={form.selectedEmoji}
          showNameError={showNameError}
          onColorSelect={callbacks.handleColorSelect}
          onEmojiSelect={callbacks.handleEmojiSelect}
          onHabitNameChange={callbacks.handleNameChange}
          onReminderTimeChange={callbacks.handleReminderTimeChange}
          onReminderToggle={callbacks.handleReminderToggle}
          onSubmit={callbacks.handleSubmit}
        />
      </Pressable>
    </ScrollView>
  );
}
