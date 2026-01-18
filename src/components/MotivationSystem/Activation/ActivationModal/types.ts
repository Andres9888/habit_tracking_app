/**
 * Habit data for display in the ActivationModal
 */
export interface ActivationHabitData {
  /** Habit ID for tracking */
  id: string;
  /** Habit name */
  name: string;
  /** Habit icon emoji */
  icon?: string;
  /** Current streak count */
  currentStreak?: number;
  /** Total completions */
  totalCompletions?: number;
  /** User's "why" statement */
  why?: string;
  /** WOOP plan (IF-THEN statement) */
  woopObstacle?: string;
  woopPlan?: string;
  /** Cue/trigger information */
  cueTime?: string;
  cueLocation?: string;
  cueAfterBehavior?: string;
  /** Visualization data (for ContextAwareViz) */
  vizSuccessBody?: string;
  vizSuccessMind?: string;
  vizSuccessEmotion?: string;
  vizFailureBody?: string;
  vizFailureMind?: string;
  vizFailureEmotion?: string;
}

export interface ActivationModalProps {
  /** Modal visibility */
  visible: boolean;
  /** Close modal callback */
  onClose: () => void;
  /** Habit data to display */
  habit: ActivationHabitData | null;
  /** Called when user taps "Start Now" */
  onStartNow?: () => void;
  /** Called when user taps "Snooze" */
  onSnooze?: () => void;
  /** Called when user taps "Just 2 Min" */
  onJustTwoMin?: () => void;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
}
