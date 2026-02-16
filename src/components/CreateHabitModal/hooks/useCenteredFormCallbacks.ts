/**
 * useCenteredFormCallbacks - Memoized form event handlers
 *
 * @description
 * Provides memoized callbacks for user interactions in the modal.
 * Prevents unnecessary re-renders by using useCallback.
 *
 * @role Event Handler Provider
 * This hook creates stable callback references for:
 * - Name field changes (with error clearing)
 * - Emoji selection
 * - Color selection
 * - Reminder toggle (with auto-scroll)
 * - Reminder time changes
 * - Form submission
 * - Validation error handling (with haptics)
 *
 * @optimization
 * All callbacks are memoized with useCallback to prevent:
 * - Child component re-renders
 * - Lost focus in text inputs
 * - Animation jank
 *
 * @ux Enhancements
 * - Auto-scrolls to reminder section when enabled
 * - Clears name error when user starts typing
 * - Provides haptic feedback on validation errors
 *
 * @see {@link useHabitForm} - Form state these callbacks modify
 * @see {@link CreateHabitModalCentered} - Component that uses these
 *
 * @module CreateHabitModal/hooks
 */

import { useCallback, type RefObject } from 'react';
import { Platform } from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';
import * as Haptics from 'expo-haptics';

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
