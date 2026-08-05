/**
 * Props for the SuccessOverlay component
 */
export interface SuccessOverlayProps {
  /** Whether the overlay is visible */
  visible: boolean;
  /** Callback fired after the success animation completes */
  onAnimationComplete?: () => void;
}
