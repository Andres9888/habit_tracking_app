/**
 * Constants for EnhancedReminderSelector
 */

import type { ReminderPreset } from './types';

/** Default reminder presets matching Huberman phases */
export const DEFAULT_PRESETS: ReminderPreset[] = [
  {
    emoji: '🌅',
    hour: 7,
    id: 'morning',
    label: 'Morning',
    minute: 0,
    time: '7:00 AM',
  },
  {
    emoji: '☀️',
    hour: 12,
    id: 'midday',
    label: 'Midday',
    minute: 0,
    time: '12:00 PM',
  },
  {
    emoji: '🌙',
    hour: 20,
    id: 'evening',
    label: 'Evening',
    minute: 0,
    time: '8:00 PM',
  },
];
