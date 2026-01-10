/**
 * Constants for EnhancedReminderSelector
 */

import type { ReminderPreset } from './types';

/** Default reminder presets matching Huberman phases */
export const DEFAULT_PRESETS: ReminderPreset[] = [
  { emoji: '🌅', hour: 7, id: 'morning', label: '7 AM', minute: 0 },
  { emoji: '☀️', hour: 12, id: 'midday', label: '12 PM', minute: 0 },
  { emoji: '🌙', hour: 20, id: 'evening', label: '8 PM', minute: 0 },
];
