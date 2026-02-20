/**
 * RevenueCat initialization and user lifecycle management.
 */

import { Platform } from 'react-native';
import { API_KEYS, getPurchasesClient, isExpoGo, state } from './client';

export async function initializePurchases(userId?: string): Promise<void> {
  if (state.initialized) {
    return;
  }

  if (Platform.OS === 'web') {
    return;
  }

  if (isExpoGo()) {
    if (__DEV__) {
      console.log(
        '[Purchases] Expo Go detected - native stores unavailable, skipping'
      );
    }
    return;
  }

  const client = getPurchasesClient();
  if (!client) {
    return;
  }

  const apiKey = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;
  if (!apiKey) {
    if (__DEV__) {
      console.warn(
        '[Purchases] No API key configured for platform:',
        Platform.OS
      );
    }
    return;
  }

  if (__DEV__ && state.module?.LOG_LEVEL?.VERBOSE !== undefined) {
    client.setLogLevel(state.module.LOG_LEVEL.VERBOSE);
  }

  try {
    client.configure({ apiKey, appUserID: userId });
    state.initialized = true;
  } catch (error) {
    if (__DEV__) {
      console.error('[Purchases] Failed to initialize:', error);
    }
  }
}

export async function identifyUser(userId: string): Promise<void> {
  if (Platform.OS === 'web' || !state.initialized) {
    if (__DEV__ && Platform.OS !== 'web' && !state.initialized) {
      console.warn('[Purchases] SDK not initialized, skipping identify');
    }
    return;
  }

  const client = getPurchasesClient();
  if (!client) {
    return;
  }

  try {
    await client.logIn(userId);
  } catch (error) {
    if (__DEV__) {
      console.error('[Purchases] Failed to identify user:', error);
    }
  }
}

export async function logoutPurchases(): Promise<void> {
  if (Platform.OS === 'web' || !state.initialized) {
    return;
  }

  const client = getPurchasesClient();
  if (!client) {
    return;
  }

  try {
    await client.logOut();
  } catch (error) {
    if (__DEV__) {
      console.error('[Purchases] Failed to logout:', error);
    }
  }
}

export function isPurchasesAvailable(): boolean {
  return state.initialized && getPurchasesClient() !== null;
}
