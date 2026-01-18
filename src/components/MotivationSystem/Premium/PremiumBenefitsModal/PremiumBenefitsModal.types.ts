/**
 * Type definitions for PremiumBenefitsModal
 */

export interface PremiumBenefitsModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when user wants to close the modal */
  onClose: () => void;
  /** Callback when user wants to start the trial/upgrade */
  onStartTrial: () => void;
  /** Which feature triggered the modal (for highlighting) */
  triggeredByFeature?: string;
  /** Whether to reduce motion for accessibility */
  reduceMotion?: boolean;
  /** Test ID for testing */
  testID?: string;
}
