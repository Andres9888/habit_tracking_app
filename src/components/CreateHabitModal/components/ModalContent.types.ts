/**
 * Types for ModalContent
 */

import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export interface ModalContentProps {
  isEditMode: boolean;
  visible: boolean;
  // Form state
  habitName: string;
  selectedEmoji: string | null;
  selectedColor: string;
  reminderOption: string;
  reminderTime: Date;
  // Form handlers
  onNameChange: (value: string) => void;
  onEmojiSelect: (emoji: string | null) => void;
  onColorSelect: (color: string) => void;
  onReminderToggle: (enabled: boolean) => void;
  onReminderTimeChange: (time: Date) => void;
  onCustomColorPress: () => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}
