/**
 * RevenueCatPaywall type definitions
 */

import type { PurchasesPackage } from 'react-native-purchases';

export interface PaywallFeature {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

export type PlanType = 'monthly' | 'annual';

export interface PaywallPlanCardProps {
  type: PlanType;
  pkg: PurchasesPackage | null;
  isSelected: boolean;
  savingsPercent: number | null;
  onSelect: () => void;
}

export interface PaywallCTAProps {
  isProcessing: boolean;
  isDisabled: boolean;
  label: string;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  buttonAnimatedStyle: object;
}
