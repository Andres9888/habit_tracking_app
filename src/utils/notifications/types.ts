export interface ScheduleHabitReminderParams {
  habitId: string;
  title: string;
  body: string;
  reminderTime: Date;
  skipPermissionCheck?: boolean;
}

export interface ScheduleLetterUnlockParams {
  /** The ID of the letter */
  letterId: string;
  /** The ID of the associated habit */
  habitId: string;
  /** Optional title for the letter (used in notification) */
  letterTitle?: string;
  /** Timestamp (ms) when the letter unlocks */
  unlockAt: number;
  /** Skip permission check if already verified */
  skipPermissionCheck?: boolean;
}

export interface ScheduledLetterNotification {
  notificationId: string;
  letterId: string;
  habitId: string;
  scheduledTime: Date | null;
}

export { type AffirmationFrequency } from './affirmations/types';
