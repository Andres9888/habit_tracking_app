/**
 * MicrophonePermissionDenied Types
 */

export interface MicrophonePermissionDeniedProps {
  /** Whether the user can be asked again for permission (false if "Don't ask again" was selected) */
  canAskAgain: boolean;
  /** Callback when user taps "Try Again" */
  onTryAgain: () => void;
  /** Callback when user taps "Open Settings" */
  onOpenSettings: () => void;
  /** Whether to show a compact version */
  compact?: boolean;
  /** Custom error message to display */
  errorMessage?: string;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
}

export interface ActionButtonProps {
  label: string;
  icon: React.ElementType;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  accessibilityLabel: string;
  accessibilityHint?: string;
}
