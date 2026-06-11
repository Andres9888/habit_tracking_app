import type { ReactNode } from 'react';

export interface StreakRemindersSectionProps {
  highContrastMode: boolean;
  enabled: boolean;
  reminderTime: string;
  isPremium: boolean;
  icon?: ReactNode;
  onToggle: (value: boolean) => void | Promise<void>;
  onChangeTime: (time: string) => void | Promise<void>;
  onPremiumUpsell?: () => void;
  collapsible?: boolean;
  isExpanded?: boolean;
  onToggleSection?: () => void;
}
