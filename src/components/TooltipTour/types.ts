/**
 * TooltipTour Types
 * 
 * Defines the onboarding tooltip tour system that guides first-time users
 * through key app features after creating their first habit.
 */

export interface TooltipStep {
  /** Unique identifier for this tooltip step */
  id: string;
  /** The message to display in the tooltip */
  message: string;
  /** Target element position (measured via onLayout) */
  targetRef?: { current: { measure: (callback: MeasureCallback) => void } | null };
  /** Position of the arrow/pointer */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Optional custom positioning override */
  position?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
}

export type MeasureCallback = (
  x: number,
  y: number,
  width: number,
  height: number,
  pageX: number,
  pageY: number
) => void;

export interface TooltipTourState {
  /** Current active step index (null if tour not active) */
  currentStepIndex: number | null;
  /** All tooltip steps in the tour */
  steps: TooltipStep[];
  /** Whether the tour is visible */
  isVisible: boolean;
}

export interface TooltipTourContextValue {
  /** Current state of the tooltip tour */
  state: TooltipTourState;
  /** Start the tooltip tour */
  startTour: (steps: TooltipStep[]) => void;
  /** Dismiss current tooltip and advance to next */
  nextStep: () => void;
  /** Dismiss the entire tour */
  dismissTour: () => void;
  /** Check if user has seen the tour */
  hasSeenTour: () => Promise<boolean>;
}
