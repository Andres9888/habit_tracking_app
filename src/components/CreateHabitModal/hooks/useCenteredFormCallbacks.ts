/**
 * useCenteredFormCallbacks Hook
 *
 * Provides memoized form callbacks for CreateHabitModalCentered.
 */

import { useCallback, type RefObject } from 'react';
import { Platform } from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';
import * as Haptics from 'expo-haptics';

interface FormState {
  setHabitName: (name: string) => void;
  setSelectedEmoji: (emoji: string | null) => void;
  setSelectedColor: (color: string) => void;
  setSelectedCategory: (category: string | undefined) => void;
  setRemindersEnabled: (enabled: boolean) => void;
  setReminderTime: (time: Date) => void;
}

interface UseCenteredFormCallbacksProps {
  form: FormState;
  setShowNameError: (show: boolean) => void;
  scrollViewRef: RefObject<ScrollViewType | null>;
  handleCreate: () => Promise<void>;
}

/**
 * Creates memoized form handlers for the centered habit creation modal.
 */
export function useCenteredFormCallbacks({
  form,
  setShowNameError,
  scrollViewRef,
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

  const handleCategorySelect = useCallback(
    (category: string | undefined) => {
      form.setSelectedCategory(category);
    },
    [form.setSelectedCategory]
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
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
        () => {}
      );
    }
  }, [setShowNameError]);

  const handleReminderToggle = useCallback(
    (enabled: boolean) => {
      form.setRemindersEnabled(enabled);
      // Auto-scroll to show reminder options when enabled
      if (enabled) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    },
    [form.setRemindersEnabled, scrollViewRef]
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
    handleCategorySelect,
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
