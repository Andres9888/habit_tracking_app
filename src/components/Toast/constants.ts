/**
 * Toast Constants
 */

import { colors } from '../../theme/colors';
import type { ToastVariant, VariantConfig } from './types';

/** Variant configuration (icons, colors) */
export const VARIANT_CONFIG: Record<ToastVariant, VariantConfig> = {
  error: {
    backgroundColor: colors.error,
    icon: '✕',
    textColor: colors.text.inverse,
  },
  info: {
    backgroundColor: colors.secondary[500],
    icon: 'ℹ',
    textColor: colors.text.inverse,
  },
  success: {
    backgroundColor: colors.success,
    icon: '✓',
    textColor: colors.text.inverse,
  },
  undo: {
    backgroundColor: colors.gray[700],
    icon: '↶',
    textColor: colors.text.inverse,
  },
  warning: {
    backgroundColor: colors.warning[500],
    icon: '!',
    textColor: colors.text.inverse,
  },
};

/** Threshold for swipe to dismiss */
export const DISMISS_THRESHOLD = 50;
