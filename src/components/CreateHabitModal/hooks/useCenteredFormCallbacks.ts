/**
 * useCenteredFormCallbacks Hook
 *
 * Provides memoized form callbacks for CreateHabitModalCentered.
 */

import { useCallback, type RefObject } from 'react';
import type { ScrollView as ScrollViewType, View } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';
import { scrollToSectionInScrollView } from '@/utils/scrollToSectionInScrollView';

interface FormState {
  setHabitName: (name: string) => void;
  setSelectedEmoji: (emoji: string | null) => void;
  setSelectedColor: (color: string) => void;
  setRemindersEnabled: (enabled: boolean) => void;
  setReminderTime: (time: Date) => void;
}

interface UseCenteredFormCallbacksProps {
  form: FormState;
  setShowNameError: (show: boolean) => void;
  scrollViewRef: RefObject<ScrollViewType | null>;
  scrollContentRef: RefObject<View | null>;
  reminderSectionRef: RefObject<View | null>;
  handleCreate: () => Promise<void>;
}

/**
 * Creates memoized form handlers for the centered habit creation modal.
 */
export function useCenteredFormCallbacks({
  form,
  setShowNameError,
  scrollViewRef,
  scrollContentRef,
  reminderSectionRef,
  handleCreate,
}: UseCenteredFormCallbacksProps) {
  const handleEmojiSelect = useCallback(
    (emoji: string | null) => {
      form.setSelectedEmoji(emoji);
    },
    [form.setSelectedEmoji]
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      form.setSelectedColor(color);
    },
    [form.setSelectedColor]
  );

  const handleNameChange = useCallback(
    (value: string) => {
      form.setHabitName(value);
      // Clear error when user starts typing
      if (value.trim().length > 0) {
        setShowNameError(false);
      }
    },
    [form.setHabitName, setShowNameError]
  );

  const handleValidationError = useCallback(() => {
    setShowNameError(true);
    void triggerHaptic('warning');
  }, [setShowNameError]);

  const handleReminderToggle = useCallback(
    (enabled: boolean) => {
      void triggerHaptic('toggle');
      form.setRemindersEnabled(enabled);
      // Keep daily reminder anchored in view when expanding or collapsing.
      scrollToSectionInScrollView(
        scrollViewRef,
        scrollContentRef,
        reminderSectionRef
      );
    },
    [
      form.setRemindersEnabled,
      scrollViewRef,
      scrollContentRef,
      reminderSectionRef,
    ]
  );

  const handleReminderTimeChange = useCallback(
    (time: Date) => {
      form.setReminderTime(time);
    },
    [form.setReminderTime]
  );

  const handleSubmit = useCallback(() => {
    void handleCreate();
  }, [handleCreate]);

  const handleSave = useCallback(() => {
    void handleCreate();
  }, [handleCreate]);

  return {
    handleColorSelect,
    handleEmojiSelect,
    handleNameChange,
    handleReminderTimeChange,
    handleReminderToggle,
    handleSave,
    handleSubmit,
    handleValidationError,
  };
}
