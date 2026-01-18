/**
 * Affirmations module exports
 *
 * Re-exports all helpers and types for use in the main affirmations.ts API file.
 */

// Types and constants
export {
  MAX_AFFIRMATIONS_PER_HABIT,
  MAX_TEXT_LENGTH,
  affirmationTypeValidator,
} from './types';
export type {
  AffirmationType,
  HabitContext,
  GeneratedAffirmation,
} from './types';

// Validators
export { isValidTimeFormat, isValidDaysOfWeek } from './validators';

// AI helpers
export { buildAffirmationPrompt } from './aiPrompt';
export { parseAffirmationsResponse } from './aiParser';

// Return type validators
export {
  basicAffirmationReturn,
  fullAffirmationReturn,
  generatedAffirmationReturn,
} from './returnTypes';
