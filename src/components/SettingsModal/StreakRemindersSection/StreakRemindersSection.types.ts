import type { ReactNode } from 'react';

export interface StreakRemindersSectionProps {
  enabled: boolean;
  reminderTime: string;
  icon?: ReactNode;
  onToggle: (value: boolean) => void | Promise<void>;
  onChangeTime: (time: string) => void | Promise<void>;
}
