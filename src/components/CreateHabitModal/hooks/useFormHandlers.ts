import { useCallback } from 'react';

interface FormState {
  setHabitName: (name: string) => void;
  setSelectedEmoji: (emoji: string | null) => void;
  setSelectedColor: (color: string) => void;
  setReminderOption: (option: string) => void;
  setReminderTime: (time: Date) => void;
  reminderTime: Date;
  reminderOption: string;
}

/**
 * Hook that creates memoized handlers for form field changes.
 * Encapsulates reminder time logic and phase detection.
 */
export function useFormHandlers(form: FormState) {
  const handleNameChange = useCallback(
    (value: string) => {
      form.setHabitName(value);
    },
    [form.setHabitName]
  );

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

  const handleReminderToggle = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        const hour = form.reminderTime.getHours();
        if (hour >= 5 && hour < 10) {
          form.setReminderOption('morning');
        } else if (hour >= 10 && hour < 16) {
          form.setReminderOption('midday');
        } else {
          form.setReminderOption('evening');
        }
      } else {
        form.setReminderOption('none');
      }
    },
    [form.reminderTime, form.setReminderOption]
  );

  const handleReminderTimeChange = useCallback(
    (time: Date) => {
      form.setReminderTime(time);
      if (form.reminderOption === 'none') {
        const hour = time.getHours();
        if (hour >= 5 && hour < 10) {
          form.setReminderOption('morning');
        } else if (hour >= 10 && hour < 16) {
          form.setReminderOption('midday');
        } else {
          form.setReminderOption('evening');
        }
      }
    },
    [form.reminderOption, form.setReminderTime, form.setReminderOption]
  );

  return {
    handleColorSelect,
    handleEmojiSelect,
    handleNameChange,
    handleReminderTimeChange,
    handleReminderToggle,
  };
}
