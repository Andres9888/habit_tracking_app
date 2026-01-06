/**
 * Activation Components - Motivation System
 * Pre-habit notification/modal components for habit activation
 *
 * Trigger: Notification at scheduled habit time or manual activation
 * Purpose: Prime user for habit execution with motivation content
 */

export {
  ActivationModal,
  type ActivationModalProps,
  type ActivationHabitData,
} from './ActivationModal';

export {
  MotivationCheck,
  shouldShowFailureViz,
  type MotivationCheckProps,
  type MotivationLevel,
} from './MotivationCheck';

export {
  ContextAwareViz,
  type ContextAwareVizProps,
  type VisualizationData,
} from './ContextAwareViz';
