/**
 * Paywall feature data and constants.
 *
 * Every bullet here has to name something the app actually ships and actually
 * gates. The previous list sold "Unlimited Voice Notes" and a "Vision Board"
 * that exist nowhere in the codebase, plus a "Rescue Mode" whose trigger hook
 * is never mounted — three of six promises a subscriber could not have
 * received. Beyond the refund and churn cost, shipping purchasable claims the
 * binary cannot honour is what App Review reads as misleading metadata.
 *
 * Rule for editing this file: if you cannot point at the gate that withholds a
 * bullet from a free user, it does not belong in the list.
 *
 * The list is deliberately short because the enforceable inventory is short.
 * Today the only gate that exists is the active-habit cap (create + unarchive,
 * both server-enforced). AnalyticsScreen and its export menu are fully built
 * but not mounted on any route, so neither can be sold yet; add those bullets
 * back the same day the screen ships behind `isPremiumUser`.
 */

import type { PurchasesPackage } from 'react-native-purchases';
import type { PaywallFeature } from './paywall.types';
import { FREE_HABIT_LIMIT } from '../../lib/premium/freeTier';

export const PAYWALL_FEATURES: readonly PaywallFeature[] = [
  {
    description: `Free covers ${FREE_HABIT_LIMIT} at a time — premium removes the cap`,
    emoji: '♾️',
    id: 'unlimited',
    title: 'Unlimited Habits',
  },
  {
    description: 'Track every area of your life at once, not three of them',
    emoji: '🌱',
    id: 'breadth',
    title: 'Every Area At Once',
  },
  {
    description: `Bring anything back from your archive without freeing a slot`,
    emoji: '🗃️',
    id: 'archive',
    title: 'Restore Any Time',
  },
];

export const PAYWALL_HERO = {
  subtitle: 'Room for every habit you want to build — and the ones you shelved.',
  title: 'Go Unlimited',
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
