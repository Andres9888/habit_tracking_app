/**
 * usePremium Hook
 *
 * Core hook for managing premium subscriptions via RevenueCat.
 * Orchestrates data fetching and purchase actions via sub-hooks.
 *
 * @example
 * const { isPremium, monthlyPackage, purchasePackage, priceString } = usePremium();
 *
 * if (!isPremium && monthlyPackage) {
 *   await purchasePackage(monthlyPackage);
 * }
 */

import { useContext } from 'react';

import { PremiumContext } from './PremiumContext';
import type { UsePremiumReturn } from './types';

export function usePremium(): UsePremiumReturn {
  return useContext(PremiumContext);
}
