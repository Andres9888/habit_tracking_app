/**
 * Affirmation frequency types matching the schema
 */
export type AffirmationFrequency = 'daily' | 'weekly';

export interface ScheduleAffirmationDeliveryParams {
  /** The ID of the affirmation */
  affirmationId: string;
  /** The ID of the associated habit */
  habitId: string;
  /** The affirmation text to display */
  affirmationText: string;
  /** Time of day in "HH:MM" 24-hour format */
  scheduledTime: string;
  /** Delivery frequency */
  frequency: AffirmationFrequency;
  /** Days of week for weekly frequency (0=Sunday, 6=Saturday) */
  daysOfWeek?: number[];
  /** Skip permission check if already verified */
  skipPermissionCheck?: boolean;
}

export interface ScheduledAffirmationDelivery {
  notificationId: string;
  affirmationId: string;
  habitId: string;
  frequency: AffirmationFrequency;
  scheduledTime: Date | null;
  daysOfWeek?: number[];
}
