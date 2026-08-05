/**
 * Toast Types
 */

import type { ViewStyle } from 'react-native';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning' | 'undo';

export interface ToastProps {
  /** Toast visibility */
  visible: boolean;
  /** Toast message */
  message: string;
  /** Toast variant */
  variant?: ToastVariant;
  /** Auto-dismiss duration in ms (0 = no auto-dismiss) */
  duration?: number;
  /** On dismiss callback */
  onDismiss?: () => void;
  /** Action button label (for undo variant) */
  actionLabel?: string;
  /** Action button handler (for undo variant) */
  onAction?: () => void;
  /** Custom style */
  style?: ViewStyle;
}

export interface VariantConfig {
  icon: string;
  backgroundColor: string;
  textColor: string;
}
