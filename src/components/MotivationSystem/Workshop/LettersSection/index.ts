/**
 * LettersSection Barrel Export
 * Letters to Self - Time-locked messages from past self to future self
 */

export { LettersSection } from './LettersSection';
export { LettersSection as default } from './LettersSection';

// Types
export type {
  LettersSectionProps,
  LetterSummary,
  LetterData,
  UnlockDurationOption,
} from './LettersSection.types';

// Constants (for consumers that need configuration values)
export { UNLOCK_DURATION_OPTIONS } from './LettersSection.constants';
