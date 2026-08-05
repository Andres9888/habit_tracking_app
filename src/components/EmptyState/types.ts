import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export type EmptyStateVariant =
  | 'noHabits'
  | 'noData'
  | 'noResults'
  | 'premiumLocked';

export type EmptyStateSize = 'default' | 'compact';
export type EmptyStateScale = 'hero' | 'section' | 'inline';

export interface QuickStartTemplate {
  emoji: string;
  name: string;
  duration?: string;
}

export interface EmptyStateProps {
  variant?: EmptyStateVariant;
  size?: EmptyStateSize;
  scale?: EmptyStateScale;
  icon?: string | ReactNode;
  iconBackplate?: ViewStyle;
  headline?: string;
  description?: string;
  actionSlot?: ReactNode;
  ctaLabel?: string;
  onCTA?: () => void;
  onQuickStart?: (template: QuickStartTemplate) => void;
  hideCTA?: boolean;
  style?: ViewStyle;
}

export interface VariantConfig {
  icon: string;
  headline: string;
  description: string;
  ctaLabel: string;
}
