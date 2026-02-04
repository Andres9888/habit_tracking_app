/**
 * Type definitions for MotivationPaywall component
 */

import type { MotivationPremiumFeature } from '../PremiumFeatureLock';

export type PlanType = 'yearly' | 'monthly';

export interface MotivationPaywallProps {
  onClose: () => void;
  onRestorePurchases?: () => Promise<boolean>;
  onStartTrial: (plan: PlanType) => Promise<boolean>;
  reduceMotion?: boolean;
  testID?: string;
  triggeredByFeature?: MotivationPremiumFeature;
  visible: boolean;
}

export interface FeatureCheckProps {
  icon: React.ComponentType<{ color: string; size: number }>;
  index: number;
  isHighlighted: boolean;
  reduceMotion: boolean;
  subtitle: string;
  title: string;
}

export interface PaywallFeature {
  icon: React.ComponentType<{ color: string; size: number }>;
  id: string;
  subtitle: string;
  title: string;
}
