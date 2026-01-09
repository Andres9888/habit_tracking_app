/**
 * Type definitions for MotivationPaywall component
 */

import type { MotivationPremiumFeature } from '../PremiumFeatureLock';

export interface MotivationPaywallProps {
  /**
   * Whether the paywall is visible
   */
  visible: boolean;

  /**
   * Callback when user closes the paywall
   */
  onClose: () => void;

  /**
   * Callback when user wants to start trial/purchase
   * Returns true if purchase was successful
   */
  onStartTrial: () => Promise<boolean>;

  /**
   * Callback for restoring purchases
   */
  onRestorePurchases?: () => Promise<boolean>;

  /**
   * Which feature triggered the paywall (for analytics and highlighting)
   */
  triggeredByFeature?: MotivationPremiumFeature;

  /**
   * Whether to reduce motion for accessibility
   */
  reduceMotion?: boolean;

  /**
   * Test ID for testing
   */
  testID?: string;
}

export interface FeatureCheckProps {
  icon: React.ComponentType<{ color: string; size: number }>;
  title: string;
  subtitle: string;
  isHighlighted: boolean;
  index: number;
  reduceMotion: boolean;
}

export interface PaywallFeature {
  icon: React.ComponentType<{ color: string; size: number }>;
  id: string;
  subtitle: string;
  title: string;
}
