/**
 * Paywall feature data and constants
 */

import type { PurchasesPackage } from 'react-native-purchases';
import type { PaywallFeature } from './paywall.types';

export const PAYWALL_FEATURES: readonly PaywallFeature[] = [
  {
    description: 'Track as many habits as you want',
    emoji: '\u267E\uFE0F',
    id: 'unlimited',
    title: 'Unlimited Habits',
  },
  {
    description: 'Voice memos when motivation peaks',
    emoji: '\uD83C\uDFA4',
    id: 'voice',
    title: 'Unlimited Voice Notes',
  },
  {
    description: 'Pin inspiring images to each habit',
    emoji: '\uD83D\uDDBC\uFE0F',
    id: 'vision',
    title: 'Vision Board',
  },
  {
    description: 'Smart alerts when streaks are at risk',
    emoji: '\uD83D\uDEE1\uFE0F',
    id: 'rescue',
    title: 'Rescue Mode',
  },
  {
    description: 'See exactly what\u2019s working for you',
    emoji: '\uD83D\uDCCA',
    id: 'analytics',
    title: 'Premium Analytics',
  },
  {
    description: 'Huberman and science-backed habit bundles',
    emoji: '\uD83D\uDCE6',
    id: 'packs',
    title: 'Premium Habit Packs',
  },
  {
    description: 'Full Huberman-protocol visualization',
    emoji: '\uD83E\uDDE0',
    id: 'viz',
    title: 'Advanced Visualization',
  },
];

export const PAYWALL_HERO = {
  subtitle: 'Science-backed tools to make your habits unbreakable.',
  title: 'Unlock Your Full Potential',
} as const;

export function computeSavings(
  monthly: PurchasesPackage | null,
  annual: PurchasesPackage | null,
): number | null {
  if (!monthly || !annual) return null;
  const monthlyAnnualized = monthly.product.price * 12;
  const annualPrice = annual.product.price;
  if (monthlyAnnualized <= 0) return null;
  return Math.round(((monthlyAnnualized - annualPrice) / monthlyAnnualized) * 100);
}
