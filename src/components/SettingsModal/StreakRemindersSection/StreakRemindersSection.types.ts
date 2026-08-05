import type { ReactNode } from 'react';
import type { CompletionSoundType } from '../../../../convex/settings/types';

export interface StreakRemindersSectionProps {
  enabled: boolean;
  reminderTime: string;
  isPremium: boolean;
  icon?: ReactNode;
  onToggle: (value: boolean) => void | Promise<void>;
  onChangeTime: (time: string) => void | Promise<void>;
  onPremiumUpsell?: () => void;
  // Completion sound — spec 4a groups it with Reminders.
  completionSoundEnabled: boolean;
  completionSoundType: CompletionSoundType;
  onChangeCompletionSoundEnabled: (value: boolean) => void | Promise<void>;
  onChangeCompletionSoundType: (
    value: CompletionSoundType
  ) => void | Promise<void>;
}
