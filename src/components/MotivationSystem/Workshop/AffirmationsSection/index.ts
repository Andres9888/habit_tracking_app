/**
 * AffirmationsSection barrel export
 * Positive self-talk cards for daily reinforcement
 */

export { AffirmationsSection, default } from './AffirmationsSection';
export type {
  AffirmationData,
  AffirmationType,
  AffirmationFrequency,
  AffirmationScheduleConfig,
  AffirmationsSectionProps,
} from './AffirmationsSection.types';
export {
  getRandomAffirmation,
  getRandomAffirmationByType,
} from './AffirmationsSection.utils';
