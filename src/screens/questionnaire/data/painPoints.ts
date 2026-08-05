/**
 * Pain point options for Step 2 of the questionnaire.
 */

import type { SelectOption } from '../questionnaire.types';

export const PAIN_POINT_OPTIONS: SelectOption[] = [
  { id: 'lose-motivation', emoji: '\u{1F614}', label: 'I lose motivation after a few days' },
  { id: 'too-busy', emoji: '\u{23F0}', label: 'I never have enough time' },
  { id: 'forget', emoji: '\u{1F9E0}', label: 'I just forget to do it' },
  { id: 'overwhelmed', emoji: '\u{1F62B}', label: 'I try to change too much at once' },
  { id: 'no-accountability', emoji: '\u{1F937}', label: 'No one holds me accountable' },
  { id: 'unsure-what', emoji: '\u{1F914}', label: "I'm not sure what habits to build" },
];
