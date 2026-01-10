/**
 * PremiumAnalyticsPaywall Types
 */

export interface PremiumAnalyticsPaywallProps {
  onStartTrial?: () => void;
  onClose?: () => void;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}
