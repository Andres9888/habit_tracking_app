/**
 * RevenueCat SDK initialization and configuration
 *
 * This module handles:
 * - SDK initialization with platform-specific API keys
 * - User identification for cross-device sync
 * - Debug logging in development
 * - Expo Go detection (native stores unavailable)
 *
 * @see https://docs.revenuecat.com/docs/reactnative
 */

import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

const API_KEYS = {
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '',
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '',
};

let isInitialized = false;

/**
 * Check if running in Expo Go (where native stores are unavailable)
 * StoreClient = Expo Go, Standalone/Bare = development build
 */
function isExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

// Helper for dev-only logging
const devLog = (...args: unknown[]) => {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

/**
 * Initialize RevenueCat SDK
 * Should be called once on app startup, after auth is ready
 *
 * @param userId - Clerk user ID for cross-device subscription sync
 */
export async function initializePurchases(userId?: string): Promise<void> {
  if (isInitialized) {
    devLog('[Purchases] Already initialized, skipping');
    return;
  }

  if (Platform.OS === 'web') {
    devLog('[Purchases] Web platform not supported, skipping');
    return;
  }

  if (isExpoGo()) {
    devLog('[Purchases] Expo Go detected - native stores unavailable');
    devLog('[Purchases] Use a development build to test purchases');
    return;
  }

  const apiKey = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;

  devLog('[Purchases] Platform:', Platform.OS);
  devLog('[Purchases] User ID:', userId || 'anonymous');

  if (!apiKey) {
    if (__DEV__) {
      console.warn(
        '[Purchases] No API key configured for platform:',
        Platform.OS
      );
    }
    return;
  }

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  }

  try {
    Purchases.configure({ apiKey, appUserID: userId });
    isInitialized = true;
    devLog('[Purchases] SDK initialized successfully');
  } catch (error) {
    if (__DEV__) {
      console.error('[Purchases] Failed to initialize:', error);
    }
  }
}

/**
 * Update the user ID after authentication
 */
export async function identifyUser(userId: string): Promise<void> {
  if (Platform.OS === 'web' || !isInitialized) return;

  try {
    await Purchases.logIn(userId);
    devLog('[Purchases] User logged in:', userId);
  } catch (error) {
    if (__DEV__) {
      console.error('[Purchases] Failed to identify user:', error);
    }
  }
}

/**
 * Clear user identification on logout
 */
export async function logoutPurchases(): Promise<void> {
  if (Platform.OS === 'web' || !isInitialized) return;

  try {
    await Purchases.logOut();
    devLog('[Purchases] User logged out');
  } catch (error) {
    if (__DEV__) {
      console.error('[Purchases] Failed to logout:', error);
    }
  }
}

/**
 * Check if SDK is ready for purchases
 */
export function isPurchasesAvailable(): boolean {
  return isInitialized && Platform.OS !== 'web';
}

export { default as Purchases } from 'react-native-purchases';
