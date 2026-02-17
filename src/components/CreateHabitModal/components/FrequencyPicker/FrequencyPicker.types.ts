/**
 * FrequencyPicker Types
 *
 * Defines the frequency configuration for habit scheduling.
 */

/** Available frequency types */
export type FrequencyType = 'daily' | 'specific_days' | 'x_per_week' | 'every_x_days';

/** Full frequency configuration */
export interface FrequencyConfig {
  /** The type of frequency schedule */
  type: FrequencyType;
  /** Days of week (0=Sun, 1=Mon, ..., 6=Sat) — used with 'specific_days' */
  daysOfWeek?: number[];
  /** Times per week — used with 'x_per_week' */
  timesPerWeek?: number;
  /** Interval in days — used with 'every_x_days' */
  intervalDays?: number;
}

export interface FrequencyPickerProps {
  /** Current frequency type string (stored in DB) */
  frequency: string;
  /** Current days of week selection */
  daysOfWeek: number[];
  /** Called when frequency changes */
  onFrequencyChange: (frequency: string) => void;
  /** Called when days of week change */
  onDaysOfWeekChange: (days: number[]) => void;
}
