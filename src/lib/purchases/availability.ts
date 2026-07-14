import { Platform } from 'react-native';

import { isExpoGo } from './client';
import { isPurchasesAvailable } from './init';

export type PurchaseRuntime =
  | 'native'
  | 'web'
  | 'expo-go'
  | 'native-unavailable';

export interface PurchaseRuntimeInfo {
  checklist: string[];
  message: string;
  runtime: PurchaseRuntime;
  title: string;
}

export const NATIVE_IAP_VALIDATION_CHECKLIST = [
  'Open this flow in a development client or TestFlight build; Expo Go cannot load RevenueCat native IAP.',
  'Confirm the RevenueCat public SDK key is set for the current platform.',
  'Confirm App Store Connect or Google Play products are active and attached to the RevenueCat offering.',
  'Run purchase and restore with a sandbox tester, then verify the Convex entitlement is updated by the RevenueCat webhook.',
] as const;

export const WEB_PURCHASE_FALLBACK_MESSAGE =
  'Premium purchases and restores are available in the iOS or Android app. Web checkout is not enabled for this build.';

export function getPurchaseRuntimeInfo(): PurchaseRuntimeInfo {
  if (Platform.OS === 'web') {
    return {
      checklist: [],
      message: WEB_PURCHASE_FALLBACK_MESSAGE,
      runtime: 'web',
      title: 'Use the mobile app',
    };
  }

  if (isPurchasesAvailable()) {
    return {
      checklist: [],
      message: '',
      runtime: 'native',
      title: '',
    };
  }

  return {
    checklist: [...NATIVE_IAP_VALIDATION_CHECKLIST],
    message: NATIVE_IAP_VALIDATION_CHECKLIST.join('\n'),
    runtime: isExpoGo() ? 'expo-go' : 'native-unavailable',
    title: 'Native purchase validation needed',
  };
}

export function createPurchasesUnavailableError(): Error {
  const info = getPurchaseRuntimeInfo();
  return Object.assign(new Error(info.message), {
    checklist: info.checklist,
    runtime: info.runtime,
    title: info.title,
  });
}

export function isPurchasesUnavailableError(
  error: unknown
): error is Error & PurchaseRuntimeInfo {
  return (
    typeof error === 'object' &&
    error !== null &&
    'runtime' in error &&
    (error as { runtime?: PurchaseRuntime }).runtime !== 'native'
  );
}
