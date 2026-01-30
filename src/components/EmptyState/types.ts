/**
 * EmptyState Type Definitions
 * Based on UX Specification Section 4.2 & Section 8.2
 */

import type { ViewStyle } from 'react-native';

export type EmptyStateVariant =
  | 'noHabits'
  | 'noData'
  | 'noResults'
  | 'premiumLocked';

/**
 * Quick start template for one-tap habit creation
 */
export interface QuickStartTemplate {
  emoji: string;
  name: string;
  duration?: string;
}

export interface EmptyStateProps {
  /** Variant type */
  variant?: EmptyStateVariant;

  /** Custom icon/emoji */
  icon?: string;

  /** Custom headline */
  headline?: string;

  /** Custom description */
  description?: string;

  /** CTA button label */
  ctaLabel?: string;

  /** CTA button handler */
  onCTA?: () => void;

  /** Quick start template handler (noHabits variant) */
  onQuickStart?: (template: QuickStartTemplate) => void;

  /** Hide CTA button */
  hideCTA?: boolean;

  /** Custom style */
  style?: ViewStyle;
}

export interface VariantConfig {
  icon: string;
  headline: string;
  description: string;
  ctaLabel: string;
}
