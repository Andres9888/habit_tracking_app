/**
 * PremiumPaywall Types
 *
 * Unified paywall component supporting three variants:
 * - motivation: Full-screen blur overlay for motivation features (was MotivationPaywall)
 * - benefits: Page-sheet educational modal for premium benefits (was PremiumBenefitsModal)
 * - analytics: Full-screen blur overlay for analytics features (was PremiumAnalyticsPaywall)
 */

import type { LucideIcon } from 'lucide-react-native';

export type PaywallVariant = 'motivation' | 'benefits' | 'analytics';

export interface PremiumPaywallProps {
  /** Which variant to render */
  variant: PaywallVariant;

  /** Whether the paywall is visible */
  visible: boolean;

  /** Callback when user closes the paywall */
  onClose: () => void;

  /** Callback when user wants to start trial/purchase. Returns true if successful. */
  onStartTrial: () => void | Promise<boolean>;

  /** Callback for restoring purchases */
  onRestorePurchases?: () => Promise<boolean>;

  /** Which feature triggered the paywall (for analytics and highlighting) */
  triggeredByFeature?: string;

  /** Whether to reduce motion for accessibility */
  reduceMotion?: boolean;

  /** Test ID for testing */
  testID?: string;
}

/** Feature item for motivation/benefits variants (lucide icons) */
export interface MotivationFeatureItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon: LucideIcon;
  accentColor?: string;
  freeLimit?: string;
  premiumValue?: string;
  scienceFact?: string;
}

/** Feature item for analytics variant */
export interface AnalyticsFeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Variant configuration */
export interface VariantConfig {
  presentation: 'blur-overlay' | 'page-sheet';
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  showPricingToggle: boolean;
  showSocialProof: boolean;
  gradientColors: readonly [string, string];
}
