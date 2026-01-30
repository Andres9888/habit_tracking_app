/**
 * AffirmationScheduleModal Types
 * Type definitions for affirmation schedule configuration
 */

import type { AffirmationFrequency } from '../../../../utils/notifications';

export interface AffirmationScheduleData {
  scheduledTime?: string; // "HH:MM" 24-hour format
  frequency?: AffirmationFrequency;
  daysOfWeek?: number[];
  isScheduleEnabled?: boolean;
}

export interface AffirmationScheduleModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Close the modal */
  onClose: () => void;
  /** Save schedule configuration */
  onSave: (schedule: AffirmationScheduleData) => Promise<void>;
  /** Cancel/remove existing schedule */
  onCancel: () => Promise<void>;
  /** Initial schedule data */
  initialSchedule?: AffirmationScheduleData;
  /** Affirmation text (for preview) */
  affirmationText: string;
  /** Whether save is in progress */
  isSaving?: boolean;
}

export interface DaySelectorProps {
  selectedDays: number[];
  onToggleDay: (day: number) => void;
}

export interface FrequencySelectorProps {
  frequency: AffirmationFrequency;
  onSelect: (frequency: AffirmationFrequency) => void;
}
