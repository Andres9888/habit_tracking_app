/**
 * RevenueCat (Purchases) Integration Module
 *
 * Handles in-app purchase functionality through RevenueCat SDK:
 * - SDK initialization with platform-specific API keys
 * - User identification for cross-device subscription sync
 * - Debug logging in development
 * - Expo Go detection (native stores unavailable)
 *
 * @module purchases
 * @category Revenue / In-App Purchases
 * @see https://docs.revenuecat.com/docs/reactnative
 */

import { Platform } from 'react-native';

import Constants, { ExecutionEnvironment } from 'expo-constants';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

const API_KEYS = {
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '',
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '',
};

let isInitialized = false;

/**
 * Check if running in Expo Go (where native stores are unavailable).
 * StoreClient = Expo Go, Standalone/Bare = development build.
 *
 * @returns True if running in Expo Go, false otherwise
 *
 * @example
 * if (isExpoGo()) {
 *   console.log('In-app purchases not available');
 * }
 */
function isExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

/**
 * Initialize RevenueCat SDK.
 * Should be called once on app startup, after auth is ready.
 *
 * @param userId - Optional Clerk user ID for cross-device subscription sync
 * @returns Promise that resolves when initialization completes
 *
 * @example
 * // In app initialization
 * await initializePurchases(user?.id);
 */
export async function initializePurchases(userId?: string): Promise<void> {
  if (isInitialized) {
    return;
  }

  // Skip on web - RevenueCat doesn't support web
  if (Platform.OS === 'web') {
    return;
  }

  // Skip in Expo Go - native stores unavailable
  if (isExpoGo()) {
    if (__DEV__)
      console.log(
        '[Purchases] Expo Go detected - native stores unavailable, skipping'
      );
    return;
  }

  const apiKey = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;

  if (!apiKey) {
    if (__DEV__)
      console.warn(
        '[Purchases] No API key configured for platform:',
        Platform.OS
      );
    return;
  }

  // Enable verbose logging in development
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  }

  try {
    Purchases.configure({
      apiKey,
      appUserID: userId,
    });

    isInitialized = true;
  } catch (error) {
    if (__DEV__) console.error('[Purchases] Failed to initialize:', error);
    // Don't throw - let app continue without purchases
    // This can happen in Expo Go or if SDK has issues
  }
}

/**
 * Update the user ID after authentication.
 * Call this when user signs in to associate purchases with their account.
 *
 * @param userId - Clerk user ID
 * @returns Promise that resolves when identification completes
 *
 * @example
 * // After login
 * await identifyUser(user.id);
 */
export async function identifyUser(userId: string): Promise<void> {
  if (Platform.OS === 'web') return;
  if (!isInitialized) {
    if (__DEV__)
      console.warn('[Purchases] SDK not initialized, skipping identify');
    return;
  }

  try {
    await Purchases.logIn(userId);
  } catch (error) {
    if (__DEV__) console.error('[Purchases] Failed to identify user:', error);
  }
}

/**
 * Clear user identification on logout.
 * Disassociates the current device from the user's purchases.
 *
 * @returns Promise that resolves when logout completes
 *
 * @example
 * // After logout
 * await logoutPurchases();
 */
export async function logoutPurchases(): Promise<void> {
  if (Platform.OS === 'web') return;
  if (!isInitialized) {
    return;
  }

  try {
    await Purchases.logOut();
  } catch (error) {
    if (__DEV__) console.error('[Purchases] Failed to logout:', error);
  }
}

/**
 * Check if SDK is ready for purchases.
 *
 * @returns True if purchases are available, false otherwise
 *
 * @example
 * if (isPurchasesAvailable()) {
 *   // Show premium features or purchase button
 * }
 */
export function isPurchasesAvailable(): boolean {
  return isInitialized && Platform.OS !== 'web';
}

export { default as Purchases } from 'react-native-purchases';
