/**
 * PremiumAnalyticsPaywall Types
 */

import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

/** Valid Ionicons icon name */
export type IconName = ComponentProps<typeof Ionicons>['name'];

export interface PremiumAnalyticsPaywallProps {
  onStartTrial?: () => void;
  onClose?: () => void;
}

export interface FeatureItem {
  icon: IconName;
  title: string;
  description: string;
}
