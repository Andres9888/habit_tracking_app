/**
 * RevenueCat initialization and user lifecycle management.
 */

import { Platform } from 'react-native';
import { getPurchasesClient, state } from './client';
import { getPurchasesInitializationContext } from './getPurchasesInitializationContext';

let initializationPromise: Promise<boolean> | null = null;
let identityQueue: Promise<void> = Promise.resolve();
// undefined means this module did not perform the SDK configuration (for
// example after Fast Refresh); null means it configured an anonymous user.
let configuredUserId: string | null | undefined;

export function initializePurchases(userId?: string): Promise<boolean> {
  if (Platform.OS === 'web') return Promise.resolve(false);
  if (state.initialized) return Promise.resolve(true);

  if (!initializationPromise) {
    initializationPromise = performInitialization(userId).finally(() => {
      // A failed attempt must not poison every later sign-in attempt.
      initializationPromise = null;
    });
  }

  return initializationPromise;
}

async function performInitialization(userId?: string): Promise<boolean> {
  const initializationContext = getPurchasesInitializationContext();
  if (!initializationContext) return false;

  try {
    initializationContext.client.configure({
      apiKey: initializationContext.apiKey,
      appUserID: userId,
    });
    state.initialized = true;
    configuredUserId = userId ?? null;
    return true;
  } catch (error) {
    if (__DEV__) {
      console.error('[Purchases] Failed to initialize:', error);
    }
    return false;
  }
}

export function identifyUser(userId: string): Promise<void> {
  return enqueueIdentityTransition(async () => {
    const initialized = await initializePurchases(userId);
    if (!initialized || configuredUserId === userId) return;

    const client = getPurchasesClient();
    if (!client) return;

    try {
      await client.logIn(userId);
      configuredUserId = userId;
    } catch (error) {
      if (__DEV__) {
        console.error('[Purchases] Failed to identify user:', error);
      }
    }
  });
}

export function logoutPurchases(): Promise<void> {
  return enqueueIdentityTransition(async () => {
    if (Platform.OS === 'web' || !state.initialized) return;
    if (configuredUserId === null) return;

    const client = getPurchasesClient();
    if (!client) return;

    try {
      await client.logOut();
      configuredUserId = null;
    } catch (error) {
      if (__DEV__) {
        console.error('[Purchases] Failed to logout:', error);
      }
    }
  });
}

function enqueueIdentityTransition(task: () => Promise<void>): Promise<void> {
  const nextTransition = identityQueue.then(task, task);
  // Keep the queue usable even if a future transition stops handling its own
  // error. The caller still receives the original transition promise.
  identityQueue = nextTransition.catch(() => {});
  return nextTransition;
}

export function isPurchasesAvailable(): boolean {
  return state.initialized && getPurchasesClient() !== null;
}
