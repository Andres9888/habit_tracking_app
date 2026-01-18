/**
 * Re-export from decomposed module for backwards compatibility
 */

// Import for default export

export {
  ReminderSelector,
  REMINDER_OPTIONS,
  REMINDER_OPTION_ORDER,
  getReminderTimeForOption,
  ReminderSelector as default,
} from './ReminderSelector/index';

export type {
  ReminderOption,
  ReminderOptionInfo,
  ReminderSelectorProps,
} from './ReminderSelector/index';
