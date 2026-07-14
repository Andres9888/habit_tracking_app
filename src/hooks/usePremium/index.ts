/**
 * usePremium Hook
 *
 * Manages premium subscription state via RevenueCat.
 * Provides purchase actions and subscription status.
 */

export { usePremium } from './usePremium';
export { PremiumProvider } from './Premium.provider';
export type {
  UsePremiumReturn,
  PremiumState,
  PremiumOfferings,
  PremiumActions,
  PremiumSubscriptionInfo,
  SubscriptionStatus,
} from './types';
