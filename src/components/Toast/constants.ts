/**
 * Toast Constants
 */

import type { ToastVariant, VariantConfig } from './types';

/** Variant configuration (icons, colors) */
export const VARIANT_CONFIG: Record<ToastVariant, VariantConfig> = {
  error: {
    backgroundColor: '#EF4444',
    icon: '✕',
    textColor: '#FFFFFF',
  },
  info: {
    backgroundColor: '#3B82F6',
    icon: 'ℹ',
    textColor: '#FFFFFF',
  },
  success: {
    backgroundColor: '#10B981',
    icon: '✓',
    textColor: '#FFFFFF',
  },
  undo: {
    backgroundColor: '#374151',
    icon: '↶',
    textColor: '#FFFFFF',
  },
  warning: {
    backgroundColor: '#F59E0B',
    icon: '!',
    textColor: '#FFFFFF',
  },
};

/** Threshold for swipe to dismiss */
export const DISMISS_THRESHOLD = 50;
