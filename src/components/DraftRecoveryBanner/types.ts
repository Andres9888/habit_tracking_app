import type { VariantKey } from './constants';

export interface DraftRecoveryBannerProps {
  /** Whether to show the banner */
  visible: boolean;
  /** Callback when user wants to discard the draft */
  onDiscard: () => void;
  /** Callback when banner is dismissed (user keeps draft) */
  onDismiss: () => void;
  /** Optional custom message */
  message?: string;
  /** Accent color variant */
  variant?: VariantKey;
}
