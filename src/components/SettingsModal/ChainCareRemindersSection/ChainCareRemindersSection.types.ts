import type { ReactNode } from 'react';

export interface ChainCareRemindersSectionProps {
  enabled: boolean;
  reminderTime: string;
  isPremium: boolean;
  icon?: ReactNode;
  onToggle: (value: boolean) => void | Promise<void>;
  onChangeTime: (time: string) => void | Promise<void>;
  onPremiumUpsell?: () => void;
}
