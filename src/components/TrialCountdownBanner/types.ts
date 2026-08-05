export interface TrialCountdownBannerProps {
  /** Number of days remaining in trial */
  daysRemaining: number;
  /** Callback when user taps the upgrade button */
  onUpgrade: () => void;
  /** Callback when user dismisses the banner */
  onDismiss?: () => void;
  /** Whether to show dismiss button (default: false for always-visible) */
  dismissible?: boolean;
}
