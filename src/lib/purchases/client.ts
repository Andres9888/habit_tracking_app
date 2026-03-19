/**
 * Internal RevenueCat client loading.
 * Lazily loads the native SDK so Expo Go boots without native module errors.
 */

import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

type PurchasesModule = typeof import('react-native-purchases');
type PurchasesClient = PurchasesModule['default'];

export type { PurchasesModule, PurchasesClient };

const mobileRevenueCatEnvKey = ['EXPO_PUBLIC_REVENUECAT', 'ANDROID_KEY'].join(
  '_'
);

export const API_KEYS = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '',
  mobile: process.env[mobileRevenueCatEnvKey] || '',
};

/** Shared mutable state — exported as object so mutations are visible across modules. */
export const state = {
  module: null as PurchasesModule | null,
  client: null as PurchasesClient | null,
  initialized: false,
};

export function isExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

export function getPurchasesClient(): PurchasesClient | null {
  if (Platform.OS === 'web' || isExpoGo()) {
    return null;
  }

  if (state.client) {
    return state.client;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const loaded = require('react-native-purchases') as PurchasesModule;
    state.module = loaded;
    state.client = loaded.default;
    return state.client;
  } catch (error) {
    if (__DEV__) {
      console.warn('[Purchases] Native SDK unavailable:', error);
    }
    return null;
  }
}
