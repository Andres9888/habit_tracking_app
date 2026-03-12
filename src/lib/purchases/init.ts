/**
 * RevenueCat initialization and user lifecycle management.
 */

import { Platform } from 'react-native';
import { getPurchasesClient, state } from './client';
import { getPurchasesInitializationContext } from './getPurchasesInitializationContext';

export async function initializePurchases(userId?: string): Promise<void> {
  if (state.initialized) {
    return;
  }

  const initializationContext = getPurchasesInitializationContext();
  if (!initializationContext) {
    return;
  }

  try {
    initializationContext.client.configure({
      apiKey: initializationContext.apiKey,
      appUserID: userId,
    });
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
