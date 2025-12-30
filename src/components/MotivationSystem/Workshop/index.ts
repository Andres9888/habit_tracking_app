/**
 * Workshop Components - Motivation System
 * Part of the Habit Details screen Motivation tab
 *
 * These components implement the science-backed motivation toolkit:
 * - YourWhySection: Self-Determination Theory (Deci & Ryan)
 * - IdentitySection: James Clear's identity-based habits
 * - CueTriggerSection: Implementation Intentions (Gollwitzer, 1999)
 * - WOOPSection: Mental Contrasting (Oettingen, 2014)
 * - DualVizSetup: Huberman Protocol for visualization
 * - VisionBoardSection: Visual motivation reinforcement
 * - AffirmationsSection: Self-affirmation theory (Steele, 1988)
 * - VoiceNotesSection: Audio emotional anchoring (premium)
 * - LettersSection: Temporal self-continuity (premium)
 */

export { YourWhySection, type YourWhySectionProps } from './YourWhySection';
export { IdentitySection, type IdentitySectionProps } from './IdentitySection';
export {
  CueTriggerSection,
  type CueTriggerSectionProps,
  type CueTriggerData,
} from './CueTriggerSection';
export {
  WOOPSection,
  type WOOPSectionProps,
  type WOOPData,
} from './WOOPSection';
export {
  DualVizSetup,
  type DualVizSetupProps,
  type VisualizationData,
} from './DualVizSetup';
export {
  VisionBoardSection,
  type VisionBoardSectionProps,
  type VisionBoardImage,
} from './VisionBoardSection';
export {
  AffirmationsSection,
  type AffirmationsSectionProps,
  type AffirmationData,
  type AffirmationType,
  getRandomAffirmation,
  getRandomAffirmationByType,
} from './AffirmationsSection';
export {
  VoiceNotesSection,
  type VoiceNotesSectionProps,
  type VoiceNoteSummary,
} from './VoiceNotesSection';
export {
  LettersSection,
  type LettersSectionProps,
  type LetterSummary,
} from './LettersSection';
