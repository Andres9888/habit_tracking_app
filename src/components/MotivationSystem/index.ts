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

export * from './Workshop';
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
  type VisualizationData as ActivationVisualizationData,
} from './Activation';
export * from './Rescue';
