/**
 * MotivationSystem Components
 * A science-backed motivation toolkit for the Habit Details screen
 *
 * Architecture:
 * - Workshop: Components for the Motivation tab (setup)
 * - Activation: Components for pre-habit notification/modal
 * - Rescue: Components for streak-at-risk interventions
 * - Reward: Components for post-completion celebration
 */

// Workshop exports
export {
  YourWhySection,
  type YourWhySectionProps,
  IdentitySection,
  type IdentitySectionProps,
  CueTriggerSection,
  type CueTriggerSectionProps,
  type CueTriggerData,
  WOOPSection,
  type WOOPSectionProps,
  type WOOPData,
  DualVizSetup,
  type DualVizSetupProps,
  type VisualizationData,
  VisionBoardSection,
  type VisionBoardSectionProps,
  type VisionBoardImage,
  AffirmationsSection,
  type AffirmationsSectionProps,
  type AffirmationData,
  type AffirmationType,
  getRandomAffirmation,
  getRandomAffirmationByType,
  VoiceNotesSection,
  type VoiceNotesSectionProps,
  type VoiceNoteSummary,
  LettersSection,
  type LettersSectionProps,
  type LetterSummary,
} from './Workshop';

// Activation exports (rename VisualizationData to avoid conflict)
export {
  ActivationModal,
  type ActivationModalProps,
  type ActivationHabitData,
  MotivationCheck,
  shouldShowFailureViz,
  type MotivationCheckProps,
  type MotivationLevel,
  ContextAwareViz,
  type ContextAwareVizProps,
} from './Activation';
export type { VisualizationData as ActivationVisualizationData } from './Activation';

export * from './Rescue';
export * from './Reward';
