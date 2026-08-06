/**
 * Goal options for Step 1 of the questionnaire.
 */

import type { SelectOption } from '../questionnaire.types';

export const GOAL_OPTIONS: SelectOption[] = [
  { id: 'health', emoji: '\u{1F3CB}', label: 'Get healthier', sublabel: 'Exercise, nutrition, sleep' },
  { id: 'productivity', emoji: '\u{1F680}', label: 'Be more productive', sublabel: 'Focus, habits, routines' },
  { id: 'mindfulness', emoji: '\u{1F9D8}', label: 'Reduce stress', sublabel: 'Meditation, journaling, calm' },
  { id: 'learning', emoji: '\u{1F4DA}', label: 'Learn something new', sublabel: 'Reading, skills, growth' },
  { id: 'relationships', emoji: '\u{1F91D}', label: 'Strengthen relationships', sublabel: 'Family, friends, community' },
  { id: 'finances', emoji: '\u{1F4B0}', label: 'Improve finances', sublabel: 'Saving, budgeting, investing' },
];
