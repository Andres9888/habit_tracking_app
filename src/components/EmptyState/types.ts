/**
 * EmptyState Type Definitions
 * Based on UX Specification Section 4.2 & Section 8.2
 */

import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export type EmptyStateVariant =
  | 'noHabits'
  | 'noData'
  | 'noResults'
  | 'premiumLocked';

/**
 * Size variant — `default` for full-screen empty states (icon 64px, flex:1),
 * `compact` for in-modal/in-section contexts (icon 34px, no flex).
 */
export type EmptyStateSize = 'default' | 'compact';

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

  /** Size variant — default fills screen, compact fits in modal/section */
  size?: EmptyStateSize;

  /** Custom icon — string for emoji, ReactNode for custom (e.g. lucide icon) */
  icon?: string | ReactNode;

  /** Optional styled backplate around the icon (sized container with bg + radius) */
  iconBackplate?: ViewStyle;

  /** Custom headline */
  headline?: string;

  /** Custom description */
  description?: string;

  /** Optional content rendered below description, above CTA — for tip cards, hint rows, inline action chips */
  actionSlot?: ReactNode;

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
