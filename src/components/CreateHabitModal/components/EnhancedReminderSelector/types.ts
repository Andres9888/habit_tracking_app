/**
 * Type definitions for EnhancedReminderSelector
 */

export interface ReminderPreset {
  id: string;
  label: string;
  /** Optional time display string (e.g., "7:00 AM") */
  time?: string;
  emoji: string;
  hour: number;
  minute: number;
}

export interface EnhancedReminderSelectorProps {
  /** Whether reminders are enabled */
  enabled: boolean;
  /** Current reminder time as Date object */
  reminderTime: Date;
  /** Called when toggle is switched */
  onToggle: (enabled: boolean) => void;
  /** Called when time changes (preset or custom) */
  onTimeChange: (time: Date) => void;
  /** Optional custom presets (defaults to morning/midday/evening) */
  presets?: ReminderPreset[];
  /** Whether to show the next reminder badge (default: true) */
  showNextReminder?: boolean;
}

export interface PresetButtonProps {
  preset: ReminderPreset;
  isSelected: boolean;
  onPress: () => void;
  reduceMotion: boolean;
}
