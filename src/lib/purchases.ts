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
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '',
};

let isInitialized = false;

/**
 * Check if running in Expo Go (where native stores are unavailable)
 */
function isExpoGo(): boolean {
  // In dev builds, executionEnvironment may not be set correctly
  // Check for the presence of the native module instead
  const hasNativeModule = !!Purchases;
  const envCheck = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[Purchases] Environment check:', {
      executionEnvironment: Constants.executionEnvironment,
      storeClient: ExecutionEnvironment.StoreClient,
      envCheck,
      hasNativeModule,
    });
  }

  // If we have the native module, we're NOT in Expo Go
  if (hasNativeModule) {
    return false;
  }

  return envCheck;
}

/**
 * Initialize RevenueCat SDK
 * Should be called once on app startup, after auth is ready
 *
 * @param userId - Clerk user ID for cross-device subscription sync
 */
export async function initializePurchases(userId?: string): Promise<void> {
  if (isInitialized) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[Purchases] Already initialized, skipping');
    }
    return;
  }

  // Skip on web - RevenueCat doesn't support web
  if (Platform.OS === 'web') {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[Purchases] Web platform not supported, skipping');
    }
    return;
  }

  const apiKey = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;

  // Debug: Log API key info (first/last 4 chars only for security)
  if (__DEV__) {
    /* eslint-disable no-console */
    console.log('[Purchases] Environment:', Constants.executionEnvironment);
    console.log('[Purchases] === CONFIGURATION DEBUG ===');
    console.log('[Purchases] Platform:', Platform.OS);
    console.log('[Purchases] API Key configured:', apiKey ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : 'MISSING');
    console.log('[Purchases] User ID:', userId || 'anonymous');
    /* eslint-enable no-console */
  }

  if (!apiKey) {
    console.warn('[Purchases] No API key configured for platform:', Platform.OS);
    return;
  }

  // Enable verbose logging in development
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  }

  try {
    await Purchases.configure({
      apiKey,
      appUserID: userId,
    });

    isInitialized = true;

    // Debug: Fetch and log app info
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[Purchases] SDK initialized successfully');

      try {
        const appUserID = await Purchases.getAppUserID();
        // eslint-disable-next-line no-console
        console.log('[Purchases] App User ID after init:', appUserID);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('[Purchases] Could not get App User ID:', e);
      }

      if (userId) {
        // eslint-disable-next-line no-console
        console.log('[Purchases] User identified:', userId);
      }
    }
  } catch (error) {
    console.error('[Purchases] Failed to initialize:', error);
    // Don't throw - let app continue without purchases
    // This can happen in Expo Go or if SDK has issues
  }
}

/**
 * Update the user ID after authentication
 * Call this when user signs in/out
 */
export async function identifyUser(userId: string): Promise<void> {
  if (Platform.OS === 'web') return;
  if (!isInitialized) {
    console.warn('[Purchases] SDK not initialized, skipping identify');
    return;
  }

  try {
    await Purchases.logIn(userId);
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[Purchases] User logged in:', userId);
    }
  } catch (error) {
    console.error('[Purchases] Failed to identify user:', error);
  }
}

/**
 * Clear user identification on logout
 */
export async function logoutPurchases(): Promise<void> {
  if (Platform.OS === 'web') return;
  if (!isInitialized) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[Purchases] SDK not initialized, skipping logout');
    }
    return;
  }

  try {
    await Purchases.logOut();
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[Purchases] User logged out');
    }
  } catch (error) {
    console.error('[Purchases] Failed to logout:', error);
  }
}

/**
 * Check if SDK is ready for purchases
 */
export function isPurchasesAvailable(): boolean {
  return isInitialized && Platform.OS !== 'web';
}

export { Purchases };
