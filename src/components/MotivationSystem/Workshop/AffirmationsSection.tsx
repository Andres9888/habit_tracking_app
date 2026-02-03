/**
 * AffirmationsSection - Re-export for backwards compatibility
 *
 * @module AffirmationsSection
 * @see ./AffirmationsSection/AffirmationsSection.tsx
 */

export {
  AffirmationsSection,
  default,
} from './AffirmationsSection/AffirmationsSection';

export type {
  AffirmationData,
  AffirmationType,
  AffirmationFrequency,
  AffirmationScheduleConfig,
  AffirmationsSectionProps,
} from './AffirmationsSection/AffirmationsSection.types';

export {
  getRandomAffirmation,
  getRandomAffirmationByType,
} from './AffirmationsSection/AffirmationsSection.utils';
