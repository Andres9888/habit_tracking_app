/**
 * RevenueCat initialization and user lifecycle management.
 */

import { Platform } from 'react-native';
import { getPurchasesClient, state } from './client';
import { getPurchasesInitializationContext } from './getPurchasesInitializationContext';

export async function initializePurchases(userId?: string): Promise<boolean> {
  if (state.initialized) {
    return true;
  }

  const initializationContext = getPurchasesInitializationContext();
  if (!initializationContext) {
    return false;
  }

  try {
    initializationContext.client.configure({
      apiKey: initializationContext.apiKey,
      appUserID: userId,
    });
    state.initialized = true;
    return true;
  } catch (error) {
    if (__DEV__) {
      console.error('[Purchases] Failed to initialize:', error);
    }
    return false;
  }
}

export async function identifyUser(userId: string): Promise<boolean> {
  if (Platform.OS === 'web' || !state.initialized) {
    if (__DEV__ && Platform.OS !== 'web' && !state.initialized) {
      console.warn('[Purchases] SDK not initialized, skipping identify');
    }
    return false;
  }

  const client = getPurchasesClient();
  if (!client) {
    return false;
  }

  try {
    await client.logIn(userId);
    return true;
  } catch (error) {
    if (__DEV__) {
      console.error('[Purchases] Failed to identify user:', error);
    }
    return false;
  }
}

export async function logoutPurchases(): Promise<boolean> {
  if (Platform.OS === 'web' || !state.initialized) {
    return false;
  }

  const client = getPurchasesClient();
  if (!client) {
    return false;
  }

  try {
    await client.logOut();
    return true;
  } catch (error) {
    if (__DEV__) {
      console.error('[Purchases] Failed to logout:', error);
    }
    return false;
  }
}

export function isPurchasesAvailable(): boolean {
  return state.initialized && getPurchasesClient() !== null;
}
