/**
 * Platform-guarded wrapper around RevenueCatUI.presentPaywallIfNeeded.
 * Lazy-loads the native module to avoid crashes on web / Expo Go.
 */

import { Platform } from 'react-native';
import { isExpoGo } from '../../lib/purchases/client';
import type { PaywallOutcome } from './types';

const PREMIUM_ENTITLEMENT = 'premium';

type RevenueCatUIModule = typeof import('react-native-purchases-ui');

let cachedModule: RevenueCatUIModule | null = null;

function loadModule(): RevenueCatUIModule | null {
  if (cachedModule) return cachedModule;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cachedModule = require('react-native-purchases-ui') as RevenueCatUIModule;
    return cachedModule;
  } catch (error_) {
    if (__DEV__) {
      console.warn('[NativePaywall] react-native-purchases-ui unavailable:', error_);
    }
    return null;
  }
}

function isNativeAvailable(): boolean {
  return Platform.OS !== 'web' && !isExpoGo();
}

function mapResult(result: string): PaywallOutcome {
  switch (result) {
    case 'PURCHASED': return 'purchased';
    case 'RESTORED': return 'restored';
    case 'ERROR': return 'error';
    default: return 'cancelled';
  }
}

export async function presentNativePaywall(): Promise<PaywallOutcome | null> {
  if (!isNativeAvailable()) return null;

  const mod = loadModule();
  if (!mod) return null;

  const result = await mod.default.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: PREMIUM_ENTITLEMENT,
  });

  return mapResult(result);
}
