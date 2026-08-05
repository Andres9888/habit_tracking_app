/**
 * Type definitions for SimpleReminderSection
 */

export interface SimpleReminderSectionProps {
  onQuickTimeSelect: (date: Date) => void;
  onTimePress: () => void;
  onToggle: (value: boolean) => void;
  reminderTime: Date;
  remindersEnabled: boolean;
  disabled?: boolean;
}

export interface QuickTimeButtonProps {
  isSelected: boolean;
  label: string;
  onPress: () => void;
  time: string;
}

export interface QuickPreset {
  date: Date;
  label: string;
  time: string;
}
