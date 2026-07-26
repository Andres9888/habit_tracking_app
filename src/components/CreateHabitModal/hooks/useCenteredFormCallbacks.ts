/**
 * useCenteredFormCallbacks Hook
 *
 * Provides memoized form callbacks for CreateHabitModalCentered.
 */

import { useCallback, type RefObject } from 'react';
import type { ScrollView as ScrollViewType, View } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';

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
  reminderSectionRef: RefObject<View | null>;
  scrollContentRef: RefObject<View | null>;
  handleCreate: () => Promise<void>;
}

/**
 * Creates memoized form handlers for the centered habit creation modal.
 */
export function useCenteredFormCallbacks({
  form,
  setShowNameError,
  scrollViewRef,
  reminderSectionRef,
  scrollContentRef,
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
      if (!enabled) return;
      // After the reminder section expands, align its top with the viewport
      // top so the user lands on it instead of the Advanced section below.
      setTimeout(() => {
        const node = reminderSectionRef.current;
        const contentNode = scrollContentRef.current;
        if (!node || !contentNode) return;
        // RN 0.81 Fabric: measureLayout accepts a HostInstance directly.
        // Passing findNodeHandle's number is rejected with "ref to a native
        // component" — pass the ref's current value instead.
        node.measureLayout(
          contentNode as any,
          (_x, y) => {
            scrollViewRef.current?.scrollTo({
              y: Math.max(0, y - 8),
              animated: true,
            });
          },
          () => {}
        );
      }, 250);
    },
    [
      form.setRemindersEnabled,
      scrollViewRef,
      reminderSectionRef,
      scrollContentRef,
    ]
  );

  const handleReminderTimeChange = useCallback(
    (time: Date) => {
      form.setReminderTime(time);
    },
    [form.setReminderTime]
  );

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
    handleValidationError,
  };
}
