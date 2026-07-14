import { createContext } from 'react';

import type { UsePremiumReturn } from './types';

const unavailablePremium: UsePremiumReturn = {
  customerInfo: null,
  entitlementReady: false,
  error: null,
  expirationDate: null,
  isLoading: true,
  isLoadingOfferings: true,
  isPremium: false,
  isTrialActive: false,
  managementUrl: null,
  monthlyPackage: null,
  packages: null,
  priceString: null,
  purchasePackage: async () => false,
  refreshStatus: async () => {},
  restorePurchases: async () => false,
  status: 'loading',
};

export const PremiumContext =
  createContext<UsePremiumReturn>(unavailablePremium);
