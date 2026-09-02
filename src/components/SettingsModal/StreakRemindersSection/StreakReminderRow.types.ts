export interface StreakReminderRowProps {
  enabled: boolean;
  reminderTime: string;
  onToggle: (value: boolean) => void | Promise<void>;
  onChangeTime: (time: string) => void | Promise<void>;
}
